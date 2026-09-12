"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DiscountBadge } from "@/components/ui/DiscountBadge";
import { StarRating } from "@/components/ui/StarRating";
import { ProductCard } from "@/components/product/ProductCard";
import { useProduct, useRelated, useReviews } from "@/lib/api";
import { useCart } from "@/stores/cart";
import { cn, formatPrice } from "@/lib/utils";

const TABS = ["Product Details", "Rating & Reviews", "FAQs"] as const;

const FAQS = [
  { q: "What is your return policy?", a: "Returns accepted within 30 days of delivery." },
  { q: "How long does shipping take?", a: "Standard shipping arrives in 3–5 business days." },
  { q: "Do you offer exchanges?", a: "Yes, exchanges are free for size changes." },
];

export function ProductClient({ slug }: { slug: string }) {
  const { data: product, isLoading } = useProduct(slug);
  const { data: reviewsData } = useReviews(slug);
  const { data: related } = useRelated(slug);
  const add = useCart((s) => s.add);

  const [imgIndex, setImgIndex] = useState(0);
  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Product Details");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (isLoading || !product) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex flex-col items-center gap-4">
          <div className="h-80 w-full max-w-xl animate-pulse rounded-card bg-surface" />
          <div className="h-6 w-48 animate-pulse rounded bg-surface" />
        </div>
      </Container>
    );
  }

  const reviews = reviewsData?.items ?? [];

  function handleAdd() {
    if (!size) return setFeedback("Please select a size");
    if (!color) return setFeedback("Please select a color");
    add(
      {
        productId: product!.id,
        slug: product!.slug,
        name: product!.name,
        image: product!.images[0]?.src ?? "",
        price: product!.price,
        size,
        color,
      },
      qty,
    );
    setFeedback("Added to cart");
  }

  return (
    <Container className="py-6 lg:py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-body text-muted">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-3 lg:flex-row-reverse lg:gap-4">
          <div className="relative aspect-square overflow-hidden rounded-card bg-surface-product">
            <Image
              src={product.images[imgIndex]?.src ?? ""}
              alt={product.images[imgIndex]?.alt ?? product.name}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex gap-3 lg:flex-col">
            {product.images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setImgIndex(i)}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-tile bg-surface-product",
                  i === imgIndex && "ring-2 ring-foreground ring-offset-1",
                )}
              >
                <Image src={img.src} alt={img.alt} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 flex flex-col gap-4 lg:mt-0">
          <h1 className="font-display text-title-lg lg:text-display-xl">{product.name}</h1>
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} size={20} />
            <span className="text-body text-foreground">
              {product.rating.toFixed(1)}
              <span className="text-muted">/5</span>
            </span>
            <span className="text-body text-muted">({product.ratingCount} reviews)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-display text-display">{formatPrice(product.price)}</span>
            {product.compareAtPrice != null && (
              <span className="font-display text-display text-subtle line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {product.discount != null && <DiscountBadge percent={product.discount} />}
          </div>
          <p className="text-body text-muted">{product.description}</p>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3">
            <span className="text-body text-muted">Select Colors</span>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Color ${c}`}
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-10 w-10 rounded-full border border-border",
                    color === c && "ring-2 ring-foreground ring-offset-1",
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex flex-col gap-3">
            <span className="text-body text-muted">Choose Size</span>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    "rounded-pill px-5 py-2.5 text-body",
                    size === s ? "bg-foreground text-background" : "bg-surface text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 rounded-pill bg-surface px-4 py-3">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="text-foreground"
              >
                −
              </button>
              <span className="w-6 text-center text-body-lg font-medium">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="text-foreground"
              >
                +
              </button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAdd}>
              Add to Cart
            </Button>
          </div>
          {feedback && (
            <p className={cn("text-body", feedback === "Added to cart" ? "text-foreground" : "text-sale")}>
              {feedback}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border-b border-border">
        <div className="flex gap-6 lg:gap-12">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "border-b-2 pb-3 text-body text-muted",
                tab === t && "border-foreground text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="py-8">
        {tab === "Product Details" && (
          <div className="max-w-2xl text-body text-muted">
            <p>{product.description}</p>
            <ul className="mt-4 list-disc pl-5">
              <li>Soft and breathable fabric</li>
              <li>Machine washable</li>
              <li>Available in {product.sizes.length} sizes</li>
            </ul>
          </div>
        )}
        {tab === "Rating & Reviews" && (
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
              {reviews.map((r) => (
                <figure
                  key={r.id}
                  className="flex flex-col gap-3 rounded-card border border-border p-6"
                >
                  <StarRating rating={r.rating} size={20} />
                  <figcaption className="font-bold text-foreground">
                    {r.author}
                    <span className="ml-2 font-normal text-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </figcaption>
                  <blockquote className="text-body text-muted">{r.text}</blockquote>
                </figure>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="outline">Load More Reviews</Button>
              <Button>Write a Review</Button>
            </div>
          </div>
        )}
        {tab === "FAQs" && (
          <div className="flex max-w-2xl flex-col gap-4">
            {FAQS.map((f) => (
              <details key={f.q} className="rounded-card border border-border p-4">
                <summary className="cursor-pointer text-body-lg font-medium">{f.q}</summary>
                <p className="mt-2 text-body text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="py-8">
          <h2 className="mb-8 text-center font-display text-display uppercase lg:text-display-lg">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
