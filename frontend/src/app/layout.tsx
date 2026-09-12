import type { Metadata } from "next";
import { Archivo_Black } from "next/font/google";
import localFont from "next/font/local";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Providers } from "@/components/providers";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  variable: "--font-archivo-black",
  subsets: ["latin"],
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../styles/fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../styles/fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../styles/fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SHOP.CO — Find Clothes That Match Your Style",
  description:
    "Browse men's and women's fashion. New arrivals, top sellers, and everyday essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivoBlack.variable} ${satoshi.variable} antialiased`}
      >
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
