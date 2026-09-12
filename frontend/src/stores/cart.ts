import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number; // cents
  size: string | null;
  color: string | null;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
}

export function cartKey(item: Pick<CartItem, "productId" | "size" | "color">): string {
  return `${item.productId}|${item.size ?? ""}|${item.color ?? ""}`;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const key = cartKey(item);
          const existing = state.items.find((i) => cartKey(i) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                cartKey(i) === key ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),
      remove: (key) =>
        set((state) => ({ items: state.items.filter((i) => cartKey(i) !== key) })),
      setQty: (key, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => cartKey(i) !== key)
              : state.items.map((i) => (cartKey(i) === key ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "shoplite-cart" },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((n, i) => n + i.qty, 0);

export const selectSubtotal = (state: CartState) =>
  state.items.reduce((n, i) => n + i.price * i.qty, 0);
