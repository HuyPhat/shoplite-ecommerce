# ShopLite — Design System (SHOP.CO)

> **Source of truth:** Figma — `E-commerce Website Template (Freebie) (Community)`
> `https://www.figma.com/design/yR1T7kks6ts3vbyUSpTMqn/` (canvas `Pages` `#0:1`)
> Reference renders: `docs/design/screens/` (home / shop / product / cart desktop + mobile, filters).
>
> **Extraction method:** tokens read from the Figma node tree (`GLOBAL_VARS` styles + auto-layout
> values), cross-checked against full-size screen renders. The file defines no Figma *Variables* —
> only layer styles (`fill_*`, `style_*`); semantic names below are our mapping. See
> `.opencode/skills/figma-to-nextjs-tailwind.md` for the codegen rules these tokens feed into.
>
> **Machine-readable form:** `frontend/src/styles/theme.css` (Tailwind v4 `@theme`).
> Components must use semantic utilities (`bg-background`, `text-muted`, `rounded-card`, …).
> Raw hex or arbitrary values in components are prohibited.

---

## 1. Brand

- UI wordmark: **SHOP.CO** (Integral CF Bold, tracked tight). Repo ships as `shoplite`; wordmark is
  a single content token (`siteConfig.name`) for easy rebrand.
- Voice: bold, uppercase display headlines; minimal, high-contrast monochrome base with product
  photography as the only color.

## 2. Color

### 2.1 Core palette (semantic)

| Token | Value | Figma source | Usage |
|---|---|---|---|
| `background` | `#FFFFFF` | `fill_658ab2fa` / `Neutral Colors/White` | Page bg, card fills, text-on-dark |
| `foreground` | `#000000` | `fill_34dc0314` | Primary text, black CTAs, announcement bar, newsletter card |
| `surface` | `#F0F0F0` | `fill_114125f5` | Search bar, size pills, qty stepper, slider track, footer bg, filter chips |
| `surface-hero` | `#F2F0F1` | inline (homepage) | Hero section bg |
| `surface-product` | `#F0EEED` | `fill_9559a04a` | Product-image placeholder bg (cards, thumbnails, cart lines) |
| `muted` | `rgba(0,0,0,.6)` | `fill_4cd5ff90` | Secondary text: taglines, breadcrumb, descriptions, link rows |
| `subtle` | `rgba(0,0,0,.4)` | `fill_62008434` | Placeholders, strikethrough old prices |
| `faint` | `rgba(0,0,0,.2)` | `fill_d316f320` | Drawer scrim, swatch rings |
| `border` | `rgba(0,0,0,.1)` | `fill_090ebe47` | All 1px dividers/outlines (cards, filters, breadcrumbs rule) |
| `ring-subtle` | `rgba(0,0,0,.06)` | `fill_4f6e0e45` | Pagination/number active bg (light) |
| `ring-subtle-dark` | `rgba(255,255,255,.06)` | `fill_87a9adb8` | Pagination number bg (on dark) |
| `neutral-400` | `#D6DCE5` | `Neutral Colors/400` | Payment-badge stroke |

### 2.2 Accents

| Token | Value | Figma source | Usage |
|---|---|---|---|
| `accent` | `#FFC633` | `fill_452c7219` | Rating stars |
| `sale` | `#FF3333` | `fill_b88d7c3a` | Discount % text, delete icon |
| `sale-bg` | `rgba(255,51,51,.1)` | `fill_184e7b03` | Discount badge bg |
| `primary` / `primary-foreground` | `#000000` / `#FFFFFF` | `fill_34dc0314`/`fill_658ab2fa` | Button fill / label |

### 2.3 Data colors (product content, not chrome)

- PDP swatches: `#4F4631` (brown), `#314F4A` (green), `#31344F` (navy) — `fill_15b03637`, `fill_3eb678b4`, inline.
- Shop filter swatches: `#F50606 #F5DD06 #F57906 #06CAF5 #063AF5 #7D06F5 #F506A4 #FFFFFF #000000` (37×37 circles; selected = 16px black check on ring).
- Thumbnail fallbacks: `#F3F1EF`, `#F4F1F4`.

