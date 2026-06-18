import os
from .session_manager import create_inbound_session

async def handle_incoming_call(form_data: dict) -> str:
    """
    Handles the raw incoming webhook from a telephony provider (e.g., Twilio).
    Logs the session and returns TwiML to forward the call to the Bolna agent.
    """
    call_sid = form_data.get("CallSid")
    from_number = form_data.get("From", "Unknown")
    
    # Create the session in the DB
    await create_inbound_session(from_number, call_sid)
    
    # We return TwiML to forward the call to Bolna's SIP or phone number.
    # Replace with actual Bolna SIP URI or routing logic.
    bolna_sip_uri = os.getenv("BOLNA_SIP_URI", "sip:agent@bolna.ai")
    
    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Dial>
        <Sip>{bolna_sip_uri}</Sip>
    </Dial>
</Response>"""
    return twiml

async def transfer_call(call_id: str, destination_number: str) -> dict:
    """
    Initiates a call transfer using the telephony provider's API.
    """
    # Placeholder for actual Twilio REST API transfer logic
    # client.calls(call_id).update(twiml=f'<Response><Dial>{destination_number}</Dial></Response>')
    
    return {"status": "success", "message": f"Transferred to {destination_number}"}

async def hangup_call(call_id: str) -> dict:
    """
    Hangs up the live call using the telephony provider's API.
    """
    # Placeholder for Twilio REST API hangup
    # client.calls(call_id).update(status='completed')
    
    return {"status": "success", "message": "Call terminated"}
