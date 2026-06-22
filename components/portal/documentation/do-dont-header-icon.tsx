import { CircleCheck, CircleX } from "lucide-react";

import { portalClass } from "@/lib/portal/core/classes";

type Props = {
  variant: "do" | "dont";
};

export function DoDontHeaderIcon({ variant }: Props) {
  const className =
    variant === "do"
      ? `${portalClass.doDontIcon} ${portalClass.doDontIconDo}`
      : `${portalClass.doDontIcon} ${portalClass.doDontIconDont}`;

  const Icon = variant === "do" ? CircleCheck : CircleX;

  return (
    <span className={className} aria-hidden>
      <Icon size={16} strokeWidth={2} />
    </span>
  );
}
