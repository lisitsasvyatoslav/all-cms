import { getCachedPayload } from "@/lib/payload/get-cached-payload";
import type { BrandPageSlug } from "@/lib/portal/brand/nav";
import {
  loadBrandNavItems,
  loadBrandOverview,
  loadBrandPageWithColor,
} from "@/lib/portal/brand/load-pages";
import { loadDsOverviewPage } from "@/lib/portal/components/load-ds-overview";
import { loadComponentsCatalogGroups } from "@/lib/portal/components/group-by-folder";
import {
  componentWebPagePath,
} from "@/lib/portal/components/routes";
import { loadTextGlossaryContent } from "@/lib/portal/glossary/load";
import { buildDocumentationBlocksShowcase } from "@/lib/portal/documentation/blocks-showcase";
import {
  PORTAL_TEXT_GLOSSARY_PATH,
} from "@/lib/portal/core/portal-base-path";

import { brandSectionsToMarkdown } from "./brand-section-to-markdown";
import { componentDocToMarkdown } from "./component-to-markdown";
import { documentationToMarkdown } from "./documentation-block-to-markdown";
import { loadComponentDocument } from "./load-component-document";
import {
  mdBulletList,
  mdGfmTable,
  mdHeading,
  mdJoin,
  mdLink,
  mdOrderedList,
  mdParagraph,
} from "./md-utils";
import type { PortalMarkdownRoute } from "./portal-path";
import { resolveSiteBaseUrl } from "./site-base-url";

export async function portalRouteToMarkdown(route: PortalMarkdownRoute): Promise<string | null> {
  switch (route.kind) {
    case "ds-home":
      return dsHomeToMarkdown();
    case "components-catalog":
      return componentsCatalogToMarkdown();
    case "component":
      return componentRouteToMarkdown(route.slug);
    case "color":
      return colorPageToMarkdown(route.id);
    case "showcase-documentation-blocks":
      return showcaseDocumentationBlocksToMarkdown();
    case "text-home":
      return textHomeToMarkdown();
    case "text-glossary":
      return textGlossaryToMarkdown();
    case "brand-overview":
      return brandOverviewToMarkdown();
    case "brand-page":
      return brandPageToMarkdown(route.slug as BrandPageSlug);
    default:
      return null;
  }
}

async function dsHomeToMarkdown(): Promise<string> {
  const page = await loadDsOverviewPage();
  const baseUrl = resolveSiteBaseUrl();

  return mdJoin([
    mdHeading(1, page.title),
    page.eyebrow ? mdParagraph(page.eyebrow) : null,
    mdParagraph(page.lead),
    page.installationHeading ? mdHeading(2, page.installationHeading) : null,
    page.installationIntro ? mdParagraph(page.installationIntro) : null,
    page.installCommands.length
      ? mdParagraph(`Установка: ${page.installCommands.join("; ")}`)
      : null,
    page.setupCode ? mdParagraph(`Настройка:\n\n${page.setupCode}`) : null,
    page.usageGuideMarkdown || null,
    page.capabilities.length
      ? mdJoin([mdHeading(2, page.capabilitiesHeading), mdBulletList(page.capabilities)])
      : null,
    page.stackItems.length
      ? mdJoin([
          mdHeading(2, page.stackHeading),
          mdParagraph(page.stackItems.join(" · ")),
        ])
      : null,
    page.navigationNote ? mdParagraph(page.navigationNote) : null,
    page.roadmap.length
      ? mdJoin([mdHeading(2, page.roadmapHeading), mdBulletList(page.roadmap)])
      : null,
    page.sourceItems.length
      ? mdJoin([
          mdHeading(2, page.sourcesHeading),
          page.sourcesIntro ? mdParagraph(page.sourcesIntro) : null,
          mdBulletList(
            page.sourceItems.map((item) => {
              const href = item.external
                ? item.href
                : `${baseUrl}${item.href.startsWith("/") ? item.href : `/${item.href}`}`;
              const label = item.description
                ? `**${item.label}** — ${item.description}`
                : item.label;
              return `${label}: ${mdLink(item.label, href)}`;
            }),
          ),
        ])
      : null,
  ]);
}

