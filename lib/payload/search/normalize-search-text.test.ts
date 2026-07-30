import { normalizePortalSearchText } from "@/lib/payload/search/normalize-search-text";
import assert from "node:assert/strict";
import test from "node:test";

import { normalizePortalSearchQuery } from "@/lib/portal/search/load-search-results";

test("normalizePortalSearchText lowercases Cyrillic", () => {
  assert.equal(normalizePortalSearchText("  Установка  "), "установка");
});

test("normalizePortalSearchText lowercases Latin", () => {
  assert.equal(normalizePortalSearchText("Button"), "button");
});

test("normalizePortalSearchQuery delegates to normalizePortalSearchText", () => {
  assert.equal(normalizePortalSearchQuery("  Установка  "), "установка");
});
