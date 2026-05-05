import { defineConfig } from "astro/config";

/** Мини-сайт Astro Content Layer — те же JSON, что читает Next из ../content */
export default defineConfig({
  site: "http://localhost:4321",
  server: { port: 4321 },
});
