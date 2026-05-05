/**
 * Клиент Strapi REST API (v5). База: process.env.STRAPI_URL, опционально STRAPI_API_TOKEN.
 */

const getBase = () => {
  const u =
    process.env.STRAPI_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://127.0.0.1:1337";
  return u.replace(/\/$/, "");
};

type StrapiListResponse<T> = {
  data: T[];
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
};

type StrapiItemResponse<T> = {
  data: T;
};

/** Плоский документ Strapi 5 (поля на верхнем уровне data) */
export type StrapiComponent = {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string | null;
  figmaUrl?: string | null;
  storybookUrl?: string | null;
  docsUrl?: string | null;
};

export type StrapiColor = {
  id: number;
  documentId?: string;
  name: string;
  tokenKey?: string | null;
  hex: string;
  sortOrder?: number | null;
  caption?: string | null;
};

export type StrapiMedia = {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
  mime?: string;
};

export type StrapiIcon = {
  id: number;
  documentId?: string;
  name: string;
  slug?: string | null;
  figmaUrl?: string | null;
  storybookUrl?: string | null;
  notes?: string | null;
  preview?: StrapiMedia | null;
};

export type StrapiPortalSource = {
  id: number;
  documentId?: string;
  figmaLibraryUrl?: string | null;
  storybookUrl?: string | null;
  documentationUrl?: string | null;
  repositoryUrl?: string | null;
};

/** Strapi 4-стиль: { id, attributes }; Strapi 5 — плоский объект. */
function unwrapItem<T extends Record<string, unknown>>(raw: unknown): T {
  if (raw && typeof raw === "object" && "attributes" in raw) {
    const r = raw as { id: number; documentId?: string; attributes: T };
    return { id: r.id, documentId: r.documentId, ...r.attributes } as T;
  }
  return raw as T;
}

function mapList<T extends Record<string, unknown>>(data: unknown): T[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => unwrapItem<T>(item));
}

function authHeaders(): HeadersInit {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function strapiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getBase()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      ...authHeaders(),
      ...init?.headers,
    },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi ${res.status} ${url}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

function mediaUrl(m: StrapiMedia | null | undefined): string | null {
  if (!m?.url) return null;
  if (m.url.startsWith("http")) return m.url;
  return `${getBase()}${m.url}`;
}

/** populate preview может быть плоским объектом или { data: media }. */
function unwrapMedia(raw: unknown): StrapiMedia | null {
  if (raw == null) return null;
  let inner: unknown = raw;
  if (typeof inner === "object" && inner !== null && "data" in inner) {
    inner = (inner as { data: unknown }).data;
  }
  if (inner == null) return null;
  const m = unwrapItem<StrapiMedia>(inner);
  return m?.url ? m : null;
}

export function normalizeIconPreview(icon: StrapiIcon): StrapiIcon {
  const media = unwrapMedia(icon.preview);
  if (!media) return { ...icon, preview: null };
  const url = mediaUrl(media);
  return { ...icon, preview: url ? { ...media, url } : media };
}

/** GET /api/components?sort=name:asc */
export async function getComponents(): Promise<StrapiComponent[]> {
  const qs = new URLSearchParams({
    "sort": "name:asc",
    "pagination[pageSize]": "100",
  });
  const json = await strapiFetch<StrapiListResponse<StrapiComponent>>(
    `/api/components?${qs}`,
  );
  return mapList<StrapiComponent>(json.data);
}

export async function getComponentBySlug(slug: string): Promise<StrapiComponent | null> {
  const qs = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "pagination[pageSize]": "1",
  });
  const json = await strapiFetch<StrapiListResponse<StrapiComponent>>(
    `/api/components?${qs}`,
  );
  const first = json.data?.[0];
  return first ? unwrapItem<StrapiComponent>(first) : null;
}

export async function getColors(): Promise<StrapiColor[]> {
  const qs = new URLSearchParams({
    "sort": "sortOrder:asc",
    "pagination[pageSize]": "100",
  });
  const json = await strapiFetch<StrapiListResponse<StrapiColor>>(`/api/colors?${qs}`);
  return mapList<StrapiColor>(json.data);
}

export async function getIcons(): Promise<StrapiIcon[]> {
  /** Strapi 5: `populate[preview]=*` отдаёт 400; достаточно `populate=*` для связи preview (media). */
  const qs = new URLSearchParams({
    populate: "*",
    sort: "name:asc",
    "pagination[pageSize]": "100",
  });
  const json = await strapiFetch<StrapiListResponse<StrapiIcon>>(`/api/icons?${qs}`);
  const list = json.data ?? [];
  return list.map(normalizeIconPreview);
}

export async function getPortalSources(): Promise<StrapiPortalSource | null> {
  try {
    const json = await strapiFetch<StrapiItemResponse<StrapiPortalSource | null>>(
      `/api/portal-source`,
    );
    if (!json.data) return null;
    return unwrapItem<StrapiPortalSource>(json.data);
  } catch {
    return null;
  }
}

/** Админка Strapi (локально по умолчанию). */
export function getStrapiAdminUrl(): string {
  return `${getBase()}/admin`;
}
