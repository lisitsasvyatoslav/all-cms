import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { composeFromFigmaContext } from "./compose-from-figma-context";
import { getMcpAgentInstructions } from "./agent-instructions";

describe("composeFromFigmaContext", () => {
  it("returns TSX in one call from design brief", () => {
    const result = composeFromFigmaContext({
      figmaUrl:
        "https://www.figma.com/design/4Ja381GLnRb9WGULIpKhlV/Figma-to-Code?node-id=0-1",
      designBrief: {
        version: "1",
        root: {
          kind: "card",
          props: { title: "Login" },
          children: [
            { kind: "input", props: { placeholder: "Email" } },
            { kind: "button", props: { variant: "primary" }, text: "Go" },
          ],
        },
      },
    });

    assert.equal(result.success, true);
    if (!result.success) return;

    assert.match(result.tsx, /@radix-ui\/themes/);
    assert.match(result.tsx, /export function ComposedUI/);
    assert.equal(result.validation.valid, true);
    assert.ok(result.projectSetup.packageName === "@radix-ui/themes");
    assert.ok(result.figmaUrlParsing);
  });

  it("returns brief stage failure with retry hint", () => {
    const result = composeFromFigmaContext({
      designBrief: {
        version: "1",
        root: { kind: "unknownWidget" },
      },
    });

    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(result.stage, "brief");
    assert.match(result.retryHint, /composeUi|composeFromFigmaContext/);
  });
});

describe("getMcpAgentInstructions", () => {
  it("names composeUi as primary tool", () => {
    const info = getMcpAgentInstructions();
    assert.equal(info.primaryTool, "composeUi");
    assert.match(info.instructions, /finam-design-system/);
  });
});
