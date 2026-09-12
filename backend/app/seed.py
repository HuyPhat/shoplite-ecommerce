from sqlalchemy.ext.asyncio import AsyncSession

from app import models

SIZES = ["Small", "Medium", "Large", "X-Large"]

CATEGORIES = [
    {"id": "cat-casual", "slug": "casual", "name": "Casual"},
    {"id": "cat-formal", "slug": "formal", "name": "Formal"},
    {"id": "cat-party", "slug": "party", "name": "Party"},
    {"id": "cat-gym", "slug": "gym", "name": "Gym"},
    {"id": "cat-jeans", "slug": "jeans", "name": "Jeans"},
    {"id": "cat-shirts", "slug": "shirts", "name": "Shirts"},
]

PRODUCTS = [
    ("p1", "gradient-graphic-t-shirt", "Gradient Graphic T-shirt", "casual", 14500, 24200, 3.5, 12),
    ("p2", "polo-with-tipping-details", "Polo with Tipping Details", "formal", 18000, 24000, 4.5, 8),
    ("p3", "black-striped-t-shirt", "Black Striped T-shirt", "party", 12000, 15000, 4.0, 20),
    ("p4", "skinny-fit-jeans", "Skinny Fit Jeans", "jeans", 24000, 26000, 4.0, 30),
    ("p5", "checkered-shirt", "Checkered Shirt", "shirts", 18000, 24000, 4.5, 15),
    ("p6", "sleeve-striped-t-shirt", "Sleeve Striped T-shirt", "casual", 13000, 16000, 4.0, 22),
    ("p7", "one-life-graphic-t-shirt", "One Life Graphic T-shirt", "casual", 26000, 30000, 4.5, 40),
    ("p8", "vertical-striped-shirt", "Vertical Striped Shirt", "shirts", 21200, 23200, 5.0, 18),
    ("p9", "courage-graphic-t-shirt", "Courage Graphic T-shirt", "gym", 14500, 18000, 4.0, 10),
    ("p10", "loose-fit-bermuda-shorts", "Loose Fit Bermuda Shorts", "casual", 8000, 12000, 3.0, 6),
    ("p11", "faded-skinny-jeans", "Faded Skinny Jeans", "jeans", 21000, 25000, 4.5, 14),
    ("p12", "polo-with-contrast-trims", "Polo with Contrast Trims", "formal", 22000, 28000, 4.0, 9),
    ("p13", "graphic-print-t-shirt", "Graphic Print T-shirt", "party", 15000, 20000, 3.5, 11),
    ("p14", "gym-training-tee", "Gym Training Tee", "gym", 9500, 14000, 4.5, 25),
    ("p15", "classic-white-shirt", "Classic White Shirt", "shirts", 20000, 24000, 5.0, 33),
    ("p16", "slim-fit-chinos", "Slim Fit Chinos", "formal", 17500, 22000, 4.0, 7),
]

REVIEW_AUTHORS = ["Sarah M.", "Alex K.", "Jamie L.", "Riley T.", "Morgan P."]
REVIEW_TEXTS = [
    "Amazing fit and quality. Will definitely buy more.",
    "Soft fabric, true to size. Shipping was fast.",
    "Looks exactly like the photos. Very happy.",
    "Decent for the price, but runs slightly small.",
    "My new favorite piece. Comfortable all day.",
]


def _image(slug: str, i: int) -> dict:
    return {"src": f"https://picsum.photos/seed/{slug}-{i}/700/700", "alt": f"{slug} image {i+1}"}


async def seed(session: AsyncSession) -> None:
    for c in CATEGORIES:
        session.add(models.Category(**c))

    for p in PRODUCTS:
        pid, slug, name, cat, price, compare, rating, count = p
        discount = round((1 - price / compare) * 100)
        category_id = f"cat-{cat}"
        session.add(
            models.Product(
                id=pid,
                slug=slug,
                name=name,
                description="This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
                price=price,
                compare_at_price=compare,
                discount=discount,
                rating=rating,
                rating_count=count,
                category_id=category_id,
                colors=["#31344F", "#314F4A", "#4F4631"],
                sizes=SIZES,
                in_stock=True,
                images=[
                    models.ProductImage(**{**_image(slug, 1), "sort": 0}),
                    models.ProductImage(**{**_image(slug, 2), "sort": 1}),
                ],
            )
        )

    await session.flush()

    for p in PRODUCTS:
        pid, slug, *_ = p
        for i in range(3):
            session.add(
                models.Review(
                    id=f"{slug}-r{i}",
                    product_id=pid,
                    author=REVIEW_AUTHORS[i % 5],
                    rating=4.0,
                    text=REVIEW_TEXTS[i % 5],
                )
            )

    await session.commit()
