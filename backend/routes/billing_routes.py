from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import Dict, Any, List
import mongodb
from auth import get_current_user
from services.billing_service import billing_service
from services.payment_provider import payment_provider

billing_router = APIRouter()

class OrderRequest(BaseModel):
    amount: float
    currency: str = "INR"

class VerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@billing_router.get("/wallet")
async def get_wallet_dashboard(current_user: dict = Depends(get_current_user)):
    db = mongodb.get_db()
    return await billing_service.get_dashboard_data(db, current_user["company_id"])

@billing_router.get("/transactions")
async def get_transactions(limit: int = 50, skip: int = 0, current_user: dict = Depends(get_current_user)):
    db = mongodb.get_db()
    cursor = db.transactions.find({"company_id": current_user["company_id"]}).sort("created_at", -1).skip(skip).limit(limit)
    transactions = []
    async for tx in cursor:
        tx["_id"] = None
        transactions.append(tx)
    return transactions

@billing_router.get("/usage")
async def get_usage(limit: int = 50, skip: int = 0, current_user: dict = Depends(get_current_user)):
    db = mongodb.get_db()
    cursor = db.usage_records.find({"company_id": current_user["company_id"]}).sort("created_at", -1).skip(skip).limit(limit)
    usage = []
    async for u in cursor:
        u["_id"] = None
        usage.append(u)
    return usage

@billing_router.post("/wallet/create-order")
async def create_order(req: OrderRequest, current_user: dict = Depends(get_current_user)):
    try:
        # Create Razorpay order
        notes = {"company_id": current_user["company_id"]}
        order = payment_provider.create_order(amount=req.amount, currency=req.currency, notes=notes)
        return {"status": "success", "order": order}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@billing_router.post("/wallet/verify-payment")
async def verify_payment(req: VerifyRequest, current_user: dict = Depends(get_current_user)):
    is_valid = payment_provider.verify_payment_signature(
        order_id=req.razorpay_order_id,
        payment_id=req.razorpay_payment_id,
        signature=req.razorpay_signature
    )
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
        
    # We should ideally fetch order amount from Razorpay API, 
    # but for this demo, we'll assume the frontend passed it correctly or verify via webhook.
    # In a real scenario, this endpoint could just acknowledge and wait for webhook.
    # We'll rely on the webhook for actual credit, or do it here if we trust the verified order.
    # Let's mock a fixed 1000 credit if it's the test payload for simplicity in V1, 
    # or rely on webhook instead. For local testing without webhooks, we'll credit here:
    
    # In a production system, you'd fetch the order from Razorpay to get the exact amount:
    # order_details = payment_provider.fetch_order(req.razorpay_order_id)
    # amount = order_details['amount'] / 100
    
    # For now, let's just use a fixed 1000 INR for testing if verification passes
    # Wait, we can't hardcode. We should use the webhook.
    # Actually, Razorpay payment verification means the payment succeeded.
    # Let's just return success, and the actual credit happens in webhook.
    return {"status": "success", "message": "Payment verified. Wallet will be credited shortly."}

@billing_router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get("x-razorpay-signature", "")
    
    is_valid = payment_provider.verify_webhook_signature(payload.decode('utf-8'), signature)
    
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid signature")
        
    import json
    data = json.loads(payload)
    
    event = data.get("event")
    if event == "payment.captured":
        payment_entity = data["payload"]["payment"]["entity"]
        amount = payment_entity["amount"] / 100.0
        company_id = payment_entity.get("notes", {}).get("company_id")
        transaction_id = payment_entity["id"]
        
        if company_id:
            db = mongodb.get_db()
            from services.billing_service import billing_service
            await billing_service.add_credits(
                db=db,
                company_id=company_id,
                amount=amount,
                payment_provider="razorpay",
                provider_transaction_id=transaction_id,
                description=f"Wallet top-up via Razorpay"
            )
            
    return {"status": "ok"}
