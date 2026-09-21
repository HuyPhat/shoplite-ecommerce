// Mirrors next.config.ts's basePath. Needed anywhere client code builds an
// absolute-from-root URL (fetch calls, the MSW service worker registration)
// since Next.js does not rewrite those automatically the way it does <Link>
// and next/image. Empty string outside the static GitHub Pages export.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
