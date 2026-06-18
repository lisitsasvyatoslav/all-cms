import { glossaryLetterFromPreferred } from "@/lib/portal/glossary-letter";

type GlossaryTermLike = {
  preferred?: string | null;
  letter?: string | null;
};

export function applyGlossaryTermLetter<T extends GlossaryTermLike>(data: T): T {
  const preferred = String(data.preferred ?? "").trim();
  if (!preferred) return data;

  return {
    ...data,
    letter: glossaryLetterFromPreferred(preferred),
  };
}
