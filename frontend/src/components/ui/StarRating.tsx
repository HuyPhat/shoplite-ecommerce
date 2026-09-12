import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full)
          return (
            <Star key={i} size={size} className="fill-accent text-accent" />
          );
        if (i === full && hasHalf)
          return (
            <StarHalf key={i} size={size} className="fill-accent text-accent" />
          );
        return <Star key={i} size={size} className="text-faint" />;
      })}
    </span>
  );
}
