import "./load-env.js";
import { getPayload } from "payload";

import config from "../payload.config";
import type { Component } from "../payload-types";
import {
  BUTTON_DO_DONT_BLOCK_ID,
  BUTTON_DO_DONT_SEED,
} from "../lib/portal/components/button-do-dont-seed";

async function main() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "components",
    where: { slug: { equals: "button" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const button = result.docs[0];
  if (!button) throw new Error('Component with slug "button" was not found.');

  const documentation: NonNullable<Component["documentation"]> = [
    ...(button.documentation ?? []),
  ];
  const index = documentation.findIndex(
    (block) => block.blockType === "doDont" && block.id === BUTTON_DO_DONT_BLOCK_ID,
  );
  const block = { ...BUTTON_DO_DONT_SEED, id: BUTTON_DO_DONT_BLOCK_ID };

  if (index >= 0) documentation[index] = block;
  else documentation.push(block);

  const updated = await payload.update({
    collection: "components",
    id: button.id,
    data: { documentation },
    depth: 0,
    overrideAccess: true,
  });

  const saved = (updated.documentation ?? []).find(
    (item) => item.blockType === "doDont" && item.id === BUTTON_DO_DONT_BLOCK_ID,
  );
  if (saved?.blockType !== "doDont") {
    throw new Error("Button do/don't block was not persisted.");
  }

  console.log(
    `Button do/don't updated in Payload (id=${button.id}, do=${saved.dos?.length ?? 0}, don't=${saved.donts?.length ?? 0}).`,
  );
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
