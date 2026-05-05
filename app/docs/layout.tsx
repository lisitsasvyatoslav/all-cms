import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import Link from "next/link";
import type { ReactNode } from "react";
import "nextra-theme-docs/style.css";

export default async function DocsLayout({
  children,
}: Readonly<{
  children: ReactNode | Promise<ReactNode>;
}>) {
  /** Next может передавать children как Promise (streaming); Zod в теме ожидает уже разрешённый ReactNode. */
  const content = await Promise.resolve(children);

  const pageMap = await getPageMap("/docs");

  const navbar = (
    <Navbar
      logo={<span className="font-semibold">Design System</span>}
      logoLink="/docs"
    >
      <Link
        href="/"
        className="text-sm text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        Портал
      </Link>
    </Navbar>
  );

  return (
    <Layout
      darkMode
      navbar={navbar}
      pageMap={pageMap}
      docsRepositoryBase="https://github.com/example/design-system"
      editLink={<span className="sr-only">Редактировать</span>}
      footer={<Footer>Design System · документация</Footer>}
      sidebar={{ defaultMenuCollapseLevel: 1 }}
    >
      {content}
    </Layout>
  );
}
