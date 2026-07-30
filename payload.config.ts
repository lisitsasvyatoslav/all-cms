import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { ru } from "@payloadcms/translations/languages/ru";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { BrandPagesCollection } from "@/collections/brandPages";
import { BrandOverviewGlobal } from "@/collections/brandOverviewGlobal";
import { ColorsCollection } from "@/collections/colors";
import { ComponentsCollection } from "@/collections/components";
import { DesignChecklistItemsCollection } from "@/collections/designChecklistItems";
import { DsPagesCollection } from "@/collections/dsPages";
import { DsOverviewGlobal } from "@/collections/dsOverviewGlobal";
import { FieldShowcaseCollection } from "@/collections/fieldShowcase";
import { GlossaryTermsCollection } from "@/collections/glossaryTerms";
import { IconsCollection } from "@/collections/icons";
import { MediaCollection } from "@/collections/media";
import { NotesCollection } from "@/collections/notes";
import { PortalSeoGlobal } from "@/collections/portalSeoGlobal";
import { PortalSourcesGlobal } from "@/collections/portalSourcesGlobal";
import { TextGlossaryGlobal } from "@/collections/textGlossaryGlobal";
import { UsersCollection } from "@/collections/users";
import { payloadPlugins } from "@/lib/payload/plugins";
import { resolvePayloadSqliteClientConfig } from "@/lib/payload/resolve-database-uri";
import { migrations } from "@/migrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: UsersCollection.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: "ru",
    supportedLanguages: {
      ru,
      en,
    },
  },
  folders: {
    browseByFolder: true,
  },
  collections: [
    UsersCollection,
    MediaCollection,
    ComponentsCollection,
    DesignChecklistItemsCollection,
    GlossaryTermsCollection,
    BrandPagesCollection,
    DsPagesCollection,
    ColorsCollection,
    IconsCollection,
    NotesCollection,
    FieldShowcaseCollection,
  ],
  globals: [
    PortalSourcesGlobal,
    PortalSeoGlobal,
    TextGlossaryGlobal,
    BrandOverviewGlobal,
    DsOverviewGlobal,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: resolvePayloadSqliteClientConfig(),
    // Dev push дублирует индексы после частичного push — только миграции.
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
    prodMigrations: migrations,
  }),
  sharp,
  plugins: payloadPlugins,
});
