import { ProductClient } from "@/components/product/ProductClient";
import { products } from "@/mocks/db";

// Required for `output: "export"` (static GitHub Pages build): every
// dynamic route must be known at build time since there's no server to
// render arbitrary slugs on demand. Product data itself still loads
// client-side via the MSW mock worker after hydration.
export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductClient slug={slug} />;
}