These live in seed data (product records), never in component styles.

## 3. Typography

### 3.1 Families

| Role | Figma | Web | Loading |
|---|---|---|---|
| Display / headings / logo | Integral CF Bold 700 (commercial) | **Archivo Black** (OFL, closest free heavy geometric) | `next/font/google` |
| UI / body / prices | Satoshi (400/500/700) | **Satoshi** (free, Fontshare) | `next/font/local` (Fontshare files vendored) |
| — | Poppins 400 16px, one stray footer column | dropped → Satoshi | — |

> Substitution approved 2026-09-12. Swap by editing `--font-display` only.

### 3.2 Type scale (Figma px → tokens, rem @16)

| Token | Figma px / lh | Font | Weight | Tailwind utility | Used for |
|---|---|---|---|---|---|
| `text-hero` | 64 / 64 (mob 36) | display | 700 | `text-hero` | Home hero headline |
| `text-display-lg` | 48 | display | 700 | `text-display-lg` | Cart/section titles (desktop) |
| `text-display-md` | 40 / 45 | display | 700 | `text-display-md` | "STAY UPTO DATE…" (desktop), section h2 |
| `text-display-sm` | 32 / 36 | display | 700 | `text-display-sm` | Section headings, newsletter mobile, PDP h2 |
| `text-title-lg` | 24 | display | 700 | `text-title-lg` | Page titles (Casual), PDP title mob |
| `text-title` | 24 | sans | 700 | `text-title` | "Order Summary" |
| `text-price-lg` | 20 | sans | 700 | `text-price-lg` | Prices, old price (strikethrough `subtle`) |
| `text-body-lg` | 16 / 22 | sans | 400/500 | `text-body-lg` | Nav, descriptions, card titles (bold) |
| `text-body` | 14 / 20 | sans | 400 | `text-body` | Footer links, filters, meta |
| `text-caption` | 12 / 22 | sans | 400/500 | `text-caption` | Ratings, stats labels, announcement |
| `text-overline` | 16 / 18, `ls .1875em`, UPPERCASE | sans 500 | — | `text-overline` | Footer column headings |
| `text-overline-sm` | 14 / 18, `ls .2143em`, UPPERCASE | sans 500 | — | `text-overline-sm` | (mobile variant) |
| `text-badge` | 10 | sans 500 | — | `text-badge` | Discount badge |

Rules: display family only for headlines/logo/section titles; all UI controls, prices, body copy in
Satoshi. PDP title desktop = display 24/28 (`text-title-lg` line-height tuned). Card titles =
`text-body-lg font-bold`.

## 4. Spacing & layout

Base unit **4px** (Tailwind default scale fits; odd Figma values rounded to nearest 2:
10.29→10, 11→12, 15→16, 22→24, 25/26→24/28, 332/342 column gutters→320/320).

Key rhythm:
- Gap scale used: 4, 8, 12, 16, 24, 32, 40 (px).
- Product card internals: image → title 16? no: title sits 12 under image, rating row gap 8, price row gap 5→8.
- Sections (desktop): 64–100 between blocks; container vertical padding ~80.

Layout frame:
- **Desktop** design width 1440; **content column 1240**, gutter 100. → `container = mx-auto w-full max-w-[1240px] px-4 md:px-6 lg:px-8`.
- **Mobile** design width 390, side padding 16.
- Breakpoints: Tailwind default; storefront switches to 3-col grids at `md`, filter sidebar appears at `lg`.
- Announcement bar: 38px desktop; header row: h-[72px] desktop / h-[56px] mobile; search pill `h-11 rounded-pill bg-surface`.

## 5. Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-badge` | 5px | Payment badges |
| `rounded-md` | 8px | Buttons (component-set base), pagination squares, cart-line images (8.66→8) |
| `rounded-card` | 13px | Mobile product-image tiles (13.42→13) |
| `rounded-lg` | 20px | Cards (reviews, filter panel, newsletter, desktop product tiles, mobile drawer top) |
| `rounded-xl` | 40px | Dress-style panel images |
| `rounded-pill` | 62px | All CTAs, search, inputs, size chips, discount badge, slider track |

