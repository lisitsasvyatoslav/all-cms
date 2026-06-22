/**
 * Скриншоты RelatedPreview из Storybook → public/related-previews/{slug}-{theme}.webp
 *
 * Запуск: npm run capture:related-previews
 * Флаги:
 *   --static       build-storybook + static server (если static SB у вас работает)
 *   --skip-build   с --static: не пересобирать storybook-static
 *   --dev          явно использовать storybook dev (режим по умолчанию)
 *   --slug=button  один компонент
 *   --port=6020    порт Storybook
 *   --no-payload   не синхронизировать в Payload Media
 *
 * После capture: public/related-previews → Payload Media → og:image на страницах компонентов.
 * OG главной/каталога: public/og/portal-site.webp (npm run generate:portal-site-og).
 */
import "./load-env.js";
import { execSync, spawn, type ChildProcess } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, type Page } from "playwright";
import { getPayload } from "payload";
import sharp from "sharp";

import config from "../payload.config.js";
import { syncRelatedPreviewsForSlugs } from "../lib/payload/sync-related-preview-media.js";
import {
  RELATED_PREVIEW_CAPTURE,
  RELATED_PREVIEW_OUTPUT_DIR,
  relatedPreviewIframeCaptureUrl,
  relatedPreviewOutputFilename,
  relatedPreviewScaleScript,
  relatedPreviewSlugsFromCatalog,
  type RelatedPreviewTheme,
} from "../lib/storybook/related-preview-capture.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");
const storybookStaticDir = path.join(projectRoot, "storybook-static");
const outputDir = path.join(projectRoot, RELATED_PREVIEW_OUTPUT_DIR);

type RunMode = "dev" | "static";

function parseArgs() {
  const args = process.argv.slice(2);
  let skipBuild = false;
  let port = 6020;
  const slugFilters: string[] = [];
  let mode: RunMode = "dev";
  let syncPayload = true;

  for (const arg of args) {
    if (arg === "--skip-build") skipBuild = true;
    else if (arg === "--static") mode = "static";
    else if (arg === "--dev") mode = "dev";
    else if (arg === "--no-payload") syncPayload = false;
    else if (arg.startsWith("--port=")) port = Number(arg.slice("--port=".length));
    else if (arg.startsWith("--slug=")) slugFilters.push(arg.slice("--slug=".length));
  }

  return { skipBuild, port, slugFilters, mode, syncPayload };
}

function freePort(port: number): void {
  if (process.platform !== "win32") return;

  try {
    const out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const pids = new Set(
      out
        .split("\n")
        .map((line) => line.trim().split(/\s+/).at(-1))
        .filter((pid): pid is string => Boolean(pid && /^\d+$/.test(pid))),
    );

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* port already free */
  }
}

