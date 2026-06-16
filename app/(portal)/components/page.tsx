import { redirect } from "next/navigation";

import { PORTAL_COMPONENTS_WEB_PATH } from "@/lib/portal/component-routes";

/** /components → каталог /components/web */
export default function ComponentsIndexRedirect() {
  redirect(PORTAL_COMPONENTS_WEB_PATH);
}
