import type { Color, Component, Icon, Media } from "@/payload-types";

import { lexicalToMarkdown } from "./lexical-to-markdown";
import {
  mdBulletList,
  mdCheckbox,
  mdFence,
  mdGfmTable,
  mdHeading,
  mdJoin,
  mdLink,
  mdOrderedList,
  mdParagraph,
} from "./md-utils";

export type DocumentationBlock =
  NonNullable<Component["documentation"]>[number];

function mediaAbsoluteUrl(
  image: number | Media | null | undefined,
  baseUrl: string,
): string | null {
  if (!image || typeof image !== "object" || !image.url) return null;
  const url = image.url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = baseUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

function safeJsonStringify(payload: unknown): string {
  try {
    return JSON.stringify(payload ?? null, null, 2);
  } catch {
    return String(payload);
  }
}

const RADIO_LABELS: Record<string, string> = {
  fast: "Быстро",
  normal: "Нормально",
  precise: "Точно",
};

function blockToMarkdown(
  block: DocumentationBlock,
  baseUrl: string,
): string | null {
  switch (block.blockType) {
    case "section":
      return mdJoin([
        mdHeading(2, block.heading),
        block.body ? mdParagraph(block.body) : null,
      ]);

    case "doDont": {
      const dos = block.dos?.map((r) => r.text).filter(Boolean) ?? [];
      const donts = block.donts?.map((r) => r.text).filter(Boolean) ?? [];
      if (!dos.length && !donts.length) return null;
      return mdJoin([
        dos.length ? mdJoin([mdHeading(3, "Do"), mdBulletList(dos)]) : null,
        donts.length
          ? mdJoin([mdHeading(3, "Don't"), mdBulletList(donts)])
          : null,
      ]);
    }

    case "callout":
      return `> **${block.tone}:** ${block.text.trim()}`;

    case "codeExample":
      return mdJoin([
        block.title ? mdParagraph(block.title) : null,
        mdFence(block.code ?? "", "tsx"),
      ]);

    case "codeMonaco":
      return mdJoin([
        block.title ? mdParagraph(block.title) : null,
        mdFence(block.snippet ?? "", "tsx"),
      ]);

    case "richTextSection":
      return mdJoin([
        block.title ? mdHeading(3, block.title) : null,
        lexicalToMarkdown(block.body) || "> [rich text]",
      ]);

    case "propsTable": {
      const rows = block.rows?.filter((r) => r?.name) ?? [];
      if (!rows.length) return null;
      return mdJoin([
        block.title ? mdHeading(3, block.title) : null,
        mdGfmTable(
          ["Имя", "Тип", "По умолч.", "Описание"],
          rows.map((r) => [
            r.name,
            r.type,
            r.defaultValue?.trim() ? r.defaultValue : "—",
            r.description ?? "—",
          ]),
        ),
      ]);
    }

    case "resourceLinks": {
      const links =
        block.links?.filter((l) => l?.label && l?.url) ?? [];
      if (!links.length) return null;
      return mdJoin([
        mdHeading(3, "Ссылки"),
        mdBulletList(links.map((l) => mdLink(l.label, l.url))),
      ]);
    }

    case "mediaFigure": {
      const src = mediaAbsoluteUrl(block.image, baseUrl);
      if (!src) return null;
      const alt = block.caption || "image";
      return mdJoin([
        `![${alt}](${src})`,
        block.caption ? `*${block.caption}*` : null,
      ]);
    }

    case "relColor": {
      const c = block.color;
      if (!c || typeof c !== "object") return null;
      const color = c as Color;
      const token = color.tokenKey ? ` · token: \`${color.tokenKey}\`` : "";
      return `**${color.name}**${token} · \`${color.hex}\``;
    }

    case "relIcon": {
      const ic = block.icon;
      if (!ic || typeof ic !== "object") return null;
      const icon = ic as Icon;
      const prev = mediaAbsoluteUrl(icon.preview, baseUrl);
      const lines = [
        `**${icon.name}**${icon.slug ? ` · \`${icon.slug}\`` : ""}`,
        prev ? `![${icon.name}](${prev})` : null,
      ];
      return mdJoin(lines);
    }

    case "geoPoint": {
      const loc = block.location;
      if (!loc || loc.length < 2) return null;
      const [lng, lat] = loc;
      const href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;
      return mdJoin([
        block.label ? `**${block.label}**` : null,
        `Координаты: \`${lng.toFixed(5)}, ${lat.toFixed(5)}\` (lng, lat)`,
        mdLink("Открыть на карте", href),
      ]);
    }

    case "calendarDate": {
      const at = block.at
        ? new Date(block.at).toISOString()
        : "Дата не задана";
      return mdJoin([
        block.title ? `**${block.title}**` : null,
        at,
      ]);
    }

    case "emailLine":
      if (!block.address) return null;
      return block.label
        ? `${block.label}: ${mdLink(block.address, `mailto:${block.address}`)}`
        : mdLink(block.address, `mailto:${block.address}`);

    case "numberStat":
      return block.label
        ? `**${block.label}:** ${block.value ?? "—"}`
        : String(block.value ?? "—");

    case "radioPick": {
      const mode = block.mode ?? "normal";
      const label = RADIO_LABELS[mode] ?? mode;
      return mdJoin([
        `**Режим:** ${label} (\`${mode}\`)`,
        block.hint ? mdParagraph(block.hint) : null,
      ]);
    }

    case "multiSelect": {
      const tags = block.tags?.filter(Boolean) ?? [];
      return mdJoin([
        tags.length ? mdJoin(["Теги:", mdBulletList(tags)]) : "Теги: —",
        block.note ? mdParagraph(block.note) : null,
      ]);
    }

    case "flagBox":
      return mdCheckbox(!!block.enabled, block.flagLabel ?? "Checkbox");

    case "jsonBlock":
      return mdJoin([
        block.title ? mdHeading(3, block.title) : null,
        mdFence(safeJsonStringify(block.payload), "json"),
      ]);

    case "groupStrip": {
      const b = block.bundle;
      if (!b) return null;
      return mdJoin([
        "**Group**",
        mdBulletList([
          `Название: ${b.gTitle ?? "—"}`,
          `Счётчик: ${b.gCount ?? "—"}`,
          `Активно: ${b.gOn ? "Да" : "Нет"}`,
        ]),
      ]);
    }

    case "nestedStack": {
      const items =
        block.items?.filter(
          (x): x is { blockType: "nestLine"; line: string } =>
            x?.blockType === "nestLine" && !!x.line,
        ) ?? [];
      return mdJoin([
        block.intro ? mdParagraph(block.intro) : null,
        items.length ? mdOrderedList(items.map((it) => it.line)) : null,
      ]);
    }

    case "namedTabsStrip":
      return mdJoin([
        mdHeading(3, "Кратко"),
        mdParagraph(block.tabSummary?.brief ?? "—"),
        mdHeading(3, "Подробно"),
        mdParagraph(block.tabDetail?.detail ?? "—"),
      ]);

    case "divider":
      return mdJoin([
        block.caption ? `*${block.caption}*` : null,
        "---",
      ]);

    case "quote":
      return mdJoin([
        `> ${block.body.trim()}`,
        block.attribution ? `— ${block.attribution}` : null,
      ]);

    case "storybookEmbed":
      return mdJoin([
        mdHeading(3, block.title ?? "Превью Storybook"),
        mdLink("Открыть в Storybook", block.storybookUrl ?? ""),
        "_Встроенный iframe на портале; в Markdown только ссылка._",
      ]);

    default:
      return `> ⚠️ Блок \`${(block as { blockType?: string }).blockType ?? "unknown"}\` не поддержан в Markdown-экспорте.`;
  }
}

export function documentationToMarkdown(
  blocks: Component["documentation"] | null | undefined,
  baseUrl: string,
): string {
  if (!blocks?.length) return "";
  return mdJoin(
    blocks.map((block) => blockToMarkdown(block, baseUrl)),
    "\n\n",
  );
}
