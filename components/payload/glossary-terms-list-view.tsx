"use client";

import { DefaultListView, useListQuery } from "@payloadcms/ui";
import { useEffect, useRef } from "react";
import type { ListViewClientProps } from "payload";

function EnsureGlossaryGroupByLetter() {
  const { query, refineListData } = useListQuery();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || query?.groupBy) return;
    initialized.current = true;
    void refineListData({
      groupBy: "letter",
      sort: "preferred",
      limit: 200,
    });
  }, [query?.groupBy, refineListData]);

  return null;
}

/** Список glossary-terms с группировкой по полю letter по умолчанию. */
export function GlossaryTermsListView(props: ListViewClientProps) {
  return (
    <>
      <EnsureGlossaryGroupByLetter />
      <DefaultListView {...props} />
    </>
  );
}
