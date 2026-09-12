"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cartKey, selectSubtotal, useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/utils";

const DELIVERY = 1500; // $15.00

export function CartClient() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQty);
  const subtotal = useCart(selectSubtotal);

  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState(false);

  const discount = applied ? Math.round(subtotal * 0.2) : 0;
  const total = subtotal - discount + (items.length ? DELIVERY : 0);

  function applyPromo() {
    if (promo.trim().toUpperCase() === "SHOP20") {
      setApplied(true);
      setError(false);
    } else {
      setApplied(false);
      setError(true);
    }
  }

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-display text-display lg:text-display-lg">Your cart is empty</h1>
          <p className="text-body text-muted">
            Browse our collection and find something you love.
          </p>
          <Link href="/shop">
            <Button size="lg">Shop Now</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6 lg:py-10">
      <h1 className="mb-8 font-display text-display lg:text-display-lg">Your cart</h1>
      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-8">
        <div className="flex flex-col divide-y divide-border rounded-card border border-border px-4 lg:px-6">
          {items.map((item) => (
            <div key={cartKey(item)} className="flex gap-4 py-4 lg:gap-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-tile bg-surface-product lg:h-[124px] lg:w-[124px]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="124px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-body-lg font-bold">{item.name}</h3>
                    <p className="text-body text-muted">
                      Size: {item.size}
                      <br />
                      Color: {item.color}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => remove(cartKey(item))}
                    className="text-sale"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-price-lg font-bold">{formatPrice(item.price)}</span>
                  <div className="flex items-center gap-3 rounded-pill bg-surface px-3 py-2">
                    <button
                      type="button"
                      aria-label="Decrease"
                      onClick={() => setQty(cartKey(item), item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-body-lg font-medium">{item.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase"
                      onClick={() => setQty(cartKey(item), item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="mt-8 flex h-fit flex-col gap-4 rounded-card border border-border p-6 lg:mt-0">
          <h2 className="text-title font-bold">Order Summary</h2>
          <div className="flex justify-between text-body-lg">
            <span className="text-muted">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          {applied && (
            <div className="flex justify-between text-body-lg">
              <span className="text-muted">Discount (-20%)</span>
              <span className="font-medium text-sale">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-body-lg">
            <span className="text-muted">Delivery Fee</span>
            <span className="font-medium">{formatPrice(DELIVERY)}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-body-lg">
            <span>Total</span>
            <span className="font-bold">{formatPrice(total)}</span>
          </div>
          <div className="flex gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Add promo code"
              className="h-11 flex-1 rounded-pill bg-surface px-4 text-body-lg text-foreground outline-none placeholder:text-subtle"
            />
            <Button variant="outline" onClick={applyPromo}>
              Apply
            </Button>
          </div>
          {error && <p className="text-body text-sale">Invalid promo code</p>}
          {applied && <p className="text-body text-foreground">Promo applied!</p>}
          <Link href="/checkout">
            <Button className="w-full">Go to Checkout →</Button>
          </Link>
        </aside>
      </div>
    </Container>
  );
}
