"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from enum import Enum

class BranchEnum(str, Enum):
    """Available branches"""
    ECE = "ece"
    EEE = "eee"
    CME = "cme"
    CIVIL = "civil"
    MECHANICAL = "mechanical"

# ============ Authentication Schemas ============

class RegisterRequest(BaseModel):
    """User registration request"""
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=255)
    branch: BranchEnum

class RegisterResponse(BaseModel):
    """User registration response"""
    id: int
    name: str
    email: str
    branch: str
    message: str
    status_code: int

class LoginRequest(BaseModel):
    """User login request"""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    """User login response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict
    status_code: int

class TokenRefreshRequest(BaseModel):
    """Token refresh request"""
    refresh_token: str

class TokenRefreshResponse(BaseModel):
    """Token refresh response"""
    access_token: str
    token_type: str = "bearer"

class EmailVerificationRequest(BaseModel):
    """Email verification request"""
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)

class EmailVerificationResponse(BaseModel):
    """Email verification response"""
    message: str
    status_code: int

class ForgotPasswordRequest(BaseModel):
    """Forgot password request"""
    email: EmailStr

class ForgotPasswordResponse(BaseModel):
    """Forgot password response"""
    message: str
    status_code: int

class ResetPasswordRequest(BaseModel):
    """Reset password request"""
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=8, max_length=255)

class ResetPasswordResponse(BaseModel):
    """Reset password response"""
    message: str
    status_code: int

# ============ User Schemas ============

class UserProfile(BaseModel):
    """User profile response"""
    id: int
    name: str
    email: str
    branch: str
    email_verified: bool
    created_at: datetime
    is_active: bool

class BranchInfo(BaseModel):
    """Branch information"""
    name: str
    id: str
    guru_url: str

class UserBranchInfo(BaseModel):
    """User branch information"""
    branch: str
    guru_url: str
    guru_name: str

# ============ Error Schemas ============

class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    detail: str
    status_code: int
    timestamp: datetime
