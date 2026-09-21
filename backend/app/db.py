import ssl
from collections.abc import AsyncIterator
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


class Base(DeclarativeBase):
    pass


def _build_engine(url: str):
    """Build the async engine, adding TLS for managed Postgres hosts.

    Hosted providers (Neon, Render, Supabase, ...) require TLS and are
    commonly given as a URL with a `sslmode=require` query param, which
    asyncpg does not understand as a connect kwarg. Strip any ssl-related
    query params and instead pass a default SSL context via connect_args
    when the URL points at a non-local Postgres host.
    """
    parts = urlsplit(url)
    connect_args: dict = {}

    if parts.scheme.startswith("postgresql"):
        query_pairs = [
            (k, v) for k, v in parse_qsl(parts.query) if k.lower() not in ("sslmode", "ssl")
        ]
        url = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query_pairs), parts.fragment))

        host = parts.hostname or ""
        if host not in ("localhost", "127.0.0.1", "db"):
            connect_args["ssl"] = ssl.create_default_context()

    return create_async_engine(url, echo=False, connect_args=connect_args)


engine = _build_engine(settings.database_url)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncIterator[AsyncSession]:
    async with SessionLocal() as session:
        yield session


async def init_db(engine_=None) -> None:
    from app import models  # noqa: F401  (register models)

    target = engine_ or engine
    async with target.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
