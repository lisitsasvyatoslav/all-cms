import assert from "node:assert/strict";
import test from "node:test";

import { storybookUrlToIframeSrc } from "@/lib/storybook/storybook-embed-url";

const BASE = "http://127.0.0.1:6006";

test("storybookUrlToIframeSrc adds transparent background and portal appearance", () => {
  const src = storybookUrlToIframeSrc(
    `${BASE}/?path=/story/design-system-button--default&args=variant:primary`,
    { portalEmbed: true, appearance: "dark" },
  );

  assert.ok(src?.includes("/iframe.html"));
  assert.ok(src?.includes("id=design-system-button--default"));
  assert.ok(src?.includes("args=variant"));
  assert.ok(src?.includes("backgrounds.value%3Atransparent"));
  assert.ok(src?.includes("portalAppearance%3Adark"));
});

test("storybookUrlToIframeSrc respects pinned portalAppearance in source URL", () => {
  const src = storybookUrlToIframeSrc(
    `${BASE}/?path=/story/design-system-button--default&globals=portalAppearance%3Alight`,
    { portalEmbed: true, appearance: "dark" },
  );

  assert.ok(src?.includes("portalAppearance%3Alight"));
  assert.ok(!src?.includes("portalAppearance%3Adark"));
});

test("storybookUrlToIframeSrc maps legacy dark background global", () => {
  const src = storybookUrlToIframeSrc(
    `${BASE}/?path=/story/design-system-button--default&globals=backgrounds.value%3A%230a0a0a`,
    { portalEmbed: true, appearance: "light" },
  );

  assert.ok(src?.includes("backgrounds.value%3Atransparent"));
  assert.ok(src?.includes("portalAppearance%3Adark"));
});
