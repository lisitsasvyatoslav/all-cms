import { access, mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import {
  RELATED_PREVIEW_HEIGHT,
  RELATED_PREVIEW_WIDTH,
} from "@/lib/portal/documentation/related-preview-layout";

/** OG для главной, каталога и прочих не-комponent страниц (не превью компонента). */
export const PORTAL_SITE_OG_RELATIVE_PATH = "/og/portal-site.webp";

/** @deprecated Используйте PORTAL_SITE_OG_RELATIVE_PATH */
export const PORTAL_DEFAULT_OG_RELATIVE_PATH = PORTAL_SITE_OG_RELATIVE_PATH;

const OG_DIR = "public/og";
const OG_FILENAME = "portal-site.webp";

function portalSiteOgSvg(): Buffer {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${RELATED_PREVIEW_WIDTH}" height="${RELATED_PREVIEW_HEIGHT}" viewBox="0 0 ${RELATED_PREVIEW_WIDTH} ${RELATED_PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#fafafa"/>
  <rect x="80" y="80" width="1040" height="470" rx="24" fill="#ffffff" stroke="#e4e4e7" stroke-width="2"/>
  <text x="600" y="290" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="64" font-weight="600" fill="#18181b">Design System</text>
  <text x="600" y="360" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="28" fill="#71717a">Портал дизайн-системы</text>
</svg>`;
  return Buffer.from(svg);
}

/** Генерирует public/og/portal-site.webp — нейтральная OG без UI компонентов. */
export async function generatePortalSiteOgImage(projectRoot: string): Promise<boolean> {
  const outDir = path.join(projectRoot, OG_DIR);
  const outPath = path.join(outDir, OG_FILENAME);
  await mkdir(outDir, { recursive: true });

  await sharp(portalSiteOgSvg())
    .resize(RELATED_PREVIEW_WIDTH, RELATED_PREVIEW_HEIGHT)
    .webp({ quality: 90 })
    .toFile(outPath);

  console.log(`Portal site OG: ${path.relative(projectRoot, outPath)}`);
  return true;
}

export async function portalSiteOgImageExists(projectRoot: string): Promise<boolean> {
  try {
    await access(path.join(projectRoot, OG_DIR, OG_FILENAME));
    return true;
  } catch {
    return false;
  }
}

/** @deprecated Используйте generatePortalSiteOgImage */
export async function syncPortalDefaultOgImage(projectRoot: string): Promise<boolean> {
  return generatePortalSiteOgImage(projectRoot);
}