## 6. Elevation

| Token | Value | Usage |
|---|---|---|
| `shadow-badge` | `0 .384px 3.842px rgba(183,183,183,.08), 0 3.842px 7.684px rgba(183,183,183,.08)` | Payment badges |
| `shadow-badge-lg` | `0 .448px 4.482px rgba(183,183,183,.08), 0 4.482px 8.964px rgba(183,183,183,.08)` | Payment badges (desktop) |
| blur overlay | `filter: blur(2px)` | Scrim behind mobile filter drawer thumbnails |

No other shadows — depth comes from borders (`border/1px`) and bg fills.

## 7. Borders & icons

- All strokes 1px `border`. Swatch selected ring: 2px `foreground` offset.
- Icons: 24×24 (nav/UI), 16×16 (chips/breadcrumb chevrons 14), 20×20 (buttons/pagination),
  stroke style, currentColor. Library: **lucide-react** mapped 1:1 (cart, user, search, chevron-down,
  trash, tag, mail, arrows, star-fill/half, filter sliders, socials as simple icons).

## 8. Component specs

### 8.1 Buttons (`rounded-pill` unless noted)
| Variant | Style | Text |
|---|---|---|
| `primary` | bg `foreground`, text `background`, px-13? use `px-12 py-3`, h-[52px] desktop CTAs / h-[46px] | `text-body-lg font-medium` |
| `secondary` | bg `surface` | same |
| `outline` | 1px `border`, text `foreground` | same |
| size `sm` | `px-4 py-2 rounded-md` gap 8 | `text-body` |
States: hover `bg-foreground/90` / `bg-surface-hover`; focus-visible `ring-2 ring-offset-2`; active scale-[.98]. (Derived — Figma static.)

### 8.2 Product card
Image tile `aspect-square rounded-card bg-surface-product` (`next/image` cover, object-bottom)
→ title `text-body-lg font-bold` → rating row (stars `accent` 16px + `3.5/<span muted>5</span>`)
→ price row (`text-price-lg` + old `text-price-lg line-through text-subtle` + `-20%` badge
`rounded-pill bg-sale-bg text-sale text-badge`). Hover: image crossfades to alt image. (Hover derived.)
Grids: Home 4-col / Shop 3-col desktop, 2-col mobile.

### 8.3 Inputs / search
`rounded-pill bg-surface px-4 py-3 h-11`, placeholder `subtle`, icon 24 left. Focus: `outline-none ring-2 ring-foreground` (derived).
Newsletter (dark card): white pill inputs w/ mail icon; subscribe = white pill button.

### 8.4 Chips (size selector)
Unselected `bg-surface rounded-pill px-6 py-3 text-body-lg`; selected `bg-foreground text-background`.

### 8.5 Discount badge
`bg-sale-bg text-sale rounded-pill px-3.5 py-1 text-badge font-medium` e.g. `-20%`.

### 8.6 Rating stars
5 stars 16px gap 4, `accent`; halves supported (clip); numeric `caption` + `/5` in `muted`.

### 8.7 Pagination
Prev/Next: `h-9 px-4 py-2 rounded-md bg-background border text-body` (w ~73–90). Numbers 36×36
`rounded-md`; active `bg-ring-subtle` + font-bold; default `bg-transparent`.

### 8.8 Announcement bar
Full-bleed `bg-foreground text-background text-center text-caption` — "Sign up and get 20% off …
**Sign Up Now**" (underline link), close ✕ 20px right. Dismissible → `localStorage` (derived).

### 8.9 Header
Logo display-bold; desktop nav `Shop ▾ On Sale · New Arrivals · Brands` gap 40; search pill
(max-w 600); icons cart+account 24 gap 14. Mobile: hamburger left? per Figma: logo left, icons right,
hamburger right-side row. Sticky top (derived). Bottom border `border`.

