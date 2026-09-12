export const siteConfig = {
  name: "SHOP.CO",
  description: "We have clothes that suits your style and which you're proud to wear.",
  nav: [
    { label: "Shop", href: "/shop" },
    { label: "On Sale", href: "/shop?sale=1" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Brands", href: "/shop" },
  ],
  footerColumns: [
    {
      title: "Company",
      links: ["About", "Features", "Works", "Career"],
    },
    {
      title: "Help",
      links: ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
    },
    {
      title: "FAQ",
      links: ["Account", "Manage Deliveries", "Orders", "Payments"],
    },
    {
      title: "Resources",
      links: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
    },
  ],
  socials: ["twitter", "facebook", "instagram", "github"] as const,
  payments: ["VISA", "Mastercard", "PayPal", "Apple Pay", "G Pay"],
} as const;
