import { createHash } from "node:crypto";
import type { Payload } from "payload";

import { parseGlossaryAvoidVariants } from "@/lib/portal/glossary/letter";

import type { CompositionDocument, CompositionNode } from "./types";

export type ComposeGlossaryTerm = {
  id: string | number;
  preferred: string;
  avoid: string[];
};

export type ComposeGlossaryGuidance = {
  revision: string;
  terms: ComposeGlossaryTerm[];
};

export type GlossaryCorrection = {
  path: string;
  before: string;
  after: string;
  found: string;
  preferred: string;
};

export type AmbiguousGlossaryMatch = {
  path: string;
  text: string;
  found: string;
  preferredCandidates: string[];
};

export type GlossaryAuditResult = {
  composition: CompositionDocument;
  corrections: GlossaryCorrection[];
  ambiguousMatches: AmbiguousGlossaryMatch[];
};

const VISIBLE_TEXT_PROPS = new Set([
  "aria-label",
  "alt",
  "description",
  "label",
  "placeholder",
  "title",
]);

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function loadComposeGlossaryGuidance(
  payload: Payload,
): Promise<ComposeGlossaryGuidance> {
  const result = await payload.find({
    collection: "glossary-terms",
    limit: 1000,
    depth: 0,
    overrideAccess: true,
    sort: "preferred",
  });

  const terms = result.docs
    .map((doc) => ({
      id: doc.id,
      preferred: text(doc.preferred),
      avoid: parseGlossaryAvoidVariants(doc.avoid),
    }))
    .filter((term) => term.preferred && term.avoid.length > 0);

  return {
    revision: createHash("sha256")
      .update(JSON.stringify(terms))
      .digest("hex")
      .slice(0, 16),
    terms,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phrasePattern(phrase: string): RegExp {
  return new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRegExp(phrase)}(?![\\p{L}\\p{N}])`,
    "giu",
  );
}

function preferredRanges(value: string, terms: ComposeGlossaryTerm[]): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  for (const term of terms) {
    for (const match of value.matchAll(phrasePattern(term.preferred))) {
      if (match.index !== undefined) ranges.push([match.index, match.index + match[0].length]);
    }
  }
  return ranges;
}

function insideRange(start: number, end: number, ranges: Array<[number, number]>): boolean {
  return ranges.some(([rangeStart, rangeEnd]) => start >= rangeStart && end <= rangeEnd);
}

function correctText(
  value: string,
  path: string,
  guidance: ComposeGlossaryGuidance,
): {
  value: string;
  corrections: GlossaryCorrection[];
  ambiguousMatches: AmbiguousGlossaryMatch[];
} {
  const preferredByAvoid = new Map<string, Set<string>>();
  const displayByAvoid = new Map<string, string>();
  for (const term of guidance.terms) {
    for (const avoid of term.avoid) {
      const key = avoid.toLocaleLowerCase("ru");
      const preferred = preferredByAvoid.get(key) ?? new Set<string>();
      preferred.add(term.preferred);
      preferredByAvoid.set(key, preferred);
      displayByAvoid.set(key, avoid);
    }
  }

  const protectedRanges = preferredRanges(value, guidance.terms);
  const variants = [...preferredByAvoid.keys()].sort((a, b) => b.length - a.length);
  const matches: Array<{
    start: number;
    end: number;
    found: string;
    candidates: string[];
  }> = [];

  for (const variant of variants) {
    const display = displayByAvoid.get(variant) ?? variant;
    for (const match of value.matchAll(phrasePattern(display))) {
      if (match.index === undefined) continue;
      const start = match.index;
      const end = start + match[0].length;
      if (insideRange(start, end, protectedRanges)) continue;
      if (matches.some((item) => start < item.end && end > item.start)) continue;
      matches.push({
        start,
        end,
        found: match[0],
        candidates: [...(preferredByAvoid.get(variant) ?? [])].sort(),
      });
    }
  }

  matches.sort((a, b) => a.start - b.start);
  let corrected = value;
  const corrections: GlossaryCorrection[] = [];
  const ambiguousMatches: AmbiguousGlossaryMatch[] = [];

  for (const match of [...matches].reverse()) {
    if (match.candidates.length !== 1) {
      ambiguousMatches.unshift({
        path,
        text: value,
        found: match.found,
        preferredCandidates: match.candidates,
      });
      continue;
    }
    const preferred = match.candidates[0];
    const before = corrected;
    corrected = `${corrected.slice(0, match.start)}${preferred}${corrected.slice(match.end)}`;
    corrections.unshift({ path, before, after: corrected, found: match.found, preferred });
  }

  return { value: corrected, corrections, ambiguousMatches };
}

export function auditAndCorrectGlossary(
  composition: CompositionDocument,
  guidance: ComposeGlossaryGuidance,
): GlossaryAuditResult {
  const corrected = structuredClone(composition);
  const corrections: GlossaryCorrection[] = [];
  const ambiguousMatches: AmbiguousGlossaryMatch[] = [];

  function apply(value: string, path: string): string {
    const result = correctText(value, path, guidance);
    corrections.push(...result.corrections);
    ambiguousMatches.push(...result.ambiguousMatches);
    return result.value;
  }

  function visit(node: CompositionNode, path: string): void {
    if (node.text) node.text = apply(node.text, `${path}.text`);
    if (node.props) {
      for (const [prop, value] of Object.entries(node.props)) {
        if (VISIBLE_TEXT_PROPS.has(prop) && typeof value === "string") {
          node.props[prop] = apply(value, `${path}.props.${prop}`);
        }
      }
    }
    node.children?.forEach((child, index) => visit(child, `${path}.children[${index}]`));
  }

  visit(corrected.root, "root");
  return { composition: corrected, corrections, ambiguousMatches };
}
