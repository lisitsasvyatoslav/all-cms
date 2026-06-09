import { Code, Table, Text } from "@radix-ui/themes";

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
              <Code size="1" variant="ghost">
                {row.name}
              </Code>
            </Table.RowHeaderCell>
            <Table.Cell>
              <Code size="1" variant="ghost">
                {row.type}
              </Code>
            </Table.Cell>
            <Table.Cell>
              <Code size="1" variant="ghost">
                {row.defaultValue?.trim() ? row.defaultValue : "—"}
              </Code>
            </Table.Cell>
            <Table.Cell>
              <Text size="2">{row.description ?? "—"}</Text>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
