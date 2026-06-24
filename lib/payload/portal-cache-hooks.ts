import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

import {
  revalidatePortalBrandCaches,
  revalidatePortalBrandOverviewCache,
  revalidatePortalComponentCaches,
  revalidatePortalDesignChecklistCache,
  revalidatePortalDsOverviewCache,
  revalidatePortalGlossaryCaches,
  revalidatePortalGlossaryTermsCache,
  revalidatePortalSeoCache,
  revalidatePortalSourcesCache,
  revalidatePortalTextGlossaryCache,
} from "@/lib/payload/revalidate-portal-cache";

export const revalidatePortalComponentNavAfterChange: CollectionAfterChangeHook = () => {
  revalidatePortalComponentCaches();
};

export const revalidatePortalComponentNavAfterDelete: CollectionAfterDeleteHook = () => {
  revalidatePortalComponentCaches();
};

export const revalidatePortalBrandNavAfterChange: CollectionAfterChangeHook = () => {
  revalidatePortalBrandCaches();
};

export const revalidatePortalBrandNavAfterDelete: CollectionAfterDeleteHook = () => {
  revalidatePortalBrandCaches();
};

export const revalidatePortalDesignChecklistAfterChange: CollectionAfterChangeHook = () => {
  revalidatePortalDesignChecklistCache();
  revalidatePortalComponentCaches();
};

export const revalidatePortalGlossaryTermsAfterChange: CollectionAfterChangeHook = () => {
  revalidatePortalGlossaryTermsCache();
};

export const revalidatePortalGlossaryTermsAfterDelete: CollectionAfterDeleteHook = () => {
  revalidatePortalGlossaryTermsCache();
};

export const revalidatePortalSourcesAfterChange: GlobalAfterChangeHook = () => {
  revalidatePortalSourcesCache();
};

export const revalidatePortalSeoAfterChange: GlobalAfterChangeHook = () => {
  revalidatePortalSeoCache();
};

export const revalidatePortalDsOverviewAfterChange: GlobalAfterChangeHook = () => {
  revalidatePortalDsOverviewCache();
};

export const revalidatePortalBrandOverviewAfterChange: GlobalAfterChangeHook = () => {
  revalidatePortalBrandOverviewCache();
};

export const revalidatePortalTextGlossaryAfterChange: GlobalAfterChangeHook = () => {
  revalidatePortalTextGlossaryCache();
};
