import { PORTAL_COMPONENTS_WEB_PATH } from "@/lib/portal/component-routes";

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
    href: "/components/kotlin",
    enabled: false,
  },
  {
    id: "swift",
    label: "SwiftUI",
    iconSrc: "/swift.svg",
    href: "/components/swift",
    enabled: false,
  },
  {
    id: "flutter",
    label: "Flutter",
    iconSrc: "/flutter.svg",
    href: "/components/flutter",
    enabled: false,
  },
] as const;

export type PortalComponentFrameworkId =
  (typeof PORTAL_COMPONENT_FRAMEWORKS)[number]["id"];
