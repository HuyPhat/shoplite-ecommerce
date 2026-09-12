import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-pill bg-surface px-4 py-3 text-body-lg text-foreground",
        "placeholder:text-subtle",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground",
        className,
      )}
      {...props}
    />
  );
}
