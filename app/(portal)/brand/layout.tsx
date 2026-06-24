import { Inter } from "next/font/google";

/** Inter только для /brand (типографическая шкала); не грузим на весь портал. */
const brandInter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export default function BrandLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={brandInter.variable}>{children}</div>;
}
