"""
User routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import datetime

from database import get_db
from models import User, Session as DBSession
from schemas import UserProfile, UserBranchInfo
from utils import verify_token, get_branch_guru_url, get_branch_name

router = APIRouter()

async def get_current_user(
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get current authenticated user from JWT token + DB-backed session validation"""

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
        )

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid auth scheme")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )

    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_id = int(payload.get("sub"))

    # Enforce: JWT must map to a valid, non-expired session row
    now = datetime.utcnow()
    session_stmt = select(DBSession).where(
        and_(
            DBSession.user_id == user_id,
            DBSession.token == token,
            DBSession.is_valid == True,  # noqa: E712
            DBSession.expires_at > now,
        )
    )
    db_session = (await db.execute(session_stmt)).scalars().first()
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session is invalid or expired",
        )

    user_stmt = select(User).where(User.id == user_id)
    db_user = (await db.execute(user_stmt)).scalars().first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return db_user

@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get user profile"""
    
    return UserProfile(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        branch=current_user.branch.value,
        email_verified=current_user.email_verified,
        created_at=current_user.created_at,
        is_active=current_user.is_active
    )

@router.get("/branch", response_model=UserBranchInfo)
async def get_branch_info(current_user: User = Depends(get_current_user)):
    """Get user's branch information with guru details"""
    
    return UserBranchInfo(
        branch=current_user.branch.value,
        guru_url=get_branch_guru_url(current_user.branch.value),
        guru_name=f"ECET {get_branch_name(current_user.branch.value)} Guru"
    )

@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    authorization: str = Header(None),
):
    """Logout user by invalidating the current token's DB session row"""

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
        )

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid auth scheme")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )

    await db.execute(
        select(DBSession).where(
            and_(
                DBSession.user_id == current_user.id,
                DBSession.token == token,
            )
        )
    )
    # Proper invalidate
    await db.execute(
        DBSession.__table__.update()
        .where(
            and_(
                DBSession.user_id == current_user.id,
                DBSession.token == token,
            )
        )
        .values(is_valid=False)
    )
    await db.commit()

    return {"message": "✅ Logged out successfully", "status_code": 200}
