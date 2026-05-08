from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
async def login(credentials: LoginRequest):
    if credentials.email == "raaja@gmail.com" and credentials.password == "raaja123":
        return {
            "status": "success",
            "message": "Login successful",
            "user": {
                "email": credentials.email,
                "name": "Raaja"
            }
        }
    
    raise HTTPException(
        status_code=401, 
        detail="Invalid email or password. Please check your credentials and try again"
    )
