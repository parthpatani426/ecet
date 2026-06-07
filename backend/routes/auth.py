"""
Authentication routes (Async SQLAlchemy)
"""

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database import get_db
from models import OTPToken, Session as DBSession, User
from schemas import (
    EmailVerificationRequest,
    EmailVerificationResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    TokenRefreshRequest,
    TokenRefreshResponse,
)
from services.email_service import EmailService
from utils import (
    create_access_token,
    create_refresh_token,
    generate_otp,
    get_branch_guru_url,
    get_branch_name,
    hash_password,
    verify_password,
    verify_token,
)

router = APIRouter()
email_service = EmailService()


def _is_allowed_gmail(recipient_email: str) -> bool:
    email = (recipient_email or "").strip().lower()
    return email.endswith("@gmail.com") or email.endswith("@googlemail.com")


@router.post("/register", response_model=RegisterResponse)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """
    Register a new user with branch.

    Constraints implemented in code:
    - Only Gmail/Google Mail addresses are allowed.
    - Email is globally unique (so the same email cannot be used across branches).
    """
    if not _is_allowed_gmail(request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="❌ Only Gmail/Google Mail addresses (@gmail.com / @googlemail.com) are supported.",
        )

    existing_stmt = select(User).where(User.email == request.email)
    existing_user = (await db.execute(existing_stmt)).scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="❌ This email is already registered. ECETX allows one account per email across branches.",
        )

    db_user = User(
        name=request.name,
        email=request.email,
        password_hash=hash_password(request.password),
        branch=request.branch,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    otp_code = generate_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)

    otp_token = OTPToken(
        user_id=db_user.id,
        code=otp_code,
        type="email_verification",
        expires_at=otp_expires,
    )
    db.add(otp_token)
    await db.commit()

    try:
        await email_service.send_verification_email(
            email=request.email,
            name=request.name,
            otp_code=otp_code,
        )
    except Exception as e:
        print(f"⚠️ Email sending failed: {e}")

    return RegisterResponse(
        id=db_user.id,
        name=db_user.name,
        email=db_user.email,
        branch=db_user.branch.value,
        message="✅ Registration successful! Check your email for verification code.",
        status_code=201,
    )


