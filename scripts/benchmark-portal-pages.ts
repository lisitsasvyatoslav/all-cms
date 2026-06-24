/**
 * Замер времени SSR-ответа портала (TTFB + полная загрузка HTML).
 * Запуск: npx tsx scripts/benchmark-portal-pages.ts
 */
const BASE = process.env.BENCHMARK_BASE_URL ?? "http://127.0.0.1:3000";

const ROUTES = [
  { label: "DS overview", path: "/ds" },
  { label: "Components catalog", path: "/ds/components/web" },
  { label: "Component page (input)", path: "/ds/components/web/input" },
  { label: "Brand", path: "/brand" },
  { label: "Text", path: "/text" },
] as const;

async function fetchTiming(url: string): Promise<{ ms: number; status: number; bytes: number }> {
  const start = performance.now();
  const res = await fetch(url, {
    headers: { Accept: "text/html" },
    cache: "no-store",
  });
  const body = await res.arrayBuffer();
  const ms = performance.now() - start;
  return { ms, status: res.status, bytes: body.byteLength };
}

async function measureRoute(path: string, runs: number) {
  const url = `${BASE}${path}`;
  const samples: number[] = [];
  let status = 0;
  let bytes = 0;

  for (let i = 0; i < runs; i++) {
    const result = await fetchTiming(url);
    samples.push(result.ms);
    status = result.status;
    bytes = result.bytes;
  }

  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
  const min = Math.min(...samples);
  const max = Math.max(...samples);

  return { path, status, bytes, samples, avg, min, max };
}

async function measureNavigation(from: string, to: string) {
  await fetchTiming(`${BASE}${from}`);
  const second = await fetchTiming(`${BASE}${to}`);
  return second.ms;
}

function fmtMs(ms: number): string {
  return `${ms.toFixed(0)} ms`;
}

async function main() {
  console.log(`Benchmark base: ${BASE}\n`);

  // Прогрев соединения
  try {
    await fetch(`${BASE}/ds`, { cache: "no-store" });
  } catch (error) {
    console.error("Server unreachable:", error);
    process.exit(1);
  }

  console.log("=== Повторные запросы (кэш layout + unstable_cache, 3 прогона) ===\n");
  console.log("Route".padEnd(28), "Status", "Size".padStart(8), "Min".padStart(8), "Avg".padStart(8), "Max".padStart(8));
  console.log("-".repeat(72));

  for (const route of ROUTES) {
    const r = await measureRoute(route.path, 3);
    console.log(
      route.label.padEnd(28),
      String(r.status).padStart(6),
      `${(r.bytes / 1024).toFixed(0)} KB`.padStart(8),
      fmtMs(r.min).padStart(8),
      fmtMs(r.avg).padStart(8),
      fmtMs(r.max).padStart(8),
    );
  }

  console.log("\n=== Имитация навигации (сначала /ds, затем целевая страница) ===\n");

  const navTargets = [
    { label: "DS → catalog", to: "/ds/components/web" },
    { label: "DS → component", to: "/ds/components/web/input" },
    { label: "DS → brand", to: "/brand" },
    { label: "DS → text", to: "/text" },
  ];

  for (const nav of navTargets) {
    const samples: number[] = [];
    for (let i = 0; i < 3; i++) {
      samples.push(await measureNavigation("/ds", nav.to));
    }
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const min = Math.min(...samples);
    console.log(`${nav.label.padEnd(22)} min ${fmtMs(min)}  avg ${fmtMs(avg)}  (${nav.to})`);
  }

  console.log("\n=== Холодный старт страницы (1-й запрос после паузы, cache: no-store) ===\n");
  await new Promise((r) => setTimeout(r, 500));
  const cold = await fetchTiming(`${BASE}/ds/components/web/input`);
  console.log(`Component page (input): ${fmtMs(cold.ms)} (status ${cold.status})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
