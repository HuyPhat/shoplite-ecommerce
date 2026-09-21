import { delay, http, HttpResponse } from "msw";
import { BASE_PATH } from "@/lib/basePath";
import type { ProductFilters } from "@/lib/types";
import { categories, products, reviews } from "./db";

const API = `${BASE_PATH}/api`;

export const handlers = [
  http.get(`${API}/categories`, async () => {
    await delay(300);
    return HttpResponse.json(categories);
  }),

  http.get(`${API}/products`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const category = url.searchParams.get("category");
    const sort = (url.searchParams.get("sort") ?? "popular") as NonNullable<
      ProductFilters["sort"]
    >;
    const priceMin = Number(url.searchParams.get("priceMin") ?? 0);
    const priceMax = Number(url.searchParams.get("priceMax") ?? Infinity);
    const colors = url.searchParams.getAll("color");
    const sizes = url.searchParams.getAll("size");
    const rating = Number(url.searchParams.get("rating") ?? 0);
    const sale = url.searchParams.get("sale") === "1";
    const page = Number(url.searchParams.get("page") ?? 1);
    const pageSize = Number(url.searchParams.get("pageSize") ?? 9);

    let items = products.filter((p) => {
      if (category && p.category.slug !== category) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (p.price < priceMin || p.price > priceMax) return false;
      if (colors.length && !p.colors.some((c) => colors.includes(c))) return false;
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      if (rating && p.rating < rating) return false;
      if (sale && p.discount == null) return false;
      return true;
    });

    switch (sort) {
      case "newest":
        items = [...items].reverse();
        break;
      case "price-asc":
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      default:
        items = [...items].sort((a, b) => b.ratingCount - a.ratingCount);
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    return HttpResponse.json({
      items: items.slice(start, start + pageSize),
      total,
      page,
      pageSize,
    });
  }),

  http.get(`${API}/products/:slug`, async ({ params }) => {
    await delay(200);
    const product = products.find((p) => p.slug === params.slug);
    if (!product) return HttpResponse.json({ detail: "Not found" }, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.get(`${API}/products/:slug/reviews`, async ({ params }) => {
    await delay(200);
    const list = reviews[params.slug as string] ?? [];
    return HttpResponse.json({ items: list, total: list.length });
  }),

  http.get(`${API}/products/:slug/related`, async ({ params }) => {
    await delay(200);
    const product = products.find((p) => p.slug === params.slug);
    if (!product) return HttpResponse.json([]);
    const related = products
      .filter((p) => p.category.slug === product.category.slug && p.id !== product.id)
      .slice(0, 4);
    return HttpResponse.json(related);
  }),

  http.post(`${API}/cart/validate`, async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as { items: { productId: string; qty: number }[] };
    const items = body.items.map((i) => {
      const p = products.find((x) => x.id === i.productId);
      return {
        productId: i.productId,
        price: p?.price ?? 0,
        inStock: p?.inStock ?? false,
      };
    });
    return HttpResponse.json({ valid: items.every((i) => i.inStock), items });
  }),

  http.post(`${API}/orders`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { items: { productId: string; qty: number }[] };
    const total = body.items.reduce((sum, i) => {
      const p = products.find((x) => x.id === i.productId);
      return sum + (p?.price ?? 0) * i.qty;
    }, 0);
    const number = `SHOP-${Math.floor(100000 + Math.random() * 900000)}`;
    return HttpResponse.json({
      order: { id: crypto.randomUUID(), number, total, items: body.items },
    });
  }),

  http.post(`${API}/newsletter`, async () => {
    await delay(200);
    return HttpResponse.json({ ok: true });
  }),
];
