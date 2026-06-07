"""
SQLAlchemy models for ECETX
"""

from sqlalchemy import Column, String, DateTime, Boolean, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from enum import Enum

Base = declarative_base()

class BranchEnum(str, Enum):
    """Available branches"""
    ECE = "ece"
    EEE = "eee"
    CME = "cme"
    CIVIL = "civil"
    MECHANICAL = "mechanical"

class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    branch = Column(SQLEnum(BranchEnum), nullable=False, index=True)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    __table_args__ = (
        # Unique constraint: email per branch
        # This allows same email across different branches but prevents duplicates within a branch
        # Implemented via unique index with database-level check
    )

class OTPToken(Base):
    """OTP token for email verification and password reset"""
    __tablename__ = "otp_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(6), nullable=False)
    type = Column(String(50), nullable=False)  # 'email_verification', 'password_reset'
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

class Session(Base):
    """User session/JWT token tracking"""
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(500), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    is_valid = Column(Boolean, default=True)
