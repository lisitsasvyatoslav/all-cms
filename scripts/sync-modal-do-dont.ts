import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import type { Component } from "../payload-types";
import { MODAL_DO_DONT_SEED } from "../lib/portal/components/modal-do-dont-seed";

async function main() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "components",
    where: { slug: { equals: "modal" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const modal = result.docs[0];
  if (!modal) throw new Error('Component with slug "modal" was not found.');

  const documentation: NonNullable<Component["documentation"]> = [
    ...(modal.documentation ?? []),
  ];
  const index = documentation.findIndex((block) => block.blockType === "doDont");
  const existing = index >= 0 ? documentation[index] : undefined;
  const block = {
    ...MODAL_DO_DONT_SEED,
    ...(existing?.id ? { id: existing.id } : {}),
  };

  if (index >= 0) documentation[index] = block;
  else documentation.push(block);

  await payload.update({
    collection: "components",
    id: modal.id,
    data: { documentation },
    depth: 0,
    overrideAccess: true,
  });

  console.log(`Modal do/don't updated in Payload (id=${modal.id}).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
