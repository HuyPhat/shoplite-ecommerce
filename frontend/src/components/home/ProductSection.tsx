"use client";

import Link from "next/link";
import { useProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";

const titles: Record<string, string> = {
  newest: "NEW ARRIVALS",
  popular: "top selling",
};

export function ProductSection({ sort }: { sort: "newest" | "popular" }) {
  const { data, isLoading } = useProducts({ sort, pageSize: 4 });

  return (
    <section className="py-12 lg:py-16">
      <div className="mb-8 flex items-center justify-center">
        <h2 className="font-display text-center text-display uppercase lg:text-display-lg">
          {titles[sort]}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
        {(data?.items ?? []).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link
          href="/shop"
          className="inline-flex h-11 items-center justify-center rounded-pill border border-border px-12 text-body-lg font-medium text-foreground hover:bg-surface"
        >
          View All
        </Link>
      </div>
      {isLoading && null}
    </section>
  );
}
