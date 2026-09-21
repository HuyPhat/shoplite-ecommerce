import { describe, expect, it } from "vitest";
import { cn, formatPrice } from "./utils";

describe("cn", () => {
  it("keeps custom semantic text color alongside a font-size class", () => {
    const result = cn(
      "bg-foreground text-background hover:bg-foreground/90",
      "h-[52px] px-8 gap-3 rounded-pill text-body-lg",
    );
    expect(result).toContain("text-background");
    expect(result).toContain("text-body-lg");
    expect(result).toContain("bg-foreground");
  });

  it("keeps text-foreground on secondary buttons", () => {
    const result = cn(
      "bg-surface text-foreground hover:bg-surface/80",
      "h-11 px-6 gap-3 rounded-pill text-body-lg",
    );
    expect(result).toContain("text-foreground");
    expect(result).toContain("text-body-lg");
  });

  it("keeps color on active size/sort pills", () => {
    const result = cn("rounded-pill px-4 py-2 text-body", "bg-foreground text-background");
    expect(result).toContain("text-background");
    expect(result).toContain("text-body");
  });

  it("still dedupes conflicting background classes", () => {
    const result = cn("bg-foreground text-background", "bg-surface text-foreground");
    expect(result).toBe("bg-surface text-foreground");
  });
});

describe("formatPrice", () => {
  it("formats whole dollars without decimals", () => {
    expect(formatPrice(14500)).toBe("$145");
    expect(formatPrice(8000)).toBe("$80");
  });

  it("formats cents with two decimals", () => {
    expect(formatPrice(21250)).toBe("$212.50");
  });

  it("handles zero", () => {
    expect(formatPrice(0)).toBe("$0");
  });
});
