import { Card, Code, Flex, Heading, Link, Text } from "@radix-ui/themes";
import NextLink from "next/link";
import { getPayload } from "payload";

import config from "@payload-config";
import { PortalSourcePill } from "@/components/portal/portal-source-pill";

/** CMS-backed page: do not bake content into the static shell at build time. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const payload = await getPayload({ config });

  const [
    sources,
    { docs: components },
    { docs: colors },
    { docs: icons },
  ] = await Promise.all([
    payload.findGlobal({ slug: "portal-sources" }),
    payload.find({
      collection: "components",
      depth: 0,
      limit: 50,
      sort: "name",
    }),
    payload.find({
      collection: "colors",
      depth: 0,
      limit: 50,
      sort: "sortOrder",
    }),
    payload.find({
      collection: "icons",
      depth: 1,
      limit: 50,
      sort: "name",
    }),
  ]);

  const figma = sources?.figmaLibraryUrl as string | undefined;
  const storybook = sources?.storybookUrl as string | undefined;
  const docsUrl = sources?.documentationUrl as string | undefined;
  const repo = sources?.repositoryUrl as string | undefined;

  return (
    <div className="bg-white dark:bg-black">
      <main className="mx-auto flex max-w-3xl flex-col gap-14 px-8 py-12 lg:py-16">
        <section
          id="overview"
          className="scroll-mt-24 flex flex-col gap-3 border-b border-zinc-100 pb-12 dark:border-zinc-900"
        >
          <Text size="2" color="gray" weight="medium">
            Тестовый портал · Payload + Next.js
          </Text>
          <Heading size="8" weight="medium">
            Дизайн-система
          </Heading>
          <Text as="p" size="4" color="gray" style={{ lineHeight: 1.6 }}>
            Данные ниже из коллекций CMS. Редактирование в{" "}
            <Link asChild weight="medium">
              <NextLink href="/admin">/admin</NextLink>
            </Link>
            . Навигация слева — якоря по разделам (как в доках Radix).
          </Text>
        </section>

        <section id="sources" className="scroll-mt-24 flex flex-col gap-4">
          <Heading as="h2" size="4">
            Источники
          </Heading>
          <nav className="flex flex-wrap gap-2">
            {figma ? <PortalSourcePill href={figma}>Figma</PortalSourcePill> : null}
            {storybook ? (
              <PortalSourcePill href={storybook}>Storybook</PortalSourcePill>
            ) : null}
            {docsUrl ? (
              <PortalSourcePill href={docsUrl}>Документация</PortalSourcePill>
            ) : null}
            {repo ? <PortalSourcePill href={repo}>Репозиторий</PortalSourcePill> : null}
            {!figma && !storybook && !docsUrl && !repo ? (
              <Text size="2" color="gray">
                Задайте URL в Globals → «Ссылки на источники» или выполните{" "}
                <Code size="1" variant="soft">
                  npm run seed:portal
                </Code>
                .
              </Text>
            ) : null}
          </nav>
        </section>

        <section id="components" className="scroll-mt-24 flex flex-col gap-4">
          <Heading as="h2" size="4">
            Компоненты
          </Heading>
          {components.length === 0 ? (
            <Text size="2" color="gray">
              Пусто. Запустите <Code size="1">npm run seed:portal</Code> или добавьте записи в{" "}
              <Text as="span" weight="bold">
                Components
              </Text>
              .
            </Text>
          ) : (
            <ul className="flex flex-col gap-4 list-none p-0 m-0">
              {components.map((c) => (
                <li key={c.id}>
                  <Card size="2" variant="surface">
                    <Flex wrap="wrap" align="baseline" justify="between" gap="2">
                      <Text weight="medium">{c.name}</Text>
                      <Code size="1" variant="soft">
                        {c.slug}
                      </Code>
                    </Flex>
                    {c.description ? (
                      <Text as="p" size="2" color="gray" mt="2" style={{ whiteSpace: "pre-wrap" }}>
                        {c.description}
                      </Text>
                    ) : null}
                    <Flex wrap="wrap" align="center" gap="4" mt="4">
                      <Link asChild size="2" weight="medium">
                        <NextLink href={`/components/${c.slug}`}>
                          Документация и превью →
                        </NextLink>
                      </Link>
                      <OptionalExternalLink href={c.figmaUrl} label="Figma" />
                      <OptionalExternalLink href={c.storybookUrl} label="Storybook" />
                      <OptionalExternalLink href={c.docsUrl} label="Доки" />
                    </Flex>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="colors" className="scroll-mt-24 flex flex-col gap-4">
          <Heading as="h2" size="4">
            Цвета
          </Heading>
          {colors.length === 0 ? (
            <Text size="2" color="gray">
              Пусто. Seed или коллекция <Text weight="bold">Colors</Text>.
            </Text>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 list-none p-0 m-0">
              {colors.map((color) => (
                <li key={color.id}>
                  <Link asChild>
                    <NextLink href={`/colors/${color.id}`} className="no-underline">
                      <Card size="2" variant="surface">
                        <Flex align="center" gap="3">
                          <span
                            className="size-10 shrink-0 rounded-lg border shadow-inner"
                            style={{
                              backgroundColor: color.hex,
                              borderColor: "var(--gray-a6)",
                            }}
                            title={color.hex}
                          />
                          <div className="min-w-0 flex-1">
                            <Text weight="medium" className="truncate block">
                              {color.name}
                            </Text>
                            <Text size="1" color="gray" className="truncate block font-mono">
                              {color.hex}
                              {color.tokenKey ? ` · ${color.tokenKey}` : ""}
                            </Text>
                          </div>
                        </Flex>
                      </Card>
                    </NextLink>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="icons" className="scroll-mt-24 flex flex-col gap-4 pb-8">
          <Heading as="h2" size="4">
            Иконки
          </Heading>
          {icons.length === 0 ? (
            <Text size="2" color="gray">
              Пусто. Seed или коллекция <Text weight="bold">Icons</Text> (+ превью в Media).
            </Text>
          ) : (
            <ul className="flex flex-col gap-4 list-none p-0 m-0">
              {icons.map((icon) => {
                const prev =
                  icon.preview &&
                  typeof icon.preview === "object" &&
                  "url" in icon.preview &&
                  typeof icon.preview.url === "string"
                    ? icon.preview.url
                    : null;

                return (
                  <li key={icon.id}>
                    <Card size="2" variant="surface">
                      <Flex gap="4">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
                          {prev ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={prev}
                              alt=""
                              className="size-full object-contain p-1"
                            />
                          ) : (
                            <Text
                              size="1"
                              color="gray"
                              align="center"
                              className="flex size-full items-center justify-center"
                            >
                              —
                            </Text>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Text weight="medium">{icon.name}</Text>
                          <Flex wrap="wrap" gap="4" mt="2">
                            <OptionalExternalLink href={icon.figmaUrl} label="Figma" />
                            <OptionalExternalLink href={icon.storybookUrl} label="Storybook" />
                          </Flex>
                        </div>
                      </Flex>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

function OptionalExternalLink({
  href,
  label,
}: {
  href: string | null | undefined;
  label: string;
}) {
  if (!href) return null;
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" size="2">
      {label}
    </Link>
  );
}
