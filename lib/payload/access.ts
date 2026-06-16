import type { PayloadRequest } from "payload";

export type PortalUserRole = "admin" | "viewer" | "designer" | "developer" | "pm";

/** Роль CMS-пользователя; MCP API key не имеет role. */
export function getRequestUserRole(req: PayloadRequest): PortalUserRole | undefined {
  const user = req.user;
  if (!user || !("role" in user)) return undefined;
  return user.role;
}

export function requestHasRole(req: PayloadRequest, roles: PortalUserRole[]): boolean {
  const role = getRequestUserRole(req);
  return role !== undefined && roles.includes(role);
}

export function accessHasRole(roles: PortalUserRole[]) {
  return ({ req }: { req: PayloadRequest }) => requestHasRole(req, roles);
}
