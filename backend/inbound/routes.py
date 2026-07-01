from fastapi import APIRouter, Request, Response
from pydantic import BaseModel
from typing import Optional

from .controller import handle_incoming_call, transfer_call, hangup_call
from .session_manager import get_all_inbound_calls, get_inbound_session

inbound_router = APIRouter()

class TransferRequest(BaseModel):
    destination_number: str

class PurchaseRequest(BaseModel):
    area_code: str = ""

class WebhookRequest(BaseModel):
    webhook_url: str

# Mock storage for phone numbers
mock_phone_numbers = [
    {"number": "+1234567890", "status": "active", "webhook_url": "https://example.com/api/v1/inbound/webhook"}
]

@inbound_router.get("/numbers")
async def get_numbers():
    return {"status": "success", "numbers": mock_phone_numbers}

@inbound_router.post("/numbers/purchase")
async def purchase_number(req: PurchaseRequest):
    new_num = f"+1{req.area_code}5551234"
    mock_phone_numbers.append({
        "number": new_num,
        "status": "active",
        "webhook_url": ""
    })
    return {"status": "success", "number": new_num}

@inbound_router.post("/numbers/{number}/webhook")
async def configure_webhook(number: str, req: WebhookRequest):
    for num in mock_phone_numbers:
        if num["number"] == number:
            num["webhook_url"] = req.webhook_url
            return {"status": "success", "message": "Webhook updated"}
    return {"status": "error", "message": "Number not found"}

@inbound_router.post("/webhook")
async def inbound_webhook(request: Request):
    """
    Receives incoming call event from telephony provider (e.g. Twilio).
    Returns TwiML to connect to AI engine.
    """
    form_data = dict(await request.form())
    twiml_response = await handle_incoming_call(form_data)
    return Response(content=twiml_response, media_type="application/xml")

@inbound_router.get("/calls")
async def get_calls(limit: int = 20, skip: int = 0):
    calls = await get_all_inbound_calls(limit=limit, skip=skip)
    return {"status": "success", "calls": calls}

@inbound_router.get("/{id}")
async def get_call(id: str):
    call = await get_inbound_session(id)
    if call:
        call["_id"] = None
        return {"status": "success", "call": call}
    return {"status": "error", "message": "Not found"}

@inbound_router.post("/{id}/transfer")
async def transfer(id: str, request: TransferRequest):
    result = await transfer_call(id, request.destination_number)
    return result

@inbound_router.post("/{id}/hangup")
async def hangup(id: str):
    result = await hangup_call(id)
    return result
