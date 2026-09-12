import { SIZE_OPTIONS } from "@/lib/constants";
import type { Category, Product, Review } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-casual", slug: "casual", name: "Casual", image: null },
  { id: "cat-formal", slug: "formal", name: "Formal", image: null },
  { id: "cat-party", slug: "party", name: "Party", image: null },
  { id: "cat-gym", slug: "gym", name: "Gym", image: null },
  { id: "cat-jeans", slug: "jeans", name: "Jeans", image: null },
  { id: "cat-shirts", slug: "shirts", name: "Shirts", image: null },
];

function img(slug: string, i: number): { src: string; alt: string } {
  return {
    src: `https://picsum.photos/seed/${slug}-${i}/700/700`,
    alt: `${slug} product image ${i + 1}`,
  };
}

function makeProduct(p: {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  ratingCount: number;
  colors?: string[];
  inStock?: boolean;
}): Product {
  const discount =
    p.compareAtPrice != null
      ? Math.round((1 - p.price / p.compareAtPrice) * 100)
      : null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description:
      "This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    discount,
    rating: p.rating,
    ratingCount: p.ratingCount,
    category: categories.find((c) => c.slug === p.category)!,
    images: [img(p.slug, 1), img(p.slug, 2)],
    colors: p.colors ?? ["#31344F", "#314F4A", "#4F4631"],
    sizes: [...SIZE_OPTIONS],
    inStock: p.inStock ?? true,
  };
}

const raw = [
  { id: "p1", slug: "gradient-graphic-t-shirt", name: "Gradient Graphic T-shirt", category: "casual", price: 14500, compareAtPrice: 24200, rating: 3.5, ratingCount: 12 },
  { id: "p2", slug: "polo-with-tipping-details", name: "Polo with Tipping Details", category: "formal", price: 18000, compareAtPrice: 24000, rating: 4.5, ratingCount: 8 },
  { id: "p3", slug: "black-striped-t-shirt", name: "Black Striped T-shirt", category: "party", price: 12000, compareAtPrice: 15000, rating: 4.0, ratingCount: 20 },
  { id: "p4", slug: "skinny-fit-jeans", name: "Skinny Fit Jeans", category: "jeans", price: 24000, compareAtPrice: 26000, rating: 4.0, ratingCount: 30 },
  { id: "p5", slug: "checkered-shirt", name: "Checkered Shirt", category: "shirts", price: 18000, compareAtPrice: 24000, rating: 4.5, ratingCount: 15 },
  { id: "p6", slug: "sleeve-striped-t-shirt", name: "Sleeve Striped T-shirt", category: "casual", price: 13000, compareAtPrice: 16000, rating: 4.0, ratingCount: 22 },
  { id: "p7", slug: "one-life-graphic-t-shirt", name: "One Life Graphic T-shirt", category: "casual", price: 26000, compareAtPrice: 30000, rating: 4.5, ratingCount: 40 },
  { id: "p8", slug: "vertical-striped-shirt", name: "Vertical Striped Shirt", category: "shirts", price: 21200, compareAtPrice: 23200, rating: 5.0, ratingCount: 18 },
  { id: "p9", slug: "courage-graphic-t-shirt", name: "Courage Graphic T-shirt", category: "gym", price: 14500, compareAtPrice: 18000, rating: 4.0, ratingCount: 10 },
  { id: "p10", slug: "loose-fit-bermuda-shorts", name: "Loose Fit Bermuda Shorts", category: "casual", price: 8000, compareAtPrice: 12000, rating: 3.0, ratingCount: 6 },
  { id: "p11", slug: "faded-skinny-jeans", name: "Faded Skinny Jeans", category: "jeans", price: 21000, compareAtPrice: 25000, rating: 4.5, ratingCount: 14 },
  { id: "p12", slug: "polo-with-contrast-trims", name: "Polo with Contrast Trims", category: "formal", price: 22000, compareAtPrice: 28000, rating: 4.0, ratingCount: 9 },
  { id: "p13", slug: "graphic-print-t-shirt", name: "Graphic Print T-shirt", category: "party", price: 15000, compareAtPrice: 20000, rating: 3.5, ratingCount: 11 },
  { id: "p14", slug: "gym-training-tee", name: "Gym Training Tee", category: "gym", price: 9500, compareAtPrice: 14000, rating: 4.5, ratingCount: 25 },
  { id: "p15", slug: "classic-white-shirt", name: "Classic White Shirt", category: "shirts", price: 20000, compareAtPrice: 24000, rating: 5.0, ratingCount: 33 },
  { id: "p16", slug: "slim-fit-chinos", name: "Slim Fit Chinos", category: "formal", price: 17500, compareAtPrice: 22000, rating: 4.0, ratingCount: 7 },
];

export const products: Product[] = raw.map(makeProduct);

const reviewTexts = [
  "Amazing fit and quality. Will definitely buy more.",
  "Soft fabric, true to size. Shipping was fast.",
  "Looks exactly like the photos. Very happy.",
  "Decent for the price, but runs slightly small.",
  "My new favorite piece. Comfortable all day.",
];

export const reviews: Record<string, Review[]> = Object.fromEntries(
  products.map((p) => [
    p.slug,
    Array.from({ length: Math.max(3, p.ratingCount) }).map((_, i) => ({
      id: `${p.slug}-r${i}`,
      author: ["Sarah M.", "Alex K.", "Jamie L.", "Riley T.", "Morgan P."][i % 5],
      rating: Math.max(3, Math.round(p.rating + (i % 2 === 0 ? 0 : -0.5))),
      text: reviewTexts[i % reviewTexts.length],
      createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
    })),
  ]),
);
