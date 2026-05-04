import type { ReactNode } from "react";

import { Button } from "@/components/ds/button";
import { Input } from "@/components/ds/input";

export function ComponentLiveDemos({ slug }: { slug: string }) {
  switch (slug) {
    case "button":
      return <ButtonDemos />;
    case "input":
      return <InputDemos />;
    default:
      return (
        <p className="text-sm text-zinc-500">
          Для этого slug нет встроенного демо — добавьте кейс в{" "}
          <code className="rounded bg-zinc-100 px-1 font-mono text-xs dark:bg-zinc-800">
            live-demos.tsx
          </code>
          .
        </p>
      );
  }
}

function DemoSurface({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function ButtonDemos() {
  return (
    <div className="flex flex-col gap-8">
      <DemoSurface title="По умолчанию">
        <Button>Кнопка</Button>
      </DemoSurface>
      <DemoSurface title="Варианты">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </DemoSurface>
      <DemoSurface title="Размеры">
        <div className="flex flex-wrap items-end gap-2">
          <Button size="sm">Маленькая</Button>
          <Button size="md">Средняя</Button>
          <Button size="lg">Большая</Button>
        </div>
      </DemoSurface>
      <DemoSurface title="Disabled">
        <Button disabled>Недоступна</Button>
      </DemoSurface>
    </div>
  );
}

function InputDemos() {
  return (
    <div className="flex max-w-lg flex-col gap-8">
      <DemoSurface title="По умолчанию">
        <Input placeholder="Введите значение" />
      </DemoSurface>
      <DemoSurface title="Размеры">
        <div className="flex flex-col gap-3">
          <Input inputSize="sm" placeholder="Small" />
          <Input inputSize="md" placeholder="Medium" />
          <Input inputSize="lg" placeholder="Large" />
        </div>
      </DemoSurface>
      <DemoSurface title="Ошибка">
        <Input invalid placeholder="Некорректные данные" defaultValue="???" />
      </DemoSurface>
      <DemoSurface title="Disabled">
        <Input disabled placeholder="Только чтение" />
      </DemoSurface>
    </div>
  );
}
