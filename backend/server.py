# server.py
import os
import sys
import warnings

# Suppress pydub RuntimeWarnings
warnings.filterwarnings("ignore", category=RuntimeWarning, module="pydub")

# Configure FFmpeg paths at the very start to suppress pydub warnings
USER_FFMPEG_BIN = r"C:\Users\brijb\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1-full_build\bin"
if os.path.exists(USER_FFMPEG_BIN):
    os.environ["PATH"] += os.pathsep + USER_FFMPEG_BIN

import time
import json
import uuid
import asyncio
import requests
import mimetypes
import subprocess
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, HTTPException, Body, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from process_audio import process_uploaded_audio, get_weekly_excel_file, analyze_transcript_text
import mongodb
from fastapi.responses import FileResponse
from dotenv import load_dotenv

from contextlib import asynccontextmanager

# Load env values
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env.local"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await mongodb.ensure_indexes()
    print("--- PROVIDER CONFIG ---")
    print(f"OpenRouter Analysis: {os.environ.get('OPENROUTER_MODEL', 'Not Set')} (Key: {bool(os.environ.get('OPENROUTER_API_KEY'))})")
    print(f"OpenAI Analysis: gpt-4o (Key: {bool(os.environ.get('OPENAI_API_KEY'))})")
    yield
    # Shutdown logic (if any)

app = FastAPI(lifespan=lifespan)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8000")

# Startup logic moved to lifespan context manager above

@app.get("/calls")
async def get_calls(limit: int = 20, skip: int = 0):
    db = mongodb.get_db()
    cursor = db.calls.find().sort("created_at", -1).skip(skip).limit(limit)
    calls = []
    async for d in cursor:
        d["_id"] = None
        calls.append(d)
    return calls

