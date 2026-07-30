import { NextResponse } from "next/server";

import { searchPortalDocs } from "@/lib/portal/search/load-search-results";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limitRaw = Number(searchParams.get("limit") ?? "20");
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 20;

  const results = await searchPortalDocs(q, limit);

  return NextResponse.json({
    query: q.trim(),
    count: results.length,
    results,
  });
}
