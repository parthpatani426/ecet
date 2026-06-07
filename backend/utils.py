"""
Utility functions for ECETX Backend
"""

import secrets
import string
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from backend.config import settings

# ============ Password Hashing ============

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash password with bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

# ============ JWT Token Management ============

def create_access_token(user_id: int, email: str, branch: str) -> str:
    """Create JWT access token"""
    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode = {
        "sub": str(user_id),
        "email": email,
        "branch": branch,
        "exp": expire,
        "type": "access"
    }
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def create_refresh_token(user_id: int) -> str:
    """Create JWT refresh token"""
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "sub": str(user_id),
        "exp": expire,
        "type": "refresh"
    }
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None

# ============ OTP Generation ============

def generate_otp(length: int = settings.OTP_LENGTH) -> str:
    """Generate OTP"""
    return ''.join(secrets.choice(string.digits) for _ in range(length))

# ============ Email Validation ============

BRANCH_GURU_URLS = {
    "ece": "https://chatgpt.com/g/g-6a24001154b08191812b13cde8e9ca5d-ecet-ece",
    "eee": "https://chatgpt.com/g/g-6a23e587545881919dba2917c1fdd4c6-ecet-eee-guru",
    "cme": "https://chatgpt.com/g/g-6a23cdffc82c8191a95dc0f00760fbb3-ecet-cme-guru",
    "civil": "https://chatgpt.com/g/g-6a23febe57f08191ba68c5317a1e0e99-ap-ecet-civil",
    "mechanical": "https://chatgpt.com/g/g-6a23eb5942c08191b73f6f97611b7528-ecet-mech"
}

def get_branch_guru_url(branch: str) -> str:
    """Get GPT URL for branch"""
    return BRANCH_GURU_URLS.get(branch.lower())

BRANCH_NAMES = {
    "ece": "Electronics & Communication Engineering",
    "eee": "Electrical & Electronics Engineering",
    "cme": "Computer Science & Engineering",
    "civil": "Civil Engineering",
    "mechanical": "Mechanical Engineering"
}

def get_branch_name(branch: str) -> str:
    """Get full branch name"""
    return BRANCH_NAMES.get(branch.lower(), branch)
