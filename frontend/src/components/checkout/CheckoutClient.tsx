"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { placeOrder } from "@/lib/api";
import type { Order } from "@/lib/types";
import { selectSubtotal, useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/utils";

const DELIVERY = 1500;

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(1, "ZIP is required"),
  card: z.string().min(16, "Card number must be 16 digits"),
  expiry: z.string().min(4, "MM/YY"),
  cvc: z.string().min(3, "CVC"),
});

type Form = z.infer<typeof schema>;

const initial: Form = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  card: "",
  expiry: "",
  cvc: "",
};

export function CheckoutClient() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const clear = useCart((s) => s.clear);

  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (items.length === 0 && !order) router.replace("/cart");
  }, [items.length, order, router]);

  if (order) {
    return (
      <Container className="py-16">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="font-display text-display lg:text-display-lg">Order confirmed</h1>
          <p className="text-body text-muted">
            Thank you! Your order <span className="font-medium text-foreground">{order.number}</span>{" "}
            is confirmed. Total {formatPrice(order.total)}.
          </p>
          <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
        </div>
      </Container>
    );
  }

  if (items.length === 0) return null;

  const total = subtotal + DELIVERY;

  function set<K extends keyof Form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const next: Partial<Record<keyof Form, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof Form;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    placeOrder({
      contact: { name: form.name, email: form.email, phone: form.phone },
      shipping: { address: form.address, city: form.city, zip: form.zip },
      items: items.map((i) => ({
        productId: i.productId,
        size: i.size,
        color: i.color,
        qty: i.qty,
      })),
    })
      .then((o) => {
        setOrder(o);
        clear();
      })
      .finally(() => setSubmitting(false));
  }

  const field = (key: keyof Form, label: string, placeholder: string, type = "text") => (
    <label className="flex flex-col gap-1">
      <span className="text-body text-muted">{label}</span>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-pill border border-border bg-background px-4 text-body-lg text-foreground outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-foreground"
      />
      {errors[key] && <span className="text-caption text-sale">{errors[key]}</span>}
    </label>
  );

  return (
    <Container className="py-6 lg:py-10">
      <h1 className="mb-8 font-display text-display lg:text-display-lg">Checkout</h1>
      <form onSubmit={onSubmit} className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-8">
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-4 rounded-card border border-border p-6">
            <h2 className="text-title font-bold">Contact</h2>
            {field("name", "Full name", "John Doe")}
            {field("email", "Email", "john@example.com", "email")}
            {field("phone", "Phone", "+1 555 000 0000")}
          </section>
          <section className="flex flex-col gap-4 rounded-card border border-border p-6">
            <h2 className="text-title font-bold">Shipping</h2>
            {field("address", "Address", "123 Main St")}
            <div className="grid grid-cols-2 gap-4">
              {field("city", "City", "New York")}
              {field("zip", "ZIP", "10001")}
            </div>
          </section>
          <section className="flex flex-col gap-4 rounded-card border border-border p-6">
            <h2 className="text-title font-bold">Payment</h2>
            {field("card", "Card number", "4242 4242 4242 4242")}
            <div className="grid grid-cols-2 gap-4">
              {field("expiry", "Expiry", "12/26")}
              {field("cvc", "CVC", "123")}
            </div>
          </section>
        </div>

        <aside className="mt-8 flex h-fit flex-col gap-4 rounded-card border border-border p-6 lg:mt-0">
          <h2 className="text-title font-bold">Order Summary</h2>
          <div className="flex flex-col gap-2 border-b border-border pb-4">
            {items.map((i) => (
              <div key={`${i.productId}-${i.size}-${i.color}`} className="flex justify-between text-body">
                <span className="text-muted">
                  {i.name} × {i.qty}
                </span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-body-lg">
            <span className="text-muted">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-body-lg">
            <span className="text-muted">Delivery Fee</span>
            <span className="font-medium">{formatPrice(DELIVERY)}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-body-lg">
            <span>Total</span>
            <span className="font-bold">{formatPrice(total)}</span>
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Placing order…" : "Place Order"}
          </Button>
        </aside>
      </form>
    </Container>
  );
}
