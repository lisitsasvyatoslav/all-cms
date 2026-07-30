import assert from "node:assert/strict";
import test from "node:test";

import { normalizePortalSearchWhere } from "@/lib/payload/search/normalize-search-where";

test("normalizePortalSearchWhere lowercases like values in or clauses", () => {
  const args = {
    collection: { config: { hooks: {} } },
    req: { context: {} },
    where: {
      or: [
        { searchText: { like: "Установка" } },
        { title: { like: "Button" } },
      ],
    },
  };

  const result = normalizePortalSearchWhere({
    args,
    collection: args.collection,
    context: {},
    operation: "read",
    req: args.req,
  });

  assert.deepEqual(result.where, {
    or: [
      { searchText: { like: "установка" } },
      { title: { like: "button" } },
    ],
  });
});

test("normalizePortalSearchWhere leaves non-read operations unchanged", () => {
  const args = {
    collection: { config: { hooks: {} } },
    req: { context: {} },
    where: { searchText: { like: "Установка" } },
  };

  const result = normalizePortalSearchWhere({
    args,
    collection: args.collection,
    context: {},
    operation: "update",
    req: args.req,
  });

  assert.equal(result, args);
});
