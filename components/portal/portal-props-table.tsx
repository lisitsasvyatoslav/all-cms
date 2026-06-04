import { Table } from "@radix-ui/themes";

export type PortalPropsTableRow = {
  name: string;
  type: string;
  defaultValue?: string | null;
  description?: string | null;
};

export function PortalPropsTable({ rows }: { rows: PortalPropsTableRow[] }) {
  return (
    <Table.Root variant="surface" size="2">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Имя</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Тип</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>По умолч.</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Описание</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((row) => (
          <Table.Row key={row.name}>
            <Table.RowHeaderCell>
              <code>{row.name}</code>
            </Table.RowHeaderCell>
            <Table.Cell>
              <code>{row.type}</code>
            </Table.Cell>
            <Table.Cell>
              <code>{row.defaultValue?.trim() ? row.defaultValue : "—"}</code>
            </Table.Cell>
            <Table.Cell>{row.description ?? "—"}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
