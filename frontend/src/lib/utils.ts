import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const TEXT_SIZES = [
  "hero",
  "display",
  "display-xl",
  "display-lg",
  "title",
  "title-lg",
  "price-lg",
  "body-lg",
  "body",
  "caption",
  "overline",
  "overline-sm",
  "badge",
];

const TEXT_COLORS = [
  "background",
  "foreground",
  "surface",
  "surface-hero",
  "surface-product",
  "muted",
  "subtle",
  "faint",
  "border",
  "accent",
  "sale",
  "sale-bg",
  "primary",
  "primary-foreground",
  "neutral-400",
];

const projectTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TEXT_SIZES }],
      "text-color": [{ text: TEXT_COLORS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return projectTwMerge(clsx(inputs));
}

export function formatPrice(cents: number): string {
  const d = cents / 100;
  return `$${Number.isInteger(d) ? d.toFixed(0) : d.toFixed(2)}`;
}
