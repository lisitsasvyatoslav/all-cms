import { getPayload } from "payload";

import config from "@payload-config";
import type { GlossaryTerm, TextGlossary } from "@/payload-types";

import { glossaryLetterFromPreferred } from "@/lib/portal/glossary/letter";
import type { GlossaryTermRow } from "@/lib/portal/glossary/group-terms";

export type NormalizedTextGlossaryPage = {
  title: string;
  intro: string;
  principlesHeading: string;
  principles: string[];
  principlesFooter: string;
  termsSectionHeading: string;
  shareTitle: string;
  shareDescription: string;
};

const TEXT_GLOSSARY_FALLBACKS: NormalizedTextGlossaryPage = {
  title: "Глоссарий",
  intro:
    "Слова, которые нужно использовать в общении с пользователями — в интерфейсе, в новостях и в разговоре с клиентами.",
  principlesHeading: "Как мы выбираем слова",
  principles: [
    "Слова из общей лексики приоритетнее технических терминов. Писать на языке пользователя важнее, чем быть технически точными.",
    "Мы используем профессиональный жаргон наших пользователей. Если ваш пользователь бухгалтер, то можно и нужно использовать слово «Платежка».",
    "Слова, которые давно стали частью языка, приоритетнее англицизмов. Мы пишем «Вход», а не «Аутентификация». Исключение: если русский вариант слишком длинный или непривычно звучит, можно использовать заимствованное слово. Например, «Скриншот» лучше, чем «Снимок экрана».",
  ],
  principlesFooter:
    "Из двух равнозначных слов и в спорных случаях транслитерации мы выбираем более распространённый вариант. Распространённость проверяем по словарям и, если это не помогло, по цитируемости в интернете. Например, мы пишем «Лендинг», а не «Лэндинг», потому что так пишут на порядок чаще.",
  termsSectionHeading: "Словарь",
  shareTitle: "Глоссарий",
  shareDescription:
    "Слова для интерфейса и коммуникации с пользователями: что использовать и чего избегать.",
};

function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed || null;
}

function normalizePage(doc: TextGlossary | null | undefined): NormalizedTextGlossaryPage {
  const principles =
    doc?.principles
      ?.map((item) => trimOrNull(item.text))
      .filter((text): text is string => Boolean(text)) ?? TEXT_GLOSSARY_FALLBACKS.principles;

  return {
    title: trimOrNull(doc?.title) ?? TEXT_GLOSSARY_FALLBACKS.title,
    intro: trimOrNull(doc?.intro) ?? TEXT_GLOSSARY_FALLBACKS.intro,
    principlesHeading:
      trimOrNull(doc?.principlesHeading) ?? TEXT_GLOSSARY_FALLBACKS.principlesHeading,
    principles: principles.length ? principles : TEXT_GLOSSARY_FALLBACKS.principles,
    principlesFooter:
      trimOrNull(doc?.principlesFooter) ?? TEXT_GLOSSARY_FALLBACKS.principlesFooter,
    termsSectionHeading:
      trimOrNull(doc?.termsSectionHeading) ?? TEXT_GLOSSARY_FALLBACKS.termsSectionHeading,
    shareTitle: trimOrNull(doc?.shareTitle) ?? TEXT_GLOSSARY_FALLBACKS.shareTitle,
    shareDescription:
      trimOrNull(doc?.shareDescription) ?? TEXT_GLOSSARY_FALLBACKS.shareDescription,
  };
}

function normalizeTerm(doc: GlossaryTerm): GlossaryTermRow {
  return {
    id: doc.id,
    preferred: doc.preferred,
    avoid: doc.avoid,
  };
}

export async function loadTextGlossaryPage(): Promise<NormalizedTextGlossaryPage> {
  try {
    const payload = await getPayload({ config });
    const doc = await payload.findGlobal({
      slug: "text-glossary",
      depth: 0,
      overrideAccess: true,
    });
    return normalizePage(doc);
  } catch {
    return TEXT_GLOSSARY_FALLBACKS;
  }
}

export async function loadGlossaryTerms(): Promise<GlossaryTermRow[]> {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "glossary-terms",
      depth: 0,
      limit: 500,
      sort: "preferred",
      overrideAccess: true,
    });
    return docs.map(normalizeTerm);
  } catch {
    return [];
  }
}

export async function loadTextGlossaryContent(): Promise<{
  page: NormalizedTextGlossaryPage;
  terms: GlossaryTermRow[];
}> {
  const [page, terms] = await Promise.all([loadTextGlossaryPage(), loadGlossaryTerms()]);
  return { page, terms };
}

export { glossaryLetterFromPreferred };
