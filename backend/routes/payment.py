import datetime
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from jose import jwt, JWTError
import httpx
from backend.config import settings

router = APIRouter(prefix="/api/payment", tags=["Payment"])

class VerifySessionRequest(BaseModel):
    session_id: str

class VerifyTokenRequest(BaseModel):
    token: str

class CreateSessionRequest(BaseModel):
    price_id: str | None = None
    plan: str = "batch_100"  # batch_100 (2.99), batch_500 (4.99), batch_pro (9.99)
    success_url: str
    cancel_url: str

def create_access_token(data: dict, expires_delta: datetime.timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.now(datetime.timezone.utc) + expires_delta
    else:
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=settings.JWT_EXPIRATION_HOURS)
    to_encode.update({"exp": expire, "iat": datetime.datetime.now(datetime.timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

@router.post("/verify-session")
async def verify_stripe_session(payload: VerifySessionRequest):
    """
    Verifies a Stripe Checkout Session ID. If verified and paid, returns a signed JWT
    that unlocks premium limits client-side without storing anything in a database.
    """
    session_id = payload.session_id.strip()
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")
        
    # If Stripe Secret Key is not configured (e.g. dev/demo mode), accept demo session or mock verify
    if not settings.STRIPE_SECRET_KEY:
        # Development / Demo bypass mode
        token = create_access_token({
            "sub": "demo_user",
            "plan": "unlimited",
            "max_docs": 1000,
            "session_id": session_id,
            "unlocked": True
        })
        return {
            "success": True,
            "message": "Payment verified (Demo Mode)",
            "token": token,
            "max_docs": 1000
        }
    
    # Query Stripe API directly via HTTP
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"https://api.stripe.com/v1/checkout/sessions/{session_id}",
                auth=(settings.STRIPE_SECRET_KEY, ""),
                timeout=10.0
            )
            if res.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid Stripe session ID or checkout incomplete")
            
            data = res.json()
            payment_status = data.get("payment_status")
            
            if payment_status != "paid":
                raise HTTPException(status_code=400, detail=f"Payment not completed (status: {payment_status})")
            
            # Determine doc limit from session metadata or line items
            plan_tier = data.get("metadata", {}).get("plan", "batch_500")
            max_docs = 500 if plan_tier == "batch_500" else (100 if plan_tier == "batch_100" else 2000)
            
            token = create_access_token({
                "sub": data.get("customer_email") or "paid_customer",
                "plan": plan_tier,
                "max_docs": max_docs,
                "session_id": session_id,
                "unlocked": True
            })
            
            return {
                "success": True,
                "message": "Payment verified successfully",
                "token": token,
                "max_docs": max_docs
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Error connecting to payment provider: {str(e)}")

@router.post("/validate-token")
async def validate_token(payload: VerifyTokenRequest):
    """
    Validates an existing JWT token to check if user still has premium access.
    """
    try:
        decoded = jwt.decode(payload.token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return {
            "valid": True,
            "max_docs": decoded.get("max_docs", 500),
            "plan": decoded.get("plan", "premium"),
            "expires_at": decoded.get("exp")
        }
    except JWTError:
        return {"valid": False, "max_docs": settings.FREE_PDF_LIMIT, "plan": "free"}
