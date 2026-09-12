import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db import Base, get_session, init_db
from app.main import app
from app.seed import seed


@pytest.fixture
async def client():
    engine = create_async_engine(
        "sqlite+aiosqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    await init_db(engine)
    SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
    async with SessionLocal() as session:
        await seed(session)

    async def override():
        async with SessionLocal() as session:
            yield session

    app.dependency_overrides[get_session] = override
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()
    await engine.dispose()


@pytest.mark.asyncio
async def test_health(client):
    res = await client.get("/health")
    assert res.status_code == 200


@pytest.mark.asyncio
async def test_categories(client):
    res = await client.get("/api/categories")
    assert res.status_code == 200
    data = res.json()
    assert any(c["slug"] == "casual" for c in data)


@pytest.mark.asyncio
async def test_products_list(client):
    res = await client.get("/api/products")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 16
    assert len(data["items"]) == 9
    assert data["items"][0]["category"]["slug"]


@pytest.mark.asyncio
async def test_products_filter_by_category(client):
    res = await client.get("/api/products", params={"category": "casual"})
    data = res.json()
    assert all(i["category"]["slug"] == "casual" for i in data["items"])


@pytest.mark.asyncio
async def test_product_detail(client):
    res = await client.get("/api/products/checkered-shirt")
    assert res.status_code == 200
    assert res.json()["price"] == 18000


@pytest.mark.asyncio
async def test_product_not_found(client):
    res = await client.get("/api/products/does-not-exist")
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_product_reviews(client):
    res = await client.get("/api/products/checkered-shirt/reviews")
    assert res.status_code == 200
    assert res.json()["total"] == 3


@pytest.mark.asyncio
async def test_create_order(client):
    res = await client.post(
        "/api/orders",
        json={
            "contact": {"name": "A", "email": "a@b.com", "phone": "1234567"},
            "shipping": {"address": "1 St", "city": "NY", "zip": "10001"},
            "items": [{"productId": "p5", "size": "Medium", "color": "#31344F", "qty": 2}],
        },
    )
    assert res.status_code == 200
    order = res.json()["order"]
    assert order["total"] == 36000
