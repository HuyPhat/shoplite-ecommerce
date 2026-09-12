import { beforeEach, describe, expect, it } from "vitest";
import { cartKey, selectCartCount, selectSubtotal, useCart } from "./cart";

describe("cart store", () => {
  beforeEach(() => {
    useCart.getState().clear();
  });

  it("adds a new item", () => {
    useCart.getState().add({
      productId: "p1",
      slug: "tee",
      name: "Tee",
      image: "",
      price: 1000,
      size: "M",
      color: "#000",
    });
    expect(useCart.getState().items).toHaveLength(1);
    expect(selectCartCount(useCart.getState())).toBe(1);
  });

  it("merges quantity for the same variant", () => {
    const item = {
      productId: "p1",
      slug: "tee",
      name: "Tee",
      image: "",
      price: 1000,
      size: "M",
      color: "#000",
    };
    useCart.getState().add(item);
    useCart.getState().add(item, 2);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0].qty).toBe(3);
  });

  it("computes subtotal and count", () => {
    useCart.getState().add({
      productId: "p1",
      slug: "a",
      name: "A",
      image: "",
      price: 1500,
      size: "M",
      color: null,
    });
    useCart.getState().add({
      productId: "p2",
      slug: "b",
      name: "B",
      image: "",
      price: 500,
      size: "L",
      color: null,
    }, 2);
    const state = useCart.getState();
    expect(selectSubtotal(state)).toBe(2500);
    expect(selectCartCount(state)).toBe(3);
  });

  it("removes by key and sets quantity", () => {
    useCart.getState().add({
      productId: "p1",
      slug: "a",
      name: "A",
      image: "",
      price: 1500,
      size: "M",
      color: null,
    });
    const key = cartKey({ productId: "p1", size: "M", color: null });
    useCart.getState().setQty(key, 4);
    expect(useCart.getState().items[0].qty).toBe(4);
    useCart.getState().remove(key);
    expect(useCart.getState().items).toHaveLength(0);
  });
});
