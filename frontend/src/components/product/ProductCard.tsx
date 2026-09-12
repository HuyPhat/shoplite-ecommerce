import Image from "next/image";
import Link from "next/link";
import { DiscountBadge } from "@/components/ui/DiscountBadge";
import { StarRating } from "@/components/ui/StarRating";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-tile bg-surface-product lg:rounded-card">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {product.discount != null && (
          <DiscountBadge
            percent={product.discount}
            className="absolute left-3 top-3"
          />
        )}
      </div>
      <h3 className="text-body-lg font-bold text-foreground">{product.name}</h3>
      <div className="flex items-center gap-2">
        <StarRating rating={product.rating} size={16} />
        <span className="text-caption text-foreground">
          {product.rating.toFixed(1)}
          <span className="text-muted">/5</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-price-lg font-bold text-foreground">
          {formatPrice(product.price)}
        </span>
        {product.compareAtPrice != null && (
          <span className="text-price-lg font-bold text-subtle line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        )}
      </div>
    </Link>
  );
}