### 8.10 Footer
`bg-surface`; brand col (logo 28.8→`text-display-sm`, tagline `text-body text-muted`,
socials 28×28 circles black-outline) + 4 link cols (`text-overline-sm` headings, links `text-body
text-muted`, col gap 16, link gap ~14) → divider → copyright `text-body text-muted` + payment badges
(white `rounded-badge border neutral-400 shadow-badge`, ~47×30: VISA, MC, PayPal, Apple Pay, G Pay).

### 8.11 Newsletter card
`bg-foreground rounded-lg p-9 lg:p-16` two-col desktop: heading `text-display-md text-background` /
inputs col gap 14 (email pill w/ mail icon, subscribe white pill). Mobile stacked, h-[293px]→auto.

### 8.12 Filter panel (desktop sidebar / mobile bottom-sheet)
Card `bg-background rounded-lg border p-6`; section: heading `text-title` + chevron-up;
divider; item rows `text-body text-muted` + `›`; price dual-slider track `h-1.5 bg-surface`,
fill `bg-foreground`, knobs 20×20 circle; color grid gap 8 37px circles; size chips wrap gap 8;
Apply = primary full-width. Mobile sheet: `rounded-t-lg`, max-h-[90dvh] scroll.

### 8.13 Cart line item / order summary
Line: row gap 14–16, image 99→124px `rounded-md bg-surface-product`, title bold + `Size:`/`Color:`
meta (`text-body`, label bold? per Figma label regular, value after colon) + price, qty stepper
(`bg-surface rounded-pill px-4 py-3`, ±20px icons), delete `text-sale` 24.
Summary card: `rounded-lg border p-6`; rows `space-between text-body-lg` (Subtotal /
Discount red / Delivery Fee / divider / **Total bold**); promo pill input + Apply black pill;
"Go to Checkout" primary full-width w/ arrow.

### 8.14 PDP
Thumbs col 104px gap ~14 (`rounded-md bg-surface-product`, selected `ring border-foreground`);
main image `rounded-lg bg-surface-product`; right col: title `text-title-lg` display, stars +
`(4.5/5)`, price row w/ strike + badge, description `text-body text-muted`,
dividers, "Select Colors" swatches, "Choose Size" chips, qty stepper + **Add to Cart** (flex-1);
tabs `Product Details · Rating & Reviews · FAQs` (active `text-foreground border-b-2`,
inactive `text-muted`) — reviews grid 2-col cards `rounded-lg border p-7`, "Write a Review"
primary sm; `YOU MIGHT ALSO LIKE` 4-col card grid.

### 8.15 Category page header
Breadcrumb `text-body text-muted` + chevrons; H1 `text-title-lg display`;
right meta: `Showing 1-10 of 100 Products` (`text-body text-muted`) + `Sort by: **Most Popular** ▾`
(button w/ chevron, popover list — derived).

## 9. Do / Don't (codegen)

- ✅ Semantic utilities only: `bg-surface`, `text-muted`, `rounded-pill`, `shadow-badge`.
- ✅ `next/image` with `fill` or explicit w/h; `next/link` for nav; RSC default, `'use client'` at leaves.
- ✅ Tailwind spacing tokens; no arbitrary values except documented (`max-w-[1240px]`, hero clamp).
- ❌ Raw hex, inline styles, `p-[17px]`-style values, hardcoded `font-family` strings.
- ❌ New colors/shadows not in `theme.css` — extend tokens first, then use.

## 10. Known deviations & caveats

1. No Figma Variables → mapping hand-built from `fill_*`/`style_*` keys; verified against renders.
2. Integral CF → Archivo Black substitution (approved). Opticals ~8% wider display; acceptable.
3. Figma is static: hover/focus/active, drawer animations, toast styles are **derived** and marked
   "(derived)" above.
4. Rounding: sub-px Figma artifacts (13.42, 8.66, 0.19 strokes, 10.29 gaps) normalized to the
   scales above; render-diff tolerance ±1px.
5. Desktop-only screens exist for Home/Shop/Product/Cart; Filters is mobile-only — desktop filter
   sidebar is on the Category page.
