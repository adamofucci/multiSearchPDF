import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DocSweep"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")
    
    # Stripe Configuration
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    # JWT Session Token Secret (used for stateless payment verification)
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-key-change-in-production-random-32-chars")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # Business logic limits
    FREE_PDF_LIMIT: int = int(os.getenv("FREE_PDF_LIMIT", "10"))
    
    class Config:
        case_sensitive = True

settings = Settings()
