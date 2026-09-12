"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";
import { selectCartCount, useCart } from "@/stores/cart";

export function Header() {
  const router = useRouter();
  const count = useCart(selectCartCount);
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <Container className="flex h-14 items-center justify-between gap-4 lg:h-[72px]">
        <button
          type="button"
          aria-label="Open menu"
          className="text-foreground lg:hidden"
        >
          <Menu size={24} />
        </button>

        <Link
          href="/"
          className="font-display text-[1.575rem] leading-none lg:text-display"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-body-lg text-foreground hover:text-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={onSubmit}
          className="hidden h-11 max-w-md flex-1 items-center gap-3 rounded-pill bg-surface px-4 lg:flex"
        >
          <Search size={24} className="shrink-0 text-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products..."
            className="w-full bg-transparent text-body-lg text-foreground outline-none placeholder:text-subtle"
          />
        </form>

        <div className="flex items-center gap-3 lg:gap-4">
          <button
            type="button"
            aria-label="Search"
            className="text-foreground lg:hidden"
          >
            <Search size={24} />
          </button>
          <button type="button" aria-label="Account" className="hidden text-foreground lg:block">
            <User size={24} />
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative text-foreground"
          >
            <ShoppingCart size={24} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                {count}
              </span>
            )}
          </Link>
        </div>
      </Container>
    </header>
  );
}
