import asyncio

from app.db import SessionLocal, init_db
from app.seed import seed


async def main() -> None:
    await init_db()
    async with SessionLocal() as session:
        await seed(session)
    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(main())
