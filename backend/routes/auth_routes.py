from fastapi import APIRouter, HTTPException, Depends, Body
from datetime import datetime, timedelta
import uuid
import mongodb
from auth import get_password_hash, verify_password, create_access_token, get_current_user

auth_router = APIRouter()

@auth_router.post("/register")
async def register_company(payload: dict = Body(...)):
    company_name = payload.get("company_name")
    email = payload.get("email")
    password = payload.get("password")
    user_name = payload.get("name")
    
    if not all([company_name, email, password, user_name]):
        raise HTTPException(status_code=400, detail="Missing required fields")
        
    db = mongodb.get_db()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    company_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())
    
    # Create Company
    company_doc = {
        "company_id": company_id,
        "name": company_name,
        "plan_type": "trial",
        "created_at": datetime.utcnow()
    }
    await db.companies.insert_one(company_doc)
    
    # Create Company Admin User
    user_doc = {
        "user_id": user_id,
        "company_id": company_id,
        "name": user_name,
        "email": email,
        "password_hash": get_password_hash(password),
        "role": "company_admin",
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(user_doc)
    
    # Generate Token
    access_token = create_access_token(
        data={"sub": user_id, "company_id": company_id, "role": "company_admin", "email": email}
    )
    
    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_name,
            "email": email,
            "role": "company_admin",
            "company_id": company_id,
            "company_name": company_name
        }
    }

@auth_router.post("/login")
async def login(payload: dict = Body(...)):
    email = payload.get("email")
    password = payload.get("password")
    
    if not all([email, password]):
        raise HTTPException(status_code=400, detail="Missing email or password")
        
    db = mongodb.get_db()
    user = await db.users.find_one({"email": email})
    
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    company = await db.companies.find_one({"company_id": user["company_id"]})
    company_name = company["name"] if company else "Unknown"
        
    access_token = create_access_token(
        data={"sub": user["user_id"], "company_id": user["company_id"], "role": user["role"], "email": email}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["user_id"],
            "name": user["name"],
            "email": email,
            "role": user["role"],
            "company_id": user["company_id"],
            "company_name": company_name
        }
    }

@auth_router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
