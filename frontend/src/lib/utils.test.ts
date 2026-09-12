import { describe, expect, it } from "vitest";
import { formatPrice } from "./utils";

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
