from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


def _to_camel(s: str) -> str:
    head, *tail = s.split("_")
    return head + "".join(w.capitalize() for w in tail)


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=_to_camel, populate_by_name=True, from_attributes=True)


class Category(CamelModel):
    id: str
    slug: str
    name: str
    image: Optional[str] = None


class ProductImage(CamelModel):
    src: str
    alt: str


class Review(CamelModel):
    id: str
    author: str
    rating: float
    text: str
    created_at: datetime


class Product(CamelModel):
    id: str
    slug: str
    name: str
    description: str
    price: int
    compare_at_price: Optional[int] = None
    discount: Optional[int] = None
    rating: float
    rating_count: int
    category: Category
    images: List[ProductImage]
    colors: List[str]
    sizes: List[str]
    in_stock: bool


class ProductListResponse(CamelModel):
    items: List[Product]
    total: int
    page: int
    page_size: int


class ReviewListResponse(CamelModel):
    items: List[Review]
    total: int


class CartValidateItem(CamelModel):
    product_id: str
    size: Optional[str] = None
    color: Optional[str] = None
    qty: int


class CartValidateRequest(CamelModel):
    items: List[CartValidateItem]


class CartValidatedItem(CamelModel):
    product_id: str
    price: int
    in_stock: bool


class CartValidateResponse(CamelModel):
    valid: bool
    items: List[CartValidatedItem]


class Contact(CamelModel):
    name: str
    email: str
    phone: str


class Shipping(CamelModel):
    address: str
    city: str
    zip: str


class OrderPayload(CamelModel):
    contact: Contact
    shipping: Shipping
    items: List[CartValidateItem]


class Order(CamelModel):
    id: str
    number: str
    total: int
    items: List[CartValidateItem]


class OrderResponse(CamelModel):
    order: Order
