import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { planCompositionFromBrief } from "./design-brief";
import { parseFigmaUrl } from "./figma-url";
import { getFigmaComposeWorkflow } from "./figma-workflow";
import { COMPOSITION_VERSION, validateComposition } from "./index";

describe("parseFigmaUrl", () => {
  it("parses design URL with node-id", () => {
    const result = parseFigmaUrl(
      "https://www.figma.com/design/AbCdEf123/My-File?node-id=12-34",
    );
    assert.ok(!("error" in result));
    if ("error" in result) return;
    assert.equal(result.fileKey, "AbCdEf123");
    assert.equal(result.nodeId, "12:34");
  });
});

describe("planCompositionFromBrief", () => {
  it("maps login card brief to valid Radix composition", () => {
    const planned = planCompositionFromBrief({
      version: "1",
      root: {
        kind: "card",
        props: { title: "Login" },
        children: [
          { kind: "input", props: { placeholder: "Email" } },
          { kind: "button", props: { variant: "primary" }, text: "Go" },
        ],
      },
    });

    assert.equal(planned.success, true);
    if (!planned.success) return;

    assert.equal(planned.composition.version, COMPOSITION_VERSION);
    assert.equal(planned.composition.root.component, "Card");
    assert.ok(
      planned.composition.root.children?.some((child) => child.component === "Heading"),
    );
    assert.ok(
      planned.composition.root.children?.some((child) => child.component === "TextField.Root"),
    );
    assert.ok(
      planned.composition.root.children?.some(
        (child) => child.component === "Button" && child.props?.variant === "solid",
      ),
    );

    const validation = validateComposition(planned.composition);
    assert.equal(validation.valid, true);
  });

  it("maps select brief with options to Select compound tree", () => {
    const planned = planCompositionFromBrief({
      version: "1",
      root: {
        kind: "select",
        props: {
          placeholder: "Choose",
          options: [
            { value: "a", label: "A" },
            { value: "b", label: "B" },
          ],
        },
      },
    });

    assert.equal(planned.success, true);
    if (!planned.success) return;
    assert.equal(planned.composition.root.component, "Select.Root");
    assert.ok(
      planned.composition.root.children?.some((child) => child.component === "Select.Trigger"),
    );

    const validation = validateComposition(planned.composition);
    assert.equal(validation.valid, true);
  });

  it("maps tabs brief", () => {
    const planned = planCompositionFromBrief({
      version: "1",
      root: {
        kind: "tabs",
        props: { defaultValue: "a" },
        children: [
          {
            kind: "tabList",
            children: [{ kind: "tab", props: { value: "a" }, text: "A" }],
          },
          { kind: "tabPanel", props: { value: "a" }, text: "Panel A" },
        ],
      },
    });

    assert.equal(planned.success, true);
    if (!planned.success) return;
    assert.equal(planned.composition.root.component, "Tabs.Root");
  });
});

describe("getFigmaComposeWorkflow", () => {
  it("includes parsed figma URL for agent", () => {
    const guide = getFigmaComposeWorkflow(
      "https://www.figma.com/design/xyz/Frame?node-id=1-2",
    );
    assert.ok(guide.figmaUrlParsing.figmaMcpCallExample);
    assert.equal(guide.figmaUrlParsing.figmaMcpCallExample?.fileKey, "xyz");
    assert.match(guide.title, /Radix Themes/i);
  });
});
