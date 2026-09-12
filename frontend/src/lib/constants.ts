export const SIZE_OPTIONS = ["Small", "Medium", "Large", "X-Large"] as const;

export const COLOR_SWATCHES = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy", value: "#31344F" },
  { name: "Green", value: "#314F4A" },
  { name: "Brown", value: "#4F4631" },
  { name: "Red", value: "#F50606" },
  { name: "Orange", value: "#F57906" },
  { name: "Yellow", value: "#F5DD06" },
  { name: "Blue", value: "#06CAF5" },
] as const;

export const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

export const PRICE_MIN = 0;
export const PRICE_MAX = 300;
