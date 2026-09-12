"use client";

import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/product/ProductCard";
import { useCategories, useProducts } from "@/lib/api";
import {
  COLOR_SWATCHES,
  PRICE_MAX,
  PRICE_MIN,
  SIZE_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constants";
import type { ProductFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

function readFilters(params: URLSearchParams): ProductFilters {
  const num = (v: string | null) => (v ? Number(v) : undefined);
  return {
    category: params.get("category") ?? undefined,
    q: params.get("q") ?? undefined,
    sort: (params.get("sort") as ProductFilters["sort"]) ?? "popular",
    priceMin: num(params.get("priceMin")),
    priceMax: num(params.get("priceMax")),
    colors: params.getAll("color"),
    sizes: params.getAll("size"),
    rating: num(params.get("rating")),
    sale: params.get("sale") === "1" || undefined,
    page: num(params.get("page")) ?? 1,
    pageSize: 9,
  };
}

function toQuery(filters: ProductFilters): string {
  const p = new URLSearchParams();
  const set = (k: string, v?: string | number) => {
    if (v != null && v !== "") p.set(k, String(v));
  };
  set("category", filters.category);
  set("q", filters.q);
  if (filters.sort && filters.sort !== "popular") set("sort", filters.sort);
  set("priceMin", filters.priceMin);
  set("priceMax", filters.priceMax);
  filters.colors?.forEach((c) => p.append("color", c));
  filters.sizes?.forEach((s) => p.append("size", s));
  set("rating", filters.rating);
  if (filters.sale) p.set("sale", "1");
  if (filters.page && filters.page > 1) set("page", filters.page);
  return p.toString();
}

function toggle(list: string[], v: string): string[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function PriceRange({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const pct = (n: number) => ((n - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  return (
    <div>
      <div className="relative h-5">
        <div className="absolute top-2.5 h-1.5 w-full rounded-pill bg-surface" />
        <div
          className="absolute top-2.5 h-1.5 rounded-pill bg-foreground"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          className="absolute top-0 w-full"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          className="absolute top-0 w-full"
          aria-label="Maximum price"
        />
      </div>
      <div className="flex justify-between text-body text-muted">
        <span>${lo}</span>
        <span>${hi}</span>
      </div>
    </div>
  );
}

function FilterPanel({
  filters,
  onPatch,
  onApply,
}: {
  filters: ProductFilters;
  onPatch: (next: Partial<ProductFilters>) => void;
  onApply?: () => void;
}) {
  const { data: categories } = useCategories();
  const range: [number, number] = [
    filters.priceMin ?? PRICE_MIN,
    filters.priceMax ?? PRICE_MAX,
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h3 className="text-title font-bold">Filters</h3>
        <div className="h-px bg-border" />
      </section>

      <section className="flex flex-col gap-4">
        <h4 className="text-body-lg font-medium">Dress Style</h4>
        <div className="flex flex-col gap-3">
          {(categories ?? []).map((c) => (
            <label
              key={c.slug}
              className="flex items-center justify-between text-body text-muted"
            >
              <span>{c.name}</span>
              <input
                type="checkbox"
                checked={filters.category === c.slug}
                onChange={() =>
                  onPatch({ category: filters.category === c.slug ? undefined : c.slug })
                }
                className="accent-black"
              />
            </label>
          ))}
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="flex flex-col gap-4">
        <h4 className="text-body-lg font-medium">Price</h4>
        <PriceRange
          value={range}
          onChange={(v) => onPatch({ priceMin: v[0], priceMax: v[1] })}
        />
      </section>

      <div className="h-px bg-border" />

      <section className="flex flex-col gap-4">
        <h4 className="text-body-lg font-medium">Colors</h4>
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((c) => {
            const active = filters.colors?.includes(c.value);
            return (
              <button
                key={c.value}
                type="button"
                aria-label={c.name}
                onClick={() =>
                  onPatch({ colors: toggle(filters.colors ?? [], c.value) })
                }
                className={cn(
                  "h-9 w-9 rounded-full border border-border",
                  active && "ring-2 ring-foreground ring-offset-1",
                )}
                style={{ backgroundColor: c.value }}
              />
            );
          })}
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="flex flex-col gap-4">
        <h4 className="text-body-lg font-medium">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((s) => {
            const active = filters.sizes?.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => onPatch({ sizes: toggle(filters.sizes ?? [], s) })}
                className={cn(
                  "rounded-pill px-4 py-2 text-body",
                  active ? "bg-foreground text-background" : "bg-surface text-foreground",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </section>

      {onApply && (
        <Button className="mt-2 w-full" onClick={onApply}>
          Apply Filter
        </Button>
      )}
    </div>
  );
}

export function ShopClient() {
  const router = useRouter();
  const params = useSearchParams();
  const filters = readFilters(params);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useProducts(filters);
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / (filters.pageSize ?? 9)));

  function patch(next: Partial<ProductFilters>) {
    router.replace(`/shop?${toQuery({ ...filters, ...next, page: 1 })}`, {
      scroll: false,
    });
  }
  function setPage(page: number) {
    router.replace(`/shop?${toQuery({ ...filters, page })}`, { scroll: false });
  }

  const activeLabel = filters.category
    ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1)
    : filters.sale
      ? "On Sale"
      : filters.q
        ? `Search: "${filters.q}"`
        : "Shop";

  const hasActiveFilters =
    filters.category ||
    filters.sale ||
    filters.q ||
    (filters.colors?.length ?? 0) > 0 ||
    (filters.sizes?.length ?? 0) > 0 ||
    filters.priceMin != null ||
    filters.priceMax != null ||
    filters.rating != null;

  return (
    <Container className="py-6 lg:py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-body text-muted">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">{activeLabel}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[295px_1fr] lg:gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden h-fit rounded-card border border-border p-6 lg:block">
          <FilterPanel filters={filters} onPatch={patch} />
        </aside>

        {/* Main */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-title-lg lg:text-display">
                {activeLabel}
              </h1>
              <p className="text-body text-muted">
                Showing {items.length ? (filters.page! - 1) * (filters.pageSize ?? 9) + 1 : 0}–
                {Math.min((filters.page ?? 1) * (filters.pageSize ?? 9), total)} of{" "}
                {total} Products
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filters.sort}
                onChange={(e) =>
                  patch({ sort: e.target.value as ProductFilters["sort"] })
                }
                className="h-10 rounded-pill border border-border bg-background px-3 text-body text-foreground"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                className="h-10 lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-square animate-pulse rounded-card bg-surface" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-surface" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-card border border-border py-16 text-center">
              <p className="text-body-lg text-muted">No products match your filters.</p>
              <Button variant="outline" onClick={() => router.replace("/shop")}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <Button
                variant="outline"
                size="sm"
                className="rounded-btn"
                disabled={filters.page === 1}
                onClick={() => setPage((filters.page ?? 1) - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "h-9 w-9 rounded-btn text-body",
                      filters.page === i + 1
                        ? "bg-ring-subtle font-bold text-foreground"
                        : "text-muted hover:bg-surface",
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-btn"
                disabled={filters.page === totalPages}
                onClick={() => setPage((filters.page ?? 1) + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-card bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-title-lg">Filters</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setDrawerOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onPatch={patch}
              onApply={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => router.replace("/shop")}
          className="mt-4 text-body text-sale underline lg:hidden"
        >
          Clear all filters
        </button>
      )}
    </Container>
  );
}
