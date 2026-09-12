import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StarRating } from "@/components/ui/StarRating";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductSection } from "@/components/home/ProductSection";

const stats: [string, string][] = [
  ["200+", "International Brands"],
  ["2,000+", "High-Quality Products"],
  ["30,000+", "Happy Customers"],
];

const brands = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

const styles = [
  { label: "Casual", seed: "casual-style" },
  { label: "Formal", seed: "formal-style" },
  { label: "Party", seed: "party-style" },
  { label: "Gym", seed: "gym-style" },
];

const testimonials = [
  {
    name: "Sarah M.",
    text: "I absolutely love the clothes I bought! The quality exceeded my expectations and the fit is perfect.",
  },
  {
    name: "Alex K.",
    text: "Great selection and super fast delivery. The customer service team was incredibly helpful too.",
  },
  {
    name: "James L.",
    text: "Found exactly what I was looking for. Prices are fair and the fabric quality is top notch.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface-hero">
        <Container className="grid gap-8 py-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-0">
          <div className="flex flex-col gap-6 lg:py-16">
            <h1 className="font-display text-[2.25rem] leading-[1.05] lg:text-hero lg:leading-none">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>
            <p className="max-w-md text-body text-muted">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of
              style.
            </p>
            <div>
              <Link href="/shop">
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {stats.map(([n, label]) => (
                <div key={label} className="flex flex-col">
                  <span className="font-display text-display">{n}</span>
                  <span className="text-caption text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-72 lg:h-[540px]">
            <Image
              src="https://picsum.photos/seed/hero-couple/900/1080"
              alt="Featured fashion editorial"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* Brand strip */}
      <section className="bg-foreground text-background">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-8 lg:justify-between lg:py-10">
          {brands.map((b) => (
            <span key={b} className="font-display text-[1.1rem] lg:text-[1.6rem]">
              {b}
            </span>
          ))}
        </Container>
      </section>

      {/* Product sections */}
      <Container>
        <ProductSection sort="newest" />
        <div className="border-t border-border" />
        <ProductSection sort="popular" />
      </Container>

      {/* Browse by dress style */}
      <Container className="pb-12 lg:pb-16">
        <section className="rounded-card bg-surface p-4 lg:p-8">
          <h2 className="mb-6 text-center font-display text-display uppercase lg:text-display-lg">
            BROWSE BY dress STYLE
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {styles.map((s) => (
              <Link
                key={s.label}
                href={`/shop?category=${s.label.toLowerCase()}`}
                className="relative h-44 overflow-hidden rounded-card lg:h-72"
              >
                <Image
                  src={`https://picsum.photos/seed/${s.seed}/600/800`}
                  alt={s.label}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                <span className="absolute left-5 top-5 font-display text-title-lg text-foreground">
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </Container>

      {/* Testimonials */}
      <Container className="pb-12 lg:pb-16">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-display uppercase lg:text-display-lg">
            OUR HAPPY CUSTOMERS
          </h2>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-4 rounded-card border border-border p-6"
            >
              <StarRating rating={5} size={20} />
              <figcaption className="flex items-center gap-1 font-bold text-foreground">
                {t.name}
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-foreground">
                  ✓
                </span>
              </figcaption>
              <blockquote className="text-body text-muted">{t.text}</blockquote>
            </figure>
          ))}
        </div>
      </Container>

      <Container>
        <Newsletter />
      </Container>
    </>
  );
}
