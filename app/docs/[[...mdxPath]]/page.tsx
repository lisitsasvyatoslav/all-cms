import { generateStaticParamsFor, importPage } from "nextra/pages";

import { useMDXComponents as getMDXComponents } from "../../../mdx-components";

/** Turbopack + Nextra: статический пререндер MDX на данной связке падает; страницы /docs — SSR. */
export const dynamic = "force-dynamic";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(props: {
  params: Promise<{ mdxPath?: string[] }>;
}) {
  const params = await props.params;
  const segments = params.mdxPath ?? [];
  const { metadata } = await importPage(segments);
  return metadata;
}

const Wrapper = getMDXComponents().wrapper;

export default async function DocsPage({
  params: paramsPromise,
}: {
  params: Promise<{ mdxPath?: string[] }>;
}) {
  const params = await paramsPromise;
  const segments = params.mdxPath ?? [];
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await importPage(segments);

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent params={params} />
    </Wrapper>
  );
}
