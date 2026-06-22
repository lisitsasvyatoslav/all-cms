import { portalPath } from "@/lib/portal/core/portal-base-path";
import { PORTAL_COMPONENTS_WEB_PATH } from "@/lib/portal/components/routes";

export const PORTAL_COMPONENT_FRAMEWORKS = [
  {
    id: "web",
    label: "Web",
    iconSrc: "/react.svg",
    href: PORTAL_COMPONENTS_WEB_PATH,
    enabled: true,
  },
  {
    id: "kotlin",
    label: "Kotlin",
    iconSrc: "/kotlin.svg",
    href: portalPath("/components/kotlin"),
    enabled: false,
  },
  {
    id: "swift",
    label: "SwiftUI",
    iconSrc: "/swift.svg",
    href: portalPath("/components/swift"),
    enabled: false,
  },
  {
    id: "flutter",
    label: "Flutter",
    iconSrc: "/flutter.svg",
    href: portalPath("/components/flutter"),
    enabled: false,
  },
] as const;

export type PortalComponentFrameworkId =
  (typeof PORTAL_COMPONENT_FRAMEWORKS)[number]["id"];
