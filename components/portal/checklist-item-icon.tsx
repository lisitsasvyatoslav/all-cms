import { Check } from "lucide-react";

import { portalClass } from "@/lib/portal/classes";

type Props = {
  done?: boolean | null;
};

export function ChecklistItemIcon({ done }: Props) {
  if (done) {
    return (
      <span
        className={`${portalClass.checklistIcon} ${portalClass.checklistIconDone}`}
        aria-hidden
      >
        <Check size={16} strokeWidth={2.5} />
      </span>
    );
  }

  return (
    <span
      className={`${portalClass.checklistIcon} ${portalClass.checklistIconPending}`}
      aria-hidden
    />
  );
}
