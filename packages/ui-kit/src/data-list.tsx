import { DataList as RadixDataList } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type DataListProps = ComponentProps<typeof RadixDataList.Root>;

export function DataList(_props: DataListProps) {
  return (
    <RadixDataList.Root>
      <RadixDataList.Item>
        <RadixDataList.Label>Name</RadixDataList.Label>
        <RadixDataList.Value>Finam</RadixDataList.Value>
      </RadixDataList.Item>
    </RadixDataList.Root>
  );
}
