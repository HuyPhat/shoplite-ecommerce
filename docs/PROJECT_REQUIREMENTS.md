# ShopLite — Project Requirements

> Companion to `docs/DESIGN_SYSTEM.md`. Design source: **SHOP.CO** Figma freebie
> (`yR1T7kks6ts3vbyUSpTMqn`). Status: approved for implementation 2026-09-12.

## 1. Overview

**ShopLite** is a storefront web app that reproduces the SHOP.CO e-commerce template
pixel-close to its design tokens. It is a portfolio project demonstrating a production-shaped
full-stack build: a Next.js storefront backed by a mock API (MSW) that later swaps to a real
FastAPI/PostgreSQL REST API without changing the client contract.

## 2. Goals

- Reproduce the 5 storefront screens with high visual fidelity to the Figma tokens.
- Contract-first: MSW and FastAPI expose the **same** API surface.
- Responsive: mobile (390) and desktop (1440/1240) layouts.
- Clean, typed, testable code; CI that lints, type-checks, tests, and builds.

## 3. Non-goals (v1)

- Authentication / user accounts (guest checkout only).
- Real payment processing (mock order placement).
- Admin/CMS, inventory management UI.
- Blog, About, Contact, Blog-post pages (dropped by decision).
- Analytics, recommendations engine, multi-currency, i18n.

## 4. Personas

1. **Shopper** — browses catalog, filters/sorts, views product, adds to cart, checks out as guest.
2. **Developer** — reads design tokens + API contract, extends backend, runs CI.

## 5. Sitemap

| Route | Page | Figma source |
|---|---|---|
| `/` | Home | `#20:2` (desktop), `#35:740` (mobile) |
| `/shop` | Category / listing + filters | `#26:855` (desktop), `#38:234` (mobile), `#38:679` (filters drawer) |
| `/product/[slug]` | Product detail | `#1:2` (desktop), `#35:1062` (mobile) |
| `/cart` | Cart | `#31:32` (desktop), `#39:1045` (mobile) |
| `/checkout` | Checkout (derived, no Figma) | composed from cart/summary patterns |

## 6. Functional requirements

### 6.1 Global (all pages)
- **FR-G1** Announcement bar — "Sign up and get 20% off … **Sign Up Now**", dismissible (persist in `localStorage`).
- **FR-G2** Header — logo (SHOP.CO), desktop nav (`Shop`, `On Sale`, `New Arrivals`, `Brands`), search pill, cart + account icons; sticky; cart icon shows live item count.
- **FR-G3** Footer — brand + tagline + socials, 4 link columns (Company / Help / FAQ / Resources), copyright, payment badges.
- **FR-G4** Search — filters products by name on submit; navigates to `/shop?q=`.

### 6.2 Home (`/`)
- **FR-H1** Hero — headline, subtext, "Shop Now" CTA, stats (200+ brands, 2k+ products, 30k+ customers).
- **FR-H2** Brand logo strip (VERSACE, ZARA, GUCCI, PRADA, CALVIN KLEIN).
- **FR-H3** "New Arrivals" — 4-col product grid (2-col mobile).
- **FR-H4** "Top Selling" — product grid.
- **FR-H5** "Browse by dress style" — Casual / Formal / Party / Gym image tiles.
- **FR-H6** "Our happy customers" — testimonial cards (carousel on mobile, grid desktop).
- **FR-H7** Newsletter CTA (black card) + footer.

Acceptance: all sections render; grids collapse to 2-col < 768px; CTAs link to `/shop` / `/product/:slug`.

### 6.3 Shop (`/shop`)
- **FR-S1** Breadcrumb `Home / Shop`; H1 = active category; meta "Showing X–Y of N Products".
- **FR-S2** Sort dropdown: Most Popular, Newest, Price low→high, Price high→low.
- **FR-S3** Filter sidebar (desktop, `lg`) / bottom-sheet drawer (mobile): price range (dual slider), colors, sizes, dress style (category), rating.
- **FR-S4** Product grid (3-col desktop / 2-col mobile) with cards per §8.2 of design system.
- **FR-S5** Pagination (Prev / numbered / Next).
- **FR-S6** Filter state reflected in URL query params (shareable/back-safe).

Acceptance: filter+sort+search combine; grid updates; active filter badges removable; empty state when 0 results.

### 6.4 Product detail (`/product/[slug]`)
- **FR-P1** Gallery — thumbnail column + main image; selected thumbnail ring; image switch.
- **FR-P2** Title, rating (`★ 4.5/5` + review count), price (current + strikethrough + `-N%` badge), description.
- **FR-P3** Color swatches (green/navy/brown/…), size chips (XS–XXL), quantity stepper (min 1).
- **FR-P4** "Add to Cart" — validates size/color selection (toast on missing), adds to cart, updates header count.
- **FR-P5** Tabs: Product Details / Rating & Reviews / FAQs.
- **FR-P6** Review cards (name, stars, date, text) + "Load More"; "Write a Review" (opens form, posts).
- **FR-P7** "You might also like" — related products grid.

Acceptance: qty/color/size persist into cart; invalid state blocked; unknown slug → 404.

### 6.5 Cart (`/cart`)
- **FR-C1** Line items — image, title, size/color, unit price, qty stepper, line total, delete.
- **FR-C2** Order summary — subtotal, discount (red), delivery fee, total; promo-code input + Apply; "Go to Checkout".
- **FR-C3** Empty cart state with CTA to `/shop`.
- **FR-C4** Cart persisted (Zustand `persist` → `localStorage`).

