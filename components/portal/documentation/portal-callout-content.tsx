import { Box } from "@radix-ui/themes";
import type { ReactNode } from "react";

/** Блочное содержимое внутри Callout.Root (без Callout.Text — он всегда `<p>`). */
export function PortalCalloutContent({ children }: { children: ReactNode }) {
  return <Box>{children}</Box>;
}
