"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const sanityStudioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3333";

export type SidebarComponent = { slug: string; name: string };

type Props = {
  components: SidebarComponent[];
};

export function PortalSidebar({ components }: Props) {
  const pathname = usePathname();
  const [hash, setHash] = useState("#overview");

  useEffect(() => {
    const sync = () => {
      setHash(window.location.hash || "#overview");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const onHome = pathname === "/";
  const activeComponentSlug = pathname.startsWith("/components/")
    ? pathname.slice("/components/".length).split("/")[0] ?? ""
    : "";

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-zinc-200/80 bg-zinc-50/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
        <Link
          href="/"
          className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Design System
        </Link>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Документация
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          Главная
        </p>
        <NavAnchor
          href="/#overview"
          active={onHome && (hash === "#overview" || hash === "")}
        >
          Обзор
        </NavAnchor>
        <NavAnchor href="/#sources" active={onHome && hash === "#sources"}>
          Источники
        </NavAnchor>

        <p className="mb-1 mt-4 px-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          Компоненты
        </p>
        <div className="flex flex-col gap-0.5">
          {components.map((c) => (
            <Link
              key={c.slug}
              href={`/components/${c.slug}`}
              className={`rounded-md px-2 py-1.5 text-sm transition-colors ${
                activeComponentSlug === c.slug
                  ? "bg-zinc-200/80 font-medium text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <p className="mb-1 mt-4 px-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          Основы
        </p>
        <NavAnchor href="/#colors" active={onHome && hash === "#colors"}>
          Цвета
        </NavAnchor>
        <NavAnchor href="/#icons" active={onHome && hash === "#icons"}>
          Иконки
        </NavAnchor>
      </nav>
      <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
        <a
          href={sanityStudioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-md px-2 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
        >
          Sanity Studio →
        </a>
      </div>
    </aside>
  );
}

function NavAnchor({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`rounded-md px-2 py-1.5 text-sm transition-colors ${
        active
          ? "bg-zinc-200/80 font-medium text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50"
          : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
      }`}
    >
      {children}
    </a>
  );
}
