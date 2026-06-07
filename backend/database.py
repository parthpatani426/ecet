"""
Database configuration and initialization
"""

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from typing import AsyncGenerator
from config import settings
from models import Base

def _to_async_url(database_url: str) -> str:
    """
    Convert sync postgres URL to asyncpg URL if needed.
    Example:
      postgresql://user:pass@host:5432/db -> postgresql+asyncpg://...
    """
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg_async://", 1)
    if database_url.startswith("postgresql+psycopg_async://"):
        return database_url
    return database_url

DATABASE_URL_ASYNC = _to_async_url(settings.DATABASE_URL)

engine = create_async_engine(
    DATABASE_URL_ASYNC,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for async database session"""
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    """
    Initialize database tables (dev only).
    In production, use Alembic migrations instead.
    """
    if settings.ENVIRONMENT == "production":
        return

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def drop_db():
    """Drop all tables (development only)"""
    if settings.ENVIRONMENT != "production":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    else:
        raise PermissionError("Cannot drop database in production")
