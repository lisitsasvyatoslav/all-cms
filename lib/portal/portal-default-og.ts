import { access, copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

/** Дефолтная OG-картинка портала (1200×630, из Playwright preview). */
export const PORTAL_DEFAULT_OG_RELATIVE_PATH = "/og/portal-default.webp";

/** Компонент-эталон для дефолтного OG после capture. */
export const PORTAL_DEFAULT_OG_SOURCE_SLUG = "button";

const PREVIEWS_DIR = "public/related-previews";
const OG_DIR = "public/og";
const OG_FILENAME = "portal-default.webp";

function previewLightPath(projectRoot: string, slug: string): string {
  return path.join(projectRoot, PREVIEWS_DIR, `${slug}-light.webp`);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findFallbackPreviewSource(projectRoot: string): Promise<string | null> {
  const preferred = previewLightPath(projectRoot, PORTAL_DEFAULT_OG_SOURCE_SLUG);
  if (await fileExists(preferred)) return preferred;

  const previewsDir = path.join(projectRoot, PREVIEWS_DIR);
  try {
    const files = await readdir(previewsDir);
    const light = files.find((name) => name.endsWith("-light.webp"));
    if (!light) return null;
    return path.join(previewsDir, light);
  } catch {
    return null;
  }
}

/** Копирует {button|первый}-light.webp → public/og/portal-default.webp для OG главной и каталога. */
export async function syncPortalDefaultOgImage(projectRoot: string): Promise<boolean> {
  const source = await findFallbackPreviewSource(projectRoot);
  if (!source) {
    console.warn("No related-previews/*-light.webp — skip default OG image.");
    return false;
  }

  const outDir = path.join(projectRoot, OG_DIR);
  const outPath = path.join(outDir, OG_FILENAME);
  await mkdir(outDir, { recursive: true });
  await copyFile(source, outPath);
  console.log(
    `Default OG: ${path.relative(projectRoot, outPath)} ← ${path.relative(projectRoot, source)}`,
  );
  return true;
}
