"""
Configuration management for ECETX Backend
"""

from pydantic_settings import BaseSettings
from typing import Optional
from datetime import timedelta
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://ecetx_user:ecetx_password@localhost:5432/ecetx_db"
    )
    
    # JWT
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "your-super-secret-key-change-this-in-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Email
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    
    SENDGRID_API_KEY: Optional[str] = os.getenv("SENDGRID_API_KEY")
    RESEND_API_KEY: Optional[str] = os.getenv("RESEND_API_KEY")
    
    FROM_EMAIL: str = os.getenv("FROM_EMAIL", "noreply@ecetx.com")
    
    # OTP
    OTP_EXPIRY_MINUTES: int = 15
    OTP_LENGTH: int = 6
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = ENVIRONMENT == "development"
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost",
        "http://localhost:8000",
        "http://localhost:3000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Validate critical settings in production
if settings.ENVIRONMENT == "production":
    assert settings.SECRET_KEY != "your-super-secret-key-change-this-in-production", \
        "❌ CRITICAL: SECRET_KEY must be set in production"
    assert settings.SMTP_PASSWORD, "❌ CRITICAL: SMTP_PASSWORD must be configured"
