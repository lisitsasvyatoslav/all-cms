const viteEnv = (import.meta as { env?: Record<string, string | undefined> })
  .env;

function pickFirst(...values: Array<string | undefined>) {
  return values.find((value) => typeof value === "string" && value.length > 0);
}

export const apiVersion =
  pickFirst(
    viteEnv?.SANITY_STUDIO_API_VERSION,
    process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    process.env.SANITY_API_VERSION,
  ) || "2025-01-01";

export const dataset =
  pickFirst(
    viteEnv?.SANITY_STUDIO_DATASET,
    process.env.NEXT_PUBLIC_SANITY_DATASET,
    process.env.SANITY_DATASET,
  ) || "production";

export const projectId = assertValue(
  pickFirst(
    viteEnv?.SANITY_STUDIO_PROJECT_ID,
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    process.env.SANITY_PROJECT_ID,
  ),
  "Missing environment variable: SANITY_STUDIO_PROJECT_ID (or NEXT_PUBLIC_SANITY_PROJECT_ID / SANITY_PROJECT_ID)",
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
