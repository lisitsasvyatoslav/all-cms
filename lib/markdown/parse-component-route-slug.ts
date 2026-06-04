export type ComponentRouteSlug =
  | { format: "html"; slug: string }
  | { format: "markdown"; componentSlug: string; routeSlug: string };

const MD_SUFFIX = ".md";

export function parseComponentRouteSlug(slug: string): ComponentRouteSlug | null {
  if (!slug?.trim()) return null;

  if (slug.endsWith(MD_SUFFIX)) {
    const componentSlug = slug.slice(0, -MD_SUFFIX.length);
    if (!componentSlug || componentSlug.includes("/")) return null;
    return { format: "markdown", componentSlug, routeSlug: slug };
  }

  if (slug.includes("/")) return null;
  return { format: "html", slug };
}
