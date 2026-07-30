/** Нормализация текста для поиска без учёта регистра (кириллица + латиница). */
export function normalizePortalSearchText(text: string): string {
  return text.trim().toLocaleLowerCase("ru");
}
