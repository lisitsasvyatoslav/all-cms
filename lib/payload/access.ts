import type { Access, PayloadRequest, Where } from "payload";

export type PortalUserRole = "admin" | "viewer" | "designer" | "developer" | "pm";

type AccessArgs = { req: PayloadRequest };

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
  return ({ req }: AccessArgs) => requestHasRole(req, roles);
}

/** Backward compatibility: users without `role` are treated as admin. */
export function accessIsAdmin({ req }: AccessArgs): boolean {
  const user = req.user;
  if (!user) return false;
  if (!("role" in user) || !user.role) return true;
  return user.role === "admin";
}

export function accessIsLoggedIn({ req }: AccessArgs): boolean {
  return !!req.user;
}

export const accessIsAdminOrSelf: Access = ({ req }) => {
  if (accessIsAdmin({ req })) return true;
  if (!req.user?.id) return false;
  return { id: { equals: req.user.id } } satisfies Where;
};
