import { brandPath, PORTAL_BRAND_PATH } from "@/lib/portal/core/portal-base-path";

export const BRAND_PAGE_SLUGS = [
  "logos",
  "icons",
  "typography",
  "color",
  "visual-style",
  "social-media",
] as const;

export type BrandPageSlug = (typeof BRAND_PAGE_SLUGS)[number];

export function isBrandPageSlug(value: string): value is BrandPageSlug {
  return (BRAND_PAGE_SLUGS as readonly string[]).includes(value);
}

export type BrandNavItem = {
  slug: BrandPageSlug | null;
  label: string;
  href: string;
  description: string;
};

export const BRAND_NAV_ITEMS: BrandNavItem[] = [
  {
    slug: "logos",
    label: "Логотипы",
    href: brandPath("/logos"),
    description: "Адаптация к фону, охранные поля и запрещённые варианты.",
  },
  {
    slug: "icons",
    label: "Иконки",
    href: brandPath("/icons"),
    description: "Объёмный 3D-стиль, сетка 8 px и правила размещения в карточках.",
  },
  {
    slug: "typography",
    label: "Типографика",
    href: brandPath("/typography"),
    description: "Inter: начертания, шкала размеров и подключение.",
  },
  {
    slug: "color",
    label: "Палитра",
    href: brandPath("/color"),
    description: "Система цвета, градиенты и палитра для графиков.",
  },
  {
    slug: "visual-style",
    label: "Визуальный стиль",
    href: brandPath("/visual-style"),
    description: "3D-изображения, фотостиль и принципы мокапов интерфейсов.",
  },
  {
    slug: "social-media",
    label: "Соцсети",
    href: brandPath("/social-media"),
    description: "Цвета, константы, 3D-элементы, отступы и примеры для соцсетей.",
  },
];

export const PORTAL_BRAND_OVERVIEW = {
  href: PORTAL_BRAND_PATH,
  label: "Обзор",
} as const;
