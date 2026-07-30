import { z } from "zod";

import { COMPOSITION_VERSION, type CompositionNode } from "./types";

const compositionNodeSchema: z.ZodType<CompositionNode> = z.lazy(() =>
  z.object({
    component: z
      .string()
      .min(1, "component обязателен")
      .describe("Radix Themes id: Button, Card, TextField.Root, Tabs.Trigger, …"),
    props: z.record(z.unknown()).optional(),
    text: z.string().optional(),
    children: z.array(compositionNodeSchema).optional(),
  }),
);

export const compositionDocumentSchema = z.object({
  version: z.literal(COMPOSITION_VERSION),
  root: compositionNodeSchema,
});

export type ParsedCompositionDocument = z.infer<typeof compositionDocumentSchema>;

export function parseCompositionDocument(input: unknown):
  | { success: true; data: ParsedCompositionDocument }
  | { success: false; error: string } {
  const result = compositionDocumentSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const message = result.error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");

  return { success: false, error: message };
}
