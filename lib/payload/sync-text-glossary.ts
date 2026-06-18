import type { Payload } from "payload";

import { glossarySeedTermsWithMeta } from "@/lib/portal/glossary-seed-data";
import { applyGlossaryTermLetter } from "@/lib/payload/glossary-term-letter";

export const TEXT_GLOSSARY_PAGE_SEED = {
  title: "Глоссарий",
  intro:
    "Слова, которые нужно использовать в общении с пользователями — в интерфейсе, в новостях и в разговоре с клиентами.",
  principlesHeading: "Как мы выбираем слова",
  principles: [
    {
      text: "Слова из общей лексики приоритетнее технических терминов. Писать на языке пользователя важнее, чем быть технически точными.",
    },
    {
      text: "Мы используем профессиональный жаргон наших пользователей. Если ваш пользователь бухгалтер, то можно и нужно использовать слово «Платежка».",
    },
    {
      text: "Слова, которые давно стали частью языка, приоритетнее англицизмов. Мы пишем «Вход», а не «Аутентификация». Исключение: если русский вариант слишком длинный или непривычно звучит, можно использовать заимствованное слово. Например, «Скриншот» лучше, чем «Снимок экрана».",
    },
  ],
  principlesFooter:
    "Из двух равнозначных слов и в спорных случаях транслитерации мы выбираем более распространённый вариант. Распространённость проверяем по словарям и, если это не помогло, по цитируемости в интернете. Например, мы пишем «Лендинг», а не «Лэндинг», потому что так пишут на порядок чаще.",
  termsSectionHeading: "Словарь",
  shareTitle: "Глоссарий",
  shareDescription:
    "Слова для интерфейса и коммуникации с пользователями: что использовать и чего избегать.",
};

/** Заполняет global text-glossary и коллекцию glossary-terms (полная перезапись терминов). */
export async function syncTextGlossary(payload: Payload): Promise<{ termsCreated: number }> {
  await payload.updateGlobal({
    slug: "text-glossary",
    data: TEXT_GLOSSARY_PAGE_SEED,
    overrideAccess: true,
  });

  const { docs: existing } = await payload.find({
    collection: "glossary-terms",
    limit: 500,
    depth: 0,
    overrideAccess: true,
  });

  for (const doc of existing) {
    await payload.delete({
      collection: "glossary-terms",
      id: doc.id,
      overrideAccess: true,
    });
  }

  const seedTerms = glossarySeedTermsWithMeta();
  for (const term of seedTerms) {
    await payload.create({
      collection: "glossary-terms",
      data: applyGlossaryTermLetter(term),
      overrideAccess: true,
    });
  }

  return { termsCreated: seedTerms.length };
}
