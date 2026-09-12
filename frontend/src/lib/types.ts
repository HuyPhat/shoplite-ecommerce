export interface Category {
  id: string;
  slug: string;
  name: string;
  image: string | null;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // cents
  compareAtPrice: number | null; // cents
  discount: number | null; // percent
  rating: number;
  ratingCount: number;
  category: Category;
  images: ProductImage[];
  colors: string[];
  sizes: string[];
  inStock: boolean;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReviewListResponse {
  items: Review[];
  total: number;
}

export interface ProductFilters {
  category?: string;
  q?: string;
  sort?: "popular" | "newest" | "price-asc" | "price-desc";
  priceMin?: number;
  priceMax?: number;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  sale?: boolean;
  page?: number;
  pageSize?: number;
}

export interface CartValidateItem {
  productId: string;
  size: string | null;
  color: string | null;
  qty: number;
}

export interface OrderPayload {
  contact: { name: string; email: string; phone: string };
  shipping: { address: string; city: string; zip: string };
  items: CartValidateItem[];
}

export interface Order {
  id: string;
  number: string;
  total: number; // cents
  items: CartValidateItem[];
}
