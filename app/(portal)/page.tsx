import { Box, Card, Code, Flex, Grid, Heading, Link, Text } from "@radix-ui/themes";
import type { Metadata } from "next";
import NextLink from "next/link";
import { getPayload } from "payload";

import config from "@payload-config";
import { PortalSourcePill } from "@/components/portal/portal-source-pill";
import { PortalComponentTitle } from "@/components/portal/portal-component-title";
import { PortalPageContainer } from "@/components/portal/portal-shell";
import { buildHomeOpenGraphMetadata } from "@/lib/portal/component-open-graph";
import { isComponentVisibleOnPortal } from "@/lib/portal/component-status";
import { portalClass } from "@/lib/portal/classes";
import { componentWebPagePath } from "@/lib/portal/component-routes";
import { portalSwatchBg } from "@/lib/portal/css-vars";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildHomeOpenGraphMetadata();
}

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
    <PortalPageContainer>
      <Flex direction="column" gap="8">
        <Box id="overview" className={portalClass.scrollTarget}>
          <Text size="2" color="gray" weight="medium">
            Тестовый портал · Payload + Next.js
          </Text>
          <Heading size="8" weight="medium" mt="2">
            Дизайн-система
          </Heading>
          <Text as="p" size="4" color="gray" mt="3" className={portalClass.lead}>
            Данные ниже из коллекций CMS. Редактирование в{" "}
            <Link asChild weight="medium">
              <NextLink href="/admin">/admin</NextLink>
            </Link>
            . Навигация слева — якоря по разделам.
          </Text>
          <Box mt="6" className={portalClass.borderBottom} pb="6" />
        </Box>

        <Box id="sources" className={portalClass.scrollTarget}>
          <Heading as="h2" size="4" mb="4">
            Источники
          </Heading>
          <nav className={portalClass.linkRow} aria-label="Источники">
              {figma ? (
                <PortalSourcePill href={figma} icon="figma">
                  Figma
                </PortalSourcePill>
              ) : null}
              {storybook ? (
                <PortalSourcePill href={storybook} icon="storybook">
                  Storybook
                </PortalSourcePill>
              ) : null}
              {docsUrl ? (
                <PortalSourcePill href={docsUrl} icon="docs">
                  Документация
                </PortalSourcePill>
              ) : null}
              {repo ? (
                <PortalSourcePill href={repo} icon="github">
                  Репозиторий
                </PortalSourcePill>
              ) : null}
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
        </Box>

        <Box id="components" className={portalClass.scrollTarget}>
          <Heading as="h2" size="4" mb="4">
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
            <Flex direction="column" gap="4">
              {components
                .filter((c) => isComponentVisibleOnPortal(c))
                .map((c) => (
                <Card key={c.id} size="2" variant="surface">
                  <Flex wrap="wrap" align="baseline" justify="between" gap="2">
                    <PortalComponentTitle name={c.name} status={c.status} />
                    <Code size="1" variant="soft">
                      {c.slug}
                    </Code>
                  </Flex>
                  {c.description ? (
                    <Text as="p" size="2" color="gray" mt="2" className={portalClass.textPreWrap}>
                      {c.description}
                    </Text>
                  ) : null}
                  <Flex wrap="wrap" align="center" gap="4" mt="4">
                    <Link asChild size="2" weight="medium">
                      <NextLink href={componentWebPagePath(c.slug)}>Документация и превью →</NextLink>
                    </Link>
                    <OptionalExternalLink href={c.figmaUrl} label="Figma" />
                    <OptionalExternalLink href={c.storybookUrl} label="Storybook" />
                    <OptionalExternalLink href={c.docsUrl} label="Доки" />
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
        </Box>

        <Box id="colors" className={portalClass.scrollTarget}>
          <Heading as="h2" size="4" mb="4">
            Цвета
          </Heading>
          {colors.length === 0 ? (
            <Text size="2" color="gray">
              Пусто. Seed или коллекция <Text weight="bold">Colors</Text>.
            </Text>
          ) : (
            <Grid columns={{ initial: "1", sm: "2" }} gap="3">
              {colors.map((color) => (
                <Link key={color.id} asChild>
                  <NextLink href={`/colors/${color.id}`} className={portalClass.linkPlain}>
                    <Card size="2" variant="surface">
                      <Flex align="center" gap="3">
                        <Box
                          className={`${portalClass.swatch} ${portalClass.swatch40}`}
                          style={portalSwatchBg(color.hex)}
                          title={color.hex}
                        />
                        <Box className={portalClass.minW0}>
                          <Text weight="medium" truncate>
                            {color.name}
                          </Text>
                          <Text size="1" color="gray" truncate className={portalClass.codeFont}>
                            {color.hex}
                            {color.tokenKey ? ` · ${color.tokenKey}` : ""}
                          </Text>
                        </Box>
                      </Flex>
                    </Card>
                  </NextLink>
                </Link>
              ))}
            </Grid>
          )}
        </Box>

        <Box id="icons" className={portalClass.scrollTarget} pb="6">
          <Heading as="h2" size="4" mb="4">
            Иконки
          </Heading>
          {icons.length === 0 ? (
            <Text size="2" color="gray">
              Пусто. Seed или коллекция <Text weight="bold">Icons</Text> (+ превью в Media).
            </Text>
          ) : (
            <Flex direction="column" gap="4">
              {icons.map((icon) => {
                const prev =
                  icon.preview &&
                  typeof icon.preview === "object" &&
                  "url" in icon.preview &&
                  typeof icon.preview.url === "string"
                    ? icon.preview.url
                    : null;

                return (
                  <Card key={icon.id} size="2" variant="surface">
                    <Flex gap="4">
                      <Box className={`portal-icon-preview ${portalClass.iconPreview48}`}>
                        {prev ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={prev} alt="" className={portalClass.imgInPreview} />
                        ) : (
                          <Flex align="center" justify="center" height="100%">
                            <Text size="1" color="gray">
                              —
                            </Text>
                          </Flex>
                        )}
                      </Box>
                      <Box className={portalClass.minW0}>
                        <Text weight="medium">{icon.name}</Text>
                        <Flex wrap="wrap" gap="4" mt="2">
                          <OptionalExternalLink href={icon.figmaUrl} label="Figma" />
                          <OptionalExternalLink href={icon.storybookUrl} label="Storybook" />
                        </Flex>
                      </Box>
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
          )}
        </Box>
      </Flex>
    </PortalPageContainer>
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
