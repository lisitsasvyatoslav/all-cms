import { storybookUrlToIframeSrc } from "@/lib/storybook/storybook-embed-url";

type Props = {
  title: string;
  storybookUrl: string;
  frameHeight?: number | null;
};

export function StorybookEmbedPreview({ title, storybookUrl, frameHeight }: Props) {
  const iframeSrc = storybookUrlToIframeSrc(storybookUrl);
  const height = Math.min(800, Math.max(120, frameHeight ?? 280));

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {title}
        </p>
        <a
          href={storybookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Открыть в Storybook ↗
        </a>
      </div>

      {iframeSrc ? (
        <iframe
          title={title}
          src={iframeSrc}
          className="w-full border-0 bg-white"
          style={{ height }}
          loading="lazy"
        />
      ) : (
        <div className="space-y-2 px-4 py-6 text-sm text-amber-800 dark:text-amber-200">
          <p className="font-medium">Не удалось встроить Storybook</p>
          <p className="text-xs text-amber-700/90 dark:text-amber-300/90">
            Нужна ссылка на <strong>story</strong>, не docs, с хоста из{" "}
            <code className="rounded bg-amber-100/80 px-1 font-mono dark:bg-amber-900/50">
              NEXT_PUBLIC_STORYBOOK_URL
            </code>
            . Пример:{" "}
            <code className="break-all font-mono text-[11px]">
              ?path=/story/design-system-button--default&amp;args=variant:secondary
            </code>
          </p>
        </div>
      )}
    </div>
  );
}
