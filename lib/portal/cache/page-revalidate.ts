/** ISR для страниц портала; on-demand сброс — Payload hooks → revalidateTag. */
export const PORTAL_PAGE_REVALIDATE_SECONDS = 60;

/** Literal для `export const revalidate` в route-файлах (Next.js не принимает импорт константы). */
export const PORTAL_PAGE_REVALIDATE = 60;
