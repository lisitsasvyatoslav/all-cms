import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPortalSearchIndexText,
  PORTAL_SEARCH_MATCH_SCOPE,
} from "@/lib/payload/search/search-config";

test("buildPortalSearchIndexText uses title only by default", () => {
  assert.equal(PORTAL_SEARCH_MATCH_SCOPE, "title");
  assert.equal(
    buildPortalSearchIndexText("Установка и запуск", "установка зависимостей в контенте"),
    "установка и запуск",
  );
});

test("buildPortalSearchIndexText ignores excerpt in title scope", () => {
  const result = buildPortalSearchIndexText("Быстрый старт", "установка зависимостей");
  assert.equal(result.includes("установка"), false);
});
