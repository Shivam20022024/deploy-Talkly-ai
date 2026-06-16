import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def check_db():
    load_dotenv(".env.local")
    uri = os.environ.get("MONGODB_URI")
    db_name = os.environ.get("MONGODB_DB", "voiceai")
    
    print(f"Connecting to: {uri[:20]}...")
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    count = await db.calls.count_documents({})
    print(f"Total calls in DB: {count}")
    
    cursor = db.calls.find().sort("created_at", -1).limit(5)
    async for doc in cursor:
        print(f"ID: {doc.get('call_id')}, Customer: {doc.get('customer_name')}, Status: {doc.get('status')}")

if __name__ == "__main__":
    asyncio.run(check_db())
