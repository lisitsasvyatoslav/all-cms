import { Geist_Mono, Montserrat } from "next/font/google";

/** Основной UI-шрифт портала (Radix --default-font-family). */
export const portalMontserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

/** Моноширинный — только code blocks; не блокирует первый рендер. */
export const portalGeistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const portalFontClassName = `${portalMontserrat.variable} ${portalGeistMono.variable}`;