function runCommand(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function waitForStorybook(baseUrl: string, timeoutMs = 120_000): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(`${baseUrl}/iframe.html`, { method: "GET" });
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Storybook did not start at ${baseUrl}`);
}

async function stopChild(child: ChildProcess): Promise<void> {
  if (child.killed) return;
  child.kill("SIGTERM");
  await new Promise<void>((resolve) => {
    child.on("exit", () => resolve());
    setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {
        /* ignore */
      }
      resolve();
    }, 3_000);
  });
}

async function startStorybookDev(port: number): Promise<() => Promise<void>> {
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn("npx", ["storybook", "dev", "-p", String(port), "--no-open"], {
    cwd: projectRoot,
    stdio: "pipe",
    shell: process.platform === "win32",
    env: { ...process.env, CI: "true" },
  });

  child.stdout?.on("data", (chunk: Buffer) => {
    const line = chunk.toString();
    if (line.includes("Local:") || line.includes("error")) process.stdout.write(line);
  });
  child.stderr?.on("data", (chunk: Buffer) => process.stderr.write(chunk));

  await waitForStorybook(baseUrl);
  return () => stopChild(child);
}

async function startStaticServer(port: number): Promise<() => Promise<void>> {
  const child = spawn(
    "npx",
    ["serve", storybookStaticDir, "-l", String(port), "--no-clipboard"],
    {
      cwd: projectRoot,
      stdio: "pipe",
      shell: process.platform === "win32",
    },
  );

  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForStorybook(baseUrl);
  return () => stopChild(child);
}

async function waitForStoryReady(page: Page): Promise<void> {
  await page.waitForSelector("#storybook-root:not([hidden])", { timeout: 90_000 });
  await page.waitForSelector(".portal-related-preview-capture, .portal-embed-shell", {
    timeout: 90_000,
  });
  await page.waitForTimeout(RELATED_PREVIEW_CAPTURE.settleMs);
}

async function captureTheme(
  page: Page,
  baseUrl: string,
  slug: string,
  theme: RelatedPreviewTheme,
  outPath: string,
): Promise<void> {
  const url = relatedPreviewIframeCaptureUrl(baseUrl, slug, theme);
  await page.goto(url, { waitUntil: "load", timeout: 60_000 });
  await waitForStoryReady(page);

  await page.evaluate(relatedPreviewScaleScript, {
    viewportWidth: RELATED_PREVIEW_CAPTURE.viewport.width,
    viewportHeight: RELATED_PREVIEW_CAPTURE.viewport.height,
    fillRatio: RELATED_PREVIEW_CAPTURE.frameFillRatio,
    minScale: RELATED_PREVIEW_CAPTURE.minScale,
    maxScale: RELATED_PREVIEW_CAPTURE.maxScale,
  });
  await page.waitForTimeout(150);

  const png = await page.screenshot({ type: "png", fullPage: false });

  const background =
    theme === "light"
      ? { r: 255, g: 255, b: 255, alpha: 1 as const }
      : { r: 10, g: 10, b: 10, alpha: 1 as const };

  await sharp(png)
    .resize(RELATED_PREVIEW_CAPTURE.outputWidth, RELATED_PREVIEW_CAPTURE.outputHeight, {
      fit: "contain",
      position: "centre",
      background,
    })
    .webp({ quality: RELATED_PREVIEW_CAPTURE.webpQuality })
    .toFile(outPath);
}

async function main() {
  const { skipBuild, port, slugFilters, mode, syncPayload } = parseArgs();
  const slugFilterSet = slugFilters.length ? new Set(slugFilters) : null;
  const slugs = relatedPreviewSlugsFromCatalog().filter((slug) => !slugFilterSet || slugFilterSet.has(slug));

  if (!slugs.length) {
    console.error(
      slugFilters.length ? `No RelatedPreview slug: ${slugFilters.join(", ")}` : "No RelatedPreview slugs in catalog",
    );
    process.exit(1);
  }

  if (mode === "static" && !skipBuild) {
    console.log("Building Storybook (static)…");
    await runCommand("npm", ["run", "build-storybook"], projectRoot);
  }

  await mkdir(outputDir, { recursive: true });

  freePort(port);

  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Starting Storybook (${mode}) at ${baseUrl}…`);
  const stopServer =
    mode === "static" ? await startStaticServer(port) : await startStorybookDev(port);

  await new Promise((r) => setTimeout(r, 2_000));

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: RELATED_PREVIEW_CAPTURE.viewport,
    deviceScaleFactor: RELATED_PREVIEW_CAPTURE.deviceScaleFactor,
  });
  const page = await context.newPage();

  try {
    for (const slug of slugs) {
      for (const theme of ["light", "dark"] as const) {
        const filename = relatedPreviewOutputFilename(slug, theme);
        const outPath = path.join(outputDir, filename);
        console.log(`Capturing ${slug} (${theme})…`);
        await captureTheme(page, baseUrl, slug, theme, outPath);
        console.log(`  → ${path.relative(projectRoot, outPath)}`);
      }
    }
  } finally {
    await context.close();
    await browser.close();
    await stopServer();
  }

  console.log(`Done. ${slugs.length * 2} files in ${RELATED_PREVIEW_OUTPUT_DIR}/`);

  if (syncPayload) {
    if (!process.env.PAYLOAD_SECRET?.trim()) {
      console.warn("PAYLOAD_SECRET not set — skip Payload sync. Use npm run upload:related-previews later.");
      return;
    }

    console.log("Syncing previews to Payload Media…");
    const payload = await getPayload({ config });
    await syncRelatedPreviewsForSlugs(payload, projectRoot, slugs);
    console.log("Payload sync complete.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
