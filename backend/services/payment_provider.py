import os
import hmac
import hashlib
import json
import uuid
from typing import Dict, Any, Tuple
import requests

class RazorpayProvider:
    def __init__(self):
        self.key_id = os.environ.get("RAZORPAY_KEY_ID")
        self.key_secret = os.environ.get("RAZORPAY_KEY_SECRET")
        self.webhook_secret = os.environ.get("RAZORPAY_WEBHOOK_SECRET")
        self.base_url = "https://api.razorpay.com/v1"

    def is_configured(self) -> bool:
        return bool(self.key_id and self.key_secret)

    def create_order(self, amount: float, currency: str = "INR", receipt_id: str = None, notes: Dict[str, str] = None) -> Dict[str, Any]:
        if not self.is_configured():
            # For testing without razorpay keys, return a mock order
            return {
                "id": f"mock_order_{uuid.uuid4().hex[:10]}",
                "entity": "order",
                "amount": int(amount * 100),
                "amount_paid": 0,
                "amount_due": int(amount * 100),
                "currency": currency,
                "receipt": receipt_id or "",
                "status": "created",
                "notes": notes or {}
            }

        # Razorpay amount is in paise
        payload = {
            "amount": int(amount * 100),
            "currency": currency,
            "receipt": receipt_id or str(uuid.uuid4()),
            "notes": notes or {}
        }
        
        response = requests.post(
            f"{self.base_url}/orders",
            auth=(self.key_id, self.key_secret),
            json=payload,
            timeout=10
        )
        
        if not response.ok:
            raise Exception(f"Failed to create Razorpay order: {response.text}")
            
        return response.json()

    def verify_payment_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        if not self.is_configured():
            # Mock verification
            return True
            
        payload = f"{order_id}|{payment_id}"
        generated_signature = hmac.new(
            self.key_secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(generated_signature, signature)

    def verify_webhook_signature(self, payload_body: str, signature: str) -> bool:
        if not self.webhook_secret:
            return True # Mock for local dev without secret
            
        generated_signature = hmac.new(
            self.webhook_secret.encode(),
            payload_body.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(generated_signature, signature)

payment_provider = RazorpayProvider()
