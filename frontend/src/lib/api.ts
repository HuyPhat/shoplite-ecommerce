import { useQuery } from "@tanstack/react-query";
import { BASE_PATH } from "./basePath";
import type {
  Category,
  Order,
  OrderPayload,
  Product,
  ProductFilters,
  ProductListResponse,
  ReviewListResponse,
} from "./types";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_PATH}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function buildQuery(filters: ProductFilters): string {
  const p = new URLSearchParams();
  if (filters.category) p.set("category", filters.category);
  if (filters.q) p.set("q", filters.q);
  if (filters.sort) p.set("sort", filters.sort);
  if (filters.priceMin != null) p.set("priceMin", String(filters.priceMin));
  if (filters.priceMax != null) p.set("priceMax", String(filters.priceMax));
  filters.colors?.forEach((c) => p.append("color", c));
  filters.sizes?.forEach((s) => p.append("size", s));
  if (filters.rating) p.set("rating", String(filters.rating));
  if (filters.sale) p.set("sale", "1");
  if (filters.page) p.set("page", String(filters.page));
  if (filters.pageSize) p.set("pageSize", String(filters.pageSize));
  return p.toString();
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => get<Category[]>("/api/categories"),
  });
}

export function useProducts(filters: ProductFilters) {
  const qs = buildQuery(filters);
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => get<ProductListResponse>(`/api/products?${qs}`),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => get<Product>(`/api/products/${slug}`),
  });
}

export function useReviews(slug: string) {
  return useQuery({
    queryKey: ["reviews", slug],
    queryFn: () => get<ReviewListResponse>(`/api/products/${slug}/reviews`),
  });
}

export function useRelated(slug: string) {
  return useQuery({
    queryKey: ["related", slug],
    queryFn: () => get<Product[]>(`/api/products/${slug}/related`),
  });
}

export async function placeOrder(payload: OrderPayload): Promise<Order> {
  const res = await fetch(`${BASE_PATH}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Order failed");
  const data = (await res.json()) as { order: Order };
  return data.order;
}
