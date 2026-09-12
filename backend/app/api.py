from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas
from app.db import get_session

router = APIRouter(prefix="/api")


@router.get("/categories", response_model=List[schemas.Category])
async def categories(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(models.Category).order_by(models.Category.name))
    return list(result.scalars())


@router.get("/products", response_model=schemas.ProductListResponse)
async def products(
    category: Optional[str] = None,
    q: Optional[str] = None,
    sort: str = "popular",
    priceMin: Optional[int] = Query(default=None, alias="priceMin"),
    priceMax: Optional[int] = Query(default=None, alias="priceMax"),
    color: List[str] = Query(default=[]),
    size: List[str] = Query(default=[]),
    rating: Optional[float] = None,
    sale: Optional[str] = None,
    page: int = 1,
    pageSize: int = Query(default=9, alias="pageSize"),
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(select(models.Product))
    items = list(result.scalars())

    def matches(p: models.Product) -> bool:
        if category and p.category.slug != category:
            return False
        if q and q.lower() not in p.name.lower():
            return False
        if priceMin is not None and p.price < priceMin:
            return False
        if priceMax is not None and p.price > priceMax:
            return False
        if color and not any(c in p.colors for c in color):
            return False
        if size and not any(s in p.sizes for s in size):
            return False
        if rating is not None and p.rating < rating:
            return False
        if sale == "1" and p.discount is None:
            return False
        return True

    items = [p for p in items if matches(p)]

    if sort == "newest":
        items = list(reversed(items))
    elif sort == "price-asc":
        items = sorted(items, key=lambda p: p.price)
    elif sort == "price-desc":
        items = sorted(items, key=lambda p: p.price, reverse=True)
    else:
        items = sorted(items, key=lambda p: p.rating_count, reverse=True)

    total = len(items)
    start = (page - 1) * pageSize
    page_items = items[start : start + pageSize]

    return schemas.ProductListResponse(
        items=[schemas.Product.model_validate(p) for p in page_items],
        total=total,
        page=page,
        page_size=pageSize,
    )


@router.get("/products/{slug}", response_model=schemas.Product)
async def product_detail(slug: str, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(models.Product).where(models.Product.slug == slug))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    return schemas.Product.model_validate(product)


@router.get("/products/{slug}/reviews", response_model=schemas.ReviewListResponse)
async def product_reviews(slug: str, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(models.Review)
        .join(models.Product)
        .where(models.Product.slug == slug)
        .order_by(models.Review.created_at.desc())
    )
    reviews = list(result.scalars())
    return schemas.ReviewListResponse(
        items=[schemas.Review.model_validate(r) for r in reviews], total=len(reviews)
    )


@router.get("/products/{slug}/related", response_model=List[schemas.Product])
async def product_related(slug: str, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(models.Product).where(models.Product.slug == slug))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Not found")
    result = await session.execute(
        select(models.Product)
        .where(
            models.Product.category_id == product.category_id,
            models.Product.id != product.id,
        )
        .limit(4)
    )
    return [schemas.Product.model_validate(p) for p in result.scalars()]


@router.post("/cart/validate", response_model=schemas.CartValidateResponse)
async def cart_validate(
    payload: schemas.CartValidateRequest, session: AsyncSession = Depends(get_session)
):
    ids = [i.product_id for i in payload.items]
    result = await session.execute(select(models.Product).where(models.Product.id.in_(ids)))
    by_id = {p.id: p for p in result.scalars()}
    items = [
        schemas.CartValidatedItem(
            product_id=i.product_id,
            price=by_id[i.product_id].price if i.product_id in by_id else 0,
            in_stock=by_id[i.product_id].in_stock if i.product_id in by_id else False,
        )
        for i in payload.items
    ]
    return schemas.CartValidateResponse(valid=all(i.in_stock for i in items), items=items)


@router.post("/orders", response_model=schemas.OrderResponse)
async def create_order(
    payload: schemas.OrderPayload, session: AsyncSession = Depends(get_session)
):
    import uuid

    ids = [i.product_id for i in payload.items]
    result = await session.execute(select(models.Product).where(models.Product.id.in_(ids)))
    by_id = {p.id: p for p in result.scalars()}

    total = sum(
        (by_id[i.product_id].price if i.product_id in by_id else 0) * i.qty
        for i in payload.items
    )

    order = models.Order(
        id=str(uuid.uuid4()),
        number=f"SHOP-{int(uuid.uuid4().int % 900000) + 100000}",
        name=payload.contact.name,
        email=payload.contact.email,
        total=total,
    )
    session.add(order)
    await session.flush()

    for i in payload.items:
        price = by_id[i.product_id].price if i.product_id in by_id else 0
        session.add(
            models.OrderItem(
                order_id=order.id,
                product_id=i.product_id,
                size=i.size,
                color=i.color,
                qty=i.qty,
                price=price,
            )
        )

    await session.commit()
    await session.refresh(order)

    return schemas.OrderResponse(
        order=schemas.Order(
            id=order.id,
            number=order.number,
            total=order.total,
            items=payload.items,
        )
    )


@router.post("/newsletter")
async def newsletter(payload: dict, session: AsyncSession = Depends(get_session)):
    email = payload.get("email")
    if email:
        session.add(models.Subscriber(email=email))
        await session.commit()
    return {"ok": True}
