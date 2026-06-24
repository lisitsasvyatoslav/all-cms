import { cache } from "react";
import { getPayload, type Payload } from "payload";

import config from "@payload-config";

/** Один инстанс Payload на HTTP-запрос (дедуп между layout, metadata и page). */
export const getCachedPayload = cache(async (): Promise<Payload> => {
  return getPayload({ config });
});
