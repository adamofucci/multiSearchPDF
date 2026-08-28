from fastapi import APIRouter
from backend.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT
    }

@router.get("/api/config")
async def public_config():
    return {
        "free_limit": settings.FREE_PDF_LIMIT,
        "service_name": settings.PROJECT_NAME
    }
