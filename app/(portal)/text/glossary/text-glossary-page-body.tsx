import { TextGlossaryPageView } from "@/components/portal/glossary/text-glossary-page";
import { loadTextGlossaryContent } from "@/lib/portal/glossary/load";

export async function TextGlossaryPageBody() {
  const { page, terms } = await loadTextGlossaryContent();
  return <TextGlossaryPageView page={page} terms={terms} />;
}