async function componentsCatalogToMarkdown(): Promise<string> {
  const groups = await loadComponentsCatalogGroups();
  const baseUrl = resolveSiteBaseUrl();

  return mdJoin([
    mdHeading(1, "Components"),
    mdParagraph("Каталог Web-компонентов дизайн-системы."),
    ...groups.map((group) =>
      mdJoin([
        mdHeading(2, group.name),
        mdBulletList(
          group.items.map((item) =>
            mdLink(item.name, `${baseUrl}${componentWebPagePath(item.slug)}`),
          ),
        ),
      ]),
    ),
  ]);
}

async function componentRouteToMarkdown(slug: string): Promise<string | null> {
  const doc = await loadComponentDocument(slug);
  if (!doc) return null;
  return componentDocToMarkdown(doc);
}

async function colorPageToMarkdown(id: number): Promise<string | null> {
  const payload = await getCachedPayload();
  let doc;
  try {
    doc = await payload.findByID({
      collection: "colors",
      id,
      depth: 2,
    });
  } catch {
    return null;
  }

  const baseUrl = resolveSiteBaseUrl();
  const docsMd = documentationToMarkdown(doc.documentation, baseUrl);

  return mdJoin([
    mdHeading(1, doc.name),
    mdParagraph([doc.hex, doc.tokenKey].filter(Boolean).join(" · ")),
    doc.caption ? mdParagraph(doc.caption) : null,
    docsMd ? mdJoin([mdHeading(2, "Документация"), docsMd]) : null,
  ]);
}

function showcaseDocumentationBlocksToMarkdown(): string {
  const blocks = buildDocumentationBlocksShowcase();
  const baseUrl = resolveSiteBaseUrl();

  return mdJoin([
    mdHeading(1, "Блоки документации"),
    mdParagraph("Демо всех blockType вкладки «Документация» коллекции components."),
    documentationToMarkdown(blocks, baseUrl),
  ]);
}

function textHomeToMarkdown(): string {
  return mdJoin([
    mdHeading(1, "Text"),
    mdParagraph(
      "Раздел редакторской политики: правила текстов, формулировок и терминов для продуктов и коммуникаций.",
    ),
    mdParagraph(mdLink("Глоссарий", `${resolveSiteBaseUrl()}${PORTAL_TEXT_GLOSSARY_PATH}`)),
  ]);
}

async function textGlossaryToMarkdown(): Promise<string> {
  const { page, terms } = await loadTextGlossaryContent();

  return mdJoin([
    mdHeading(1, page.title),
    mdParagraph(page.intro),
    page.principles.length
      ? mdJoin([
          mdHeading(2, page.principlesHeading),
          mdOrderedList(page.principles),
          page.principlesFooter ? mdParagraph(page.principlesFooter) : null,
        ])
      : null,
    terms.length
      ? mdJoin([
          mdHeading(2, page.termsSectionHeading),
          mdGfmTable(
            ["Используем", "Не используем"],
            terms.map((term) => [term.preferred, term.avoid ?? "—"]),
          ),
        ])
      : null,
  ]);
}

async function brandOverviewToMarkdown(): Promise<string> {
  const [overview, navItems] = await Promise.all([loadBrandOverview(), loadBrandNavItems()]);
  const baseUrl = resolveSiteBaseUrl();

  return mdJoin([
    mdHeading(1, overview.title),
    mdParagraph(overview.intro),
    navItems.length
      ? mdJoin([
          mdHeading(2, "Разделы"),
          mdBulletList(
            navItems.map((item) => {
              const href = `${baseUrl}${item.href}`;
              const line = item.description
                ? `**${item.label}** — ${item.description}`
                : item.label;
              return `${line} (${mdLink(item.label, href)})`;
            }),
          ),
        ])
      : null,
  ]);
}

async function brandPageToMarkdown(slug: BrandPageSlug): Promise<string | null> {
  const loaded = await loadBrandPageWithColor(slug);
  if (!loaded) return null;

  const { page } = loaded;
  const sectionsMd = brandSectionsToMarkdown(page.sections);

  return mdJoin([
    mdHeading(1, page.title),
    page.description ? mdParagraph(page.description) : null,
    page.intro ? mdParagraph(page.intro) : null,
    sectionsMd || null,
  ]);
}
