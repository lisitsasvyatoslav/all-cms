const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CYRILLIC = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

export function glossaryLetterFromPreferred(preferred: string): string {
  const trimmed = preferred.trim();
  if (!trimmed) return "#";
  const first = trimmed.charAt(0).toLocaleUpperCase("ru");
  if (LATIN.includes(first) || CYRILLIC.includes(first)) return first;
  return "#";
}

export function glossaryLetterSortRank(letter: string): number {
  const latinIdx = LATIN.indexOf(letter);
  if (latinIdx >= 0) return latinIdx;
  const cyrillicIdx = CYRILLIC.indexOf(letter);
  if (cyrillicIdx >= 0) return 100 + cyrillicIdx;
  return 999;
}

export function compareGlossaryLetters(a: string, b: string): number {
  return glossaryLetterSortRank(a) - glossaryLetterSortRank(b);
}

export function parseGlossaryAvoidVariants(avoid?: string | null): string[] {
  if (!avoid?.trim()) return [];
  return avoid
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