@app.get("/calls/{call_id}")
async def get_call(call_id: str):
    db = mongodb.get_db()
    doc = await db.calls.find_one({"call_id": call_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Call not found")
    doc["_id"] = None
    return doc

@app.post("/calls/trigger")
async def trigger_bolna_call(payload: dict = Body(...)):
    phone_number = payload.get("phone_number")
    lead_id = payload.get("lead_id")

    api_key = os.environ.get("BOLNA_API_KEY", "").strip()
    agent_id = os.environ.get("BOLNA_AGENT_ID", "").strip()

    if not api_key or not agent_id:
        raise HTTPException(status_code=400, detail="Bolna.ai API Key or Agent ID not configured")

    db = mongodb.get_db()
    
    # Always fetch latest BASE_URL to ensure it reflects current ngrok/tunnel
    current_base_url = os.environ.get("BASE_URL", "http://localhost:8000").strip()
    
    await db.calls.insert_one({
        "call_id": lead_id,
        "customer_id": phone_number,
        "customer_name": "Phone Lead",
        "transcript": "",
        "status": "Initiating",
        "created_at": datetime.utcnow(),
        "language": "English/Hindi"
    })

    url = "https://api.bolna.ai/call"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    bolna_payload = {
        "agent_id": agent_id,
        "recipient_phone_number": phone_number,
        "webhook_url": f"{current_base_url}/webhooks/bolna",
        "user_data": {
            "lead_id": lead_id,
            "customer_name": "Phone Lead",
            "agent_name": "AI Agent"
        }
    }

    try:
        print(f"Triggering Bolna call to {phone_number} with webhook_url: {bolna_payload['webhook_url']}")
        response = requests.post(url, json=bolna_payload, headers=headers, timeout=30)
        
        if not response.ok:
            await db.calls.update_one({"call_id": lead_id}, {"$set": {"status": "Failed"}})
            raise HTTPException(status_code=response.status_code, detail=f"Bolna Error: {response.text}")
        
        bolna_data = response.json()
        execution_id = bolna_data.get("execution_id")
        
        if execution_id:
            # Start a background polling task as a fallback for webhooks
            asyncio.create_task(poll_bolna_execution(execution_id, lead_id, api_key))
            
        return bolna_data
    except Exception as e:
        await db.calls.update_one({"call_id": lead_id}, {"$set": {"status": "Error"}})
        raise HTTPException(status_code=500, detail=f"API Error: {str(e)}")

async def poll_bolna_execution(execution_id: str, lead_id: str, api_key: str):
    """
    Polls Bolna API for transcript updates in case webhooks fail.
    """
    db = mongodb.get_db()
    url = f"https://api.bolna.ai/executions/{execution_id}"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    log_msg = f"Starting polling fallback for Execution {execution_id} (Lead: {lead_id})"
    print(log_msg)
    with open("bolna_polling.log", "a") as f:
        f.write(f"{datetime.utcnow().isoformat()} - {log_msg}\n")
    
    # Poll for up to 10 minutes
    for i in range(60): 
        try:
            await asyncio.sleep(10)
            # Use run_in_threadpool for blocking requests.get
            response = await run_in_threadpool(requests.get, url, headers=headers, timeout=15)
            
            if response.ok:
                # Force UTF-8 decoding for Hindi/International characters
                response.encoding = 'utf-8'
                data = response.json()
                transcript = data.get("transcript", "")
                status = data.get("status", "Active")
                
                with open("bolna_polling.log", "a") as f:
                    f.write(f"{datetime.utcnow().isoformat()} - Poll {i}: Status={status}, TranscriptLen={len(transcript)}\n")

                if transcript:
                    update_data = {
                        "transcript": transcript,
                        "last_poll_at": datetime.utcnow().isoformat() + "Z"
                    }
                    
                    if status.lower() in ["completed", "finished", "ended"]:
                        print(f"Polling: Call {lead_id} completed. Triggering analysis...")
                        analysis_result = await run_in_threadpool(analyze_transcript_text, transcript)
                        if analysis_result:
                            update_data.update({
                                "status": "Analyzed",
                                "summary": analysis_result.get("summary"),
                                "sentiment": analysis_result.get("sentiment"),
                                "analysis": analysis_result
                            })
                        else:
                            update_data["status"] = "Completed"
                        
                        await db.calls.update_one({"call_id": lead_id}, {"$set": update_data})
                        break # Stop polling
                    else:
                        update_data["status"] = "Active"
                        await db.calls.update_one({"call_id": lead_id}, {"$set": update_data})
            else:
                with open("bolna_polling.log", "a") as f:
                    f.write(f"{datetime.utcnow().isoformat()} - Poll {i}: API Error {response.status_code}\n")
                    
        except Exception as e:
            err_msg = f"Polling error for {lead_id}: {str(e)}"
            print(err_msg)
            with open("bolna_polling.log", "a") as f:
                f.write(f"{datetime.utcnow().isoformat()} - {err_msg}\n")
    
    print(f"Finished polling fallback for {lead_id}")

@app.post("/webhooks/bolna")
async def bolna_webhook(data: dict = Body(...)):
    db = mongodb.get_db()
    
    # Save to log file
    with open("bolna_webhook.log", "a") as f:
        f.write(f"{datetime.utcnow().isoformat()} - {json.dumps(data)}\n")
        
    print(f"WEBHOOK RECEIVED FROM BOLNA: {json.dumps(data)[:300]}...")
    
    user_data = data.get("user_data") or {}
    if isinstance(user_data, str):
        try: user_data = json.loads(user_data)
        except: user_data = {}
            
    lead_id = user_data.get("lead_id") or data.get("lead_id") or data.get("call_id")
    transcript = data.get("transcript") or data.get("conversation_history") or data.get("telephony_data", {}).get("transcript", "")
    status = data.get("status", "Active")
    
    if not lead_id:
        phone = data.get("recipient_phone_number") or data.get("telephony_data", {}).get("to_number")
        if phone:
            phone_clean = phone.replace('+', '').strip()
            potential_call = await db.calls.find_one({
                "customer_id": {"$regex": f"{phone_clean}$"}, 
                "status": {"$in": ["Initiating", "Active"]}
            })
            if potential_call:
                lead_id = potential_call["call_id"]

    if lead_id:
        update_data = {
            "transcript": transcript,
            "last_webhook_at": datetime.utcnow().isoformat() + "Z"
        }
        
        if status.lower() in ["completed", "finished", "ended"]:
            print(f"Call {lead_id} completed. Triggering AI Analysis...")
            try:
                analysis_result = await run_in_threadpool(analyze_transcript_text, transcript)
                if analysis_result:
                    update_data.update({
                        "status": "Analyzed",
                        "summary": analysis_result.get("summary"),
                        "sentiment": analysis_result.get("sentiment"),
                        "analysis": analysis_result
                    })
                else:
                    update_data["status"] = "Completed"
            except Exception as e:
                print(f"Analysis failed for {lead_id}: {str(e)}")
                update_data["status"] = "Completed"
        else:
            update_data["status"] = "Active"

        await db.calls.update_one({"call_id": lead_id}, {"$set": update_data})
    return {"status": "success"}

@app.post("/process-audio")
async def process_audio_api(
    file: UploadFile = File(...), 
    agent_name: str = Form("AI Agent"),
    employee_id: str = Form(None),
    employee_email: str = Form(None)
):
    temp_path = None
    try:
        timestamp = int(time.time() * 1000)
        temp_path = f"temp_{timestamp}_{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        
        result = await run_in_threadpool(process_uploaded_audio, temp_path)
        now = datetime.utcnow()
        unique_call_id = f"call_{timestamp}"
        doc = {
            "call_id": unique_call_id,
            "customer_id": result.get("analysis", {}).get("customer_name") or "Phone Lead",
            "customer_name": result.get("analysis", {}).get("customer_name") or "Phone Lead",
            "agent_name": agent_name,
            "employee_id": employee_id,
            "employee_email": employee_email,
            "sentiment": str(result.get("sentiment", "neutral")).lower(),
            "summary": result.get("summary"),
            "transcript": result.get("transcript"),
            "analysis": result.get("analysis", {}),
            "created_at": now,
            "status": "Analyzed"
        }
        db = mongodb.get_db()
        await db.calls.insert_one(doc)
        doc["_id"] = None
        if temp_path and os.path.exists(temp_path): os.remove(temp_path)
        return doc
    except Exception as e:
        print(f"ERROR PROCESSING AUDIO: {str(e)}")
        if temp_path and os.path.exists(temp_path): os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{report_type}")
async def download_report(report_type: str):
    # Mock download for demo
    return {"status": "success", "message": f"{report_type} report ready"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
