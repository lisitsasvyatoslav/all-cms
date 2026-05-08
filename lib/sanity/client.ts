import "server-only";

import { createClient } from "@sanity/client";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_DATASET;

export const sanityConfigured = Boolean(projectId && dataset);

export const sanityClient = createClient({
  apiVersion: process.env.SANITY_API_VERSION ?? "2025-01-01",
  dataset: dataset || "production",
  projectId: projectId || "missing-project-id",
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: process.env.NODE_ENV === "production",
});

