import { portalClass } from "@/lib/portal/core/classes";

export type PortalPropsTableRow = {
  name: string;
  type: string;
  defaultValue?: string | null;
  description?: string | null;
};

function PropsTableCode({
  children,
  wrap = "chip",
}: {
  children: string;
  wrap?: "nowrap" | "chip";
}) {
  const className =
    wrap === "nowrap"
      ? `${portalClass.propsTableCode} ${portalClass.propsTableCodeNowrap}`
      : portalClass.propsTableCode;

  return (
    <code className={className}>
      <span className={portalClass.propsTableCodeText}>{children}</span>
    </code>
  );
}

function formatDefault(value?: string | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
}

export function PortalPropsTable({ rows }: { rows: PortalPropsTableRow[] }) {
  return (
    <div className={portalClass.propsTableWrap}>
      <table className={portalClass.propsTable}>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className={portalClass.propsTableCellCompact}>
                <PropsTableCode wrap="nowrap">{row.name}</PropsTableCode>
              </td>
              <td className={portalClass.propsTableCellType}>
                <PropsTableCode>{row.type}</PropsTableCode>
              </td>
              <td className={portalClass.propsTableCellCompact}>
                <PropsTableCode wrap="nowrap">{formatDefault(row.defaultValue)}</PropsTableCode>
              </td>
              <td>{row.description?.trim() || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
