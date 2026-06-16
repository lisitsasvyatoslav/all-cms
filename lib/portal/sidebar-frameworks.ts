export const PORTAL_SIDEBAR_FRAMEWORKS = [
  { id: "react", label: "React", iconSrc: "/react.svg" },
  { id: "kotlin", label: "Kotlin (Android)", iconSrc: "/kotlin.svg" },
  { id: "swift", label: "Swift (iOS)", iconSrc: "/swift.svg" },
  { id: "flutter", label: "Flutter", iconSrc: "/flutter.svg" },
] as const;

export type PortalSidebarFrameworkId =
  (typeof PORTAL_SIDEBAR_FRAMEWORKS)[number]["id"];
