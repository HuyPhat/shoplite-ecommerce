import { cn } from "@/lib/utils";

export function DiscountBadge({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-pill bg-sale-bg px-3.5 py-1 text-badge font-medium text-sale",
        className,
      )}
    >
      -{percent}%
    </span>
  );
}
