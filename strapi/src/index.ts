import type { Core } from "@strapi/strapi";

import { grantPortalPublicRead } from "./bootstrap/grant-public-read";
import { seedDemoPortal } from "./bootstrap/seed-demo";

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await grantPortalPublicRead(strapi);
    } catch (err) {
      strapi.log.error("[grant-public] failed", err);
    }
    try {
      await seedDemoPortal(strapi);
    } catch (err) {
      strapi.log.error("[seed-demo] failed", err);
    }
  },
};