@router.post("/verify-email", response_model=EmailVerificationResponse)
async def verify_email(request: EmailVerificationRequest, db: AsyncSession = Depends(get_db)):
    """Verify email with OTP code."""
    user_stmt = select(User).where(User.email == request.email)
    db_user = (await db.execute(user_stmt)).scalars().first()

    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if db_user.email_verified:
        return EmailVerificationResponse(message="✅ Email already verified", status_code=200)

    otp_stmt = select(OTPToken).where(
        and_(
            OTPToken.user_id == db_user.id,
            OTPToken.code == request.code,
            OTPToken.type == "email_verification",
            OTPToken.used == False,  # noqa: E712
            OTPToken.expires_at > datetime.utcnow(),
        )
    )
    otp_token = (await db.execute(otp_stmt)).scalars().first()

    if not otp_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="❌ Invalid or expired OTP code",
        )

    otp_token.used = True
    db_user.email_verified = True
    db_user.is_active = True
    await db.commit()

    try:
        await email_service.send_welcome_email(
            email=db_user.email,
            name=db_user.name,
            branch=db_user.branch.value,
        )
    except Exception as e:
        print(f"⚠️ Welcome email sending failed: {e}")

    return EmailVerificationResponse(message="✅ Email verified successfully!", status_code=200)


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Login user with email and password."""
    user_stmt = select(User).where(User.email == request.email)
    db_user = (await db.execute(user_stmt)).scalars().first()

    if not db_user or not verify_password(request.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="❌ Invalid email or password",
        )

    if not db_user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="❌ Account is deactivated")

    if not db_user.email_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="❌ Email is not verified")

    access_token = create_access_token(
        user_id=db_user.id,
        email=db_user.email,
        branch=db_user.branch.value,
    )
    refresh_token = create_refresh_token(user_id=db_user.id)

    session_expires = datetime.utcnow() + timedelta(days=7)
    db_session = DBSession(
        user_id=db_user.id,
        token=access_token,
        expires_at=session_expires,
    )
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user={
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "branch": db_user.branch.value,
            "branch_name": get_branch_name(db_user.branch.value),
            "guru_url": get_branch_guru_url(db_user.branch.value),
            "email_verified": db_user.email_verified,
        },
        status_code=200,
    )


@router.post("/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(request: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Initiate password reset flow (OTP)."""
    if not _is_allowed_gmail(request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="❌ Only Gmail/Google Mail addresses are supported for password reset emails.",
        )

    user_stmt = select(User).where(User.email == request.email)
    db_user = (await db.execute(user_stmt)).scalars().first()

    if not db_user:
        return ForgotPasswordResponse(
            message="✅ If an account exists, you'll receive a password reset code",
            status_code=200,
        )

    otp_code = generate_otp()
    otp_expires = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)

    await db.execute(
        delete(OTPToken).where(
            and_(
                OTPToken.user_id == db_user.id,
                OTPToken.type == "password_reset",
                OTPToken.used == False,  # noqa: E712
            )
        )
    )

    otp_token = OTPToken(
        user_id=db_user.id,
        code=otp_code,
        type="password_reset",
        expires_at=otp_expires,
    )
    db.add(otp_token)
    await db.commit()

    try:
        await email_service.send_password_reset_email(
            email=request.email,
            name=db_user.name,
            otp_code=otp_code,
        )
    except Exception as e:
        print(f"⚠️ Email sending failed: {e}")

    return ForgotPasswordResponse(
        message="✅ If an account exists, you'll receive a password reset code",
        status_code=200,
    )


@router.post("/reset-password", response_model=ResetPasswordResponse)
async def reset_password(request: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Reset password with OTP."""
    if not _is_allowed_gmail(request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="❌ Only Gmail/Google Mail addresses are supported for password reset emails.",
        )

    user_stmt = select(User).where(User.email == request.email)
    db_user = (await db.execute(user_stmt)).scalars().first()

    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    otp_stmt = select(OTPToken).where(
        and_(
            OTPToken.user_id == db_user.id,
            OTPToken.code == request.code,
            OTPToken.type == "password_reset",
            OTPToken.used == False,  # noqa: E712
            OTPToken.expires_at > datetime.utcnow(),
        )
    )
    otp_token = (await db.execute(otp_stmt)).scalars().first()

    if not otp_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="❌ Invalid or expired reset code",
        )

    db_user.password_hash = hash_password(request.new_password)
    otp_token.used = True

    # Invalidate all existing sessions
    await db.execute(
        update(DBSession)
        .where(and_(DBSession.user_id == db_user.id, DBSession.is_valid == True))  # noqa: E712
        .values(is_valid=False)
    )

    await db.commit()

    try:
        await email_service.send_password_reset_confirmation(email=request.email, name=db_user.name)
    except Exception as e:
        print(f"⚠️ Email sending failed: {e}")

    return ResetPasswordResponse(
        message="✅ Password reset successfully! Please login with your new password.",
        status_code=200,
    )


@router.post("/refresh-token", response_model=TokenRefreshResponse)
async def refresh_token(request: TokenRefreshRequest, db: AsyncSession = Depends(get_db)):
    """Refresh JWT access token (basic refresh JWT validation)."""
    payload = verify_token(request.refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="❌ Invalid refresh token")

    user_id = int(payload.get("sub"))

    user_stmt = select(User).where(User.id == user_id)
    db_user = (await db.execute(user_stmt)).scalars().first()

    if not db_user or not db_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="❌ User not found or inactive")

    new_access_token = create_access_token(
        user_id=db_user.id,
        email=db_user.email,
        branch=db_user.branch.value,
    )

    return TokenRefreshResponse(access_token=new_access_token, token_type="bearer")
