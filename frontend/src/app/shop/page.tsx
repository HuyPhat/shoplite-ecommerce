import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";

export default function ShopPage() {
  return (
    <Suspense>
      <ShopClient />
    </Suspense>
  );
}
