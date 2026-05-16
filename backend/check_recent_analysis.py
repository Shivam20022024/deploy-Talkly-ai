import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import json

async def check_recent():
    load_dotenv(".env.local")
    uri = os.environ.get("MONGODB_URI")
    db_name = os.environ.get("MONGODB_DB", "voiceai")
    
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    print("Checking most recent Analyzed call...")
    doc = await db.calls.find_one({"status": "Analyzed"}, sort=[("created_at", -1)])
    if doc:
        print(f"ID: {doc.get('call_id')}")
        print(f"Customer: {doc.get('customer_name')}")
        print(f"Summary: {doc.get('summary')}")
        print(f"Transcript Length: {len(doc.get('transcript', ''))}")
        # print(f"Analysis: {json.dumps(doc.get('analysis', {}), indent=2)}")
    else:
        print("No 'Analyzed' calls found.")

if __name__ == "__main__":
    asyncio.run(check_recent())
