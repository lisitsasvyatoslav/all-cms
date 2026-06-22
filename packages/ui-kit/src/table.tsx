import { Table as RadixTable } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export type TableProps = ComponentProps<typeof RadixTable.Root>;

export function Table(_props: TableProps) {
  return (
    <RadixTable.Root>
      <RadixTable.Header>
        <RadixTable.Row>
          <RadixTable.ColumnHeaderCell>Name</RadixTable.ColumnHeaderCell>
          <RadixTable.ColumnHeaderCell>Role</RadixTable.ColumnHeaderCell>
        </RadixTable.Row>
      </RadixTable.Header>
      <RadixTable.Body>
        <RadixTable.Row>
          <RadixTable.Cell>Finam</RadixTable.Cell>
          <RadixTable.Cell>Design</RadixTable.Cell>
        </RadixTable.Row>
      </RadixTable.Body>
    </RadixTable.Root>
  );
}
