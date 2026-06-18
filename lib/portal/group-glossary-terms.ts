import {
  compareGlossaryLetters,
  glossaryLetterFromPreferred,
} from "@/lib/portal/glossary-letter";

export type GlossaryTermRow = {
  id: string | number;
  preferred: string;
  avoid?: string | null;
};

export type GlossaryLetterGroup = {
  letter: string;
  terms: GlossaryTermRow[];
};

function glossarySortKey(term: GlossaryTermRow): string {
  return term.preferred.trim().toLocaleLowerCase("ru");
}

/** Группирует термины: сначала латиница, затем кириллица; внутри буквы — по алфавиту (preferred). */
export function groupGlossaryTermsByLetter(terms: GlossaryTermRow[]): GlossaryLetterGroup[] {
  const sorted = [...terms].sort((a, b) => {
    const letterDiff = compareGlossaryLetters(
      glossaryLetterFromPreferred(a.preferred),
      glossaryLetterFromPreferred(b.preferred),
    );
    if (letterDiff !== 0) return letterDiff;

    return glossarySortKey(a).localeCompare(glossarySortKey(b), "ru");
  });

  const groups = new Map<string, GlossaryTermRow[]>();
  for (const term of sorted) {
    const letter = glossaryLetterFromPreferred(term.preferred);
    const bucket = groups.get(letter);
    if (bucket) bucket.push(term);
    else groups.set(letter, [term]);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => compareGlossaryLetters(a, b))
    .map(([letter, groupTerms]) => ({ letter, terms: groupTerms }));
}
