import type { Core } from "@strapi/strapi";
import get from "lodash/get";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";

/** UID-пары как в users-permissions: api::<apiName>.controllers.<controllerName> */
const PUBLIC_READ: ReadonlyArray<{ apiKey: string; controller: string }> = [
  { apiKey: "api::component", controller: "component" },
  { apiKey: "api::color", controller: "color" },
  { apiKey: "api::icon", controller: "icon" },
  { apiKey: "api::portal-source", controller: "portal-source" },
];

const ACTIONS = ["find", "findOne"] as const;

/**
 * Включает у роли Public доступ к чтению контента портала (REST без токена).
 * Идемпотентно: можно вызывать при каждом старте.
 * Отключить: STRAPI_GRANT_PUBLIC_READ=false
 */
export async function grantPortalPublicRead(strapi: Core.Strapi): Promise<void> {
  if (process.env.STRAPI_GRANT_PUBLIC_READ === "false") {
    strapi.log.info("[grant-public] skipped (STRAPI_GRANT_PUBLIC_READ=false)");
    return;
  }

  const roleService = strapi.plugin("users-permissions").service("role");

  const publicRole = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
  });

  if (!publicRole?.id) {
    strapi.log.warn("[grant-public] public role not found");
    return;
  }

  const full = await roleService.findOne(publicRole.id);
  const permissions = cloneDeep(full.permissions) as Record<string, unknown>;

  for (const { apiKey, controller } of PUBLIC_READ) {
    for (const action of ACTIONS) {
      const nodePath = `${apiKey}.controllers.${controller}.${action}`;
      if (get(permissions, nodePath) !== undefined) {
        set(permissions, `${nodePath}.enabled`, true);
      }
    }
  }

  await roleService.updateRole(publicRole.id, {
    name: full.name,
    description: full.description,
    permissions,
  });

  strapi.log.info("[grant-public] Public role: find/findOne enabled for portal APIs.");
}