Acceptance: qty/remove update totals live; promo code adjusts discount; totals match item math.

### 6.6 Checkout (`/checkout`)
- **FR-K1** Contact + shipping form (name, email, phone, address, city, ZIP) with inline validation.
- **FR-K2** Order summary (mirror cart summary).
- **FR-K3** Payment mock — card fields (format-checked, no real charge) + "Place Order".
- **FR-K4** Confirmation state with order number; cart cleared.
- **FR-K5** Route-guard: empty cart redirects to `/cart`.

Acceptance: invalid form blocks submit; valid submit → `POST /api/orders` → confirmation; cart empties.

## 7. State management

- **Server state** — React Query (`@tanstack/react-query`): products, categories, product detail, reviews, orders.
- **Client state** — Zustand: `useCart` (items, add/remove/qty, subtotal/discount/total), `useUI` (drawer open, toast, promo). Persisted: cart only.
- Query keys namespaced by resource (`['product', slug]`, `['products', filters]`).

## 8. API contract (mock-first — MSW == FastAPI)

Base path `/api`. JSON. Envelope: errors `{ "detail": string }`.

| Method | Path | Query/Body | Returns |
|---|---|---|---|
| GET | `/api/categories` | — | `Category[]` |
| GET | `/api/products` | `category`, `q`, `sort`, `priceMin/Max`, `color[]`, `size[]`, `rating`, `page`, `pageSize` | `{ items, total, page, pageSize }` |
| GET | `/api/products/{slug}` | — | `Product` (with variants, images, reviews meta) |
| GET | `/api/products/{slug}/reviews` | `page` | `{ items, total }` |
| GET | `/api/products/{slug}/related` | — | `Product[]` |
| POST | `/api/cart/validate` | `[{ productId, variant, qty }]` | `{ valid, items: [{ productId, price, inStock }] }` |
| POST | `/api/orders` | checkout payload | `{ order: { id, number, total, items } }` |
| POST | `/api/newsletter` | `{ email }` | `{ ok: true }` |

Types live in `frontend/src/lib/types.ts`; mirrored by Pydantic schemas in `backend/app/schemas/`.

## 9. Data model (PostgreSQL)

`categories(id, slug, name)` · `products(id, slug, name, description, price, compare_at_price, rating, rating_count, category_id)` · `product_variants(id, product_id, color, size, stock)` · `product_images(id, product_id, src, alt, sort)` · `reviews(id, product_id, author, rating, text, created_at)` · `orders(id, number, customer_name, email, total, status, created_at)` · `order_items(id, order_id, product_id, variant, qty, price)` · `subscribers(id, email)`.

Seed: 6 categories (Casual, Formal, Party, Gym, Jeans, Shirts), ~16 products with variants/images/reviews.

## 10. Non-functional requirements

- **Performance** — Lighthouse ≥ 90 mobile; `next/image` everywhere; lazy off-screen; font-display swap.
- **Responsive** — mobile 390 and desktop 1240 layouts; no horizontal scroll.
- **Accessibility** — WCAG 2.1 AA: semantic landmarks, focus-visible rings, `aria-label` on icon buttons, color contrast (muted `.6` on white ≈ 4.6:1), keyboard drawer/dialog, alt text.
- **SEO** — metadata per page (`title`, `description`, OpenGraph), semantic headings, product structured data (JSON-LD) optional.
- **Security** — no secrets client-side; inputs validated (zod) at boundary; FastAPI CORS allow-list; parameterized SQL via SQLAlchemy.
- **Reliability** — 404/error boundaries; graceful empty/loading states.

## 11. Tech stack (locked)

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, React Query, Zustand, MSW, zod, lucide-react |
| Backend | FastAPI, Pydantic v2, SQLAlchemy 2.0 (async), Alembic, PostgreSQL 16 |
| Infra | Docker + docker-compose (web / api / db), GitLab CI |
| Tests | Vitest + Testing Library (frontend), pytest (backend), Playwright (E2E) |

## 12. Dev environment & CI

- `docker compose up` → api (:8000), web (:3000), db (:5432).
- Frontend dev uses MSW (`NEXT_PUBLIC_API_MOCK=true`) so no backend needed locally.
- `.gitlab-ci.yml` stages: `lint` (eslint, ruff) → `typecheck` (tsc, mypy) → `test` (vitest, pytest) → `build` (next build + docker build) → `e2e` (Playwright, optional/manual).

## 13. Testing & verification

- Unit: cart store math, price formatting, filter query builder, API validation.
- Component: product card, header count, qty stepper.
- Integration: MSW handlers vs. client hooks.
- Backend: endpoint tests (pytest + httpx) against SQLite/test DB.
- E2E: home → shop (filter) → product (add) → cart (edit) → checkout (place).
- Visual: screenshot diff of 5 routes vs `docs/design/screens/` (tolerance ±1px, documented deviations).

## 14. Out of scope (explicit)

Auth, payments, admin, CMS, blog/about/contact pages, wishlist, account, real email/newsletter, SSR data from FastAPI in v1 (client-fetched via React Query).

## 15. Assumptions / open questions

- Brand wordmark ships as **SHOP.CO** (matches Figma); repo name `shoplite_ecommerce` unchanged.
- Display font substituted (Archivo Black) pending an Integral CF license.
- Checkout has no Figma reference — built in-system; subject to review.
- Product photography: Figma image fills used as placeholders until real seed images.
