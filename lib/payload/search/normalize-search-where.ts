import type { CollectionBeforeOperationHook, Where } from "payload";

import { normalizePortalSearchText } from "./normalize-search-text";

function normalizeLikeCondition(value: unknown): unknown {
  if (!value || typeof value !== "object" || !("like" in value)) {
    return value;
  }

  const condition = value as { like?: unknown };
  if (typeof condition.like !== "string") {
    return value;
  }

  return {
    ...condition,
    like: normalizePortalSearchText(condition.like),
  };
}

function normalizeWhereClause(where: Where): Where {
  if (!where || typeof where !== "object") {
    return where;
  }

  const next: Where = { ...where };

  if (Array.isArray(next.and)) {
    next.and = next.and.map((clause) => normalizeWhereClause(clause as Where));
  }

  if (Array.isArray(next.or)) {
    next.or = next.or.map((clause) => normalizeWhereClause(clause as Where));
  }

  for (const [field, value] of Object.entries(next)) {
    if (field === "and" || field === "or") continue;
    next[field] = normalizeLikeCondition(value) as Where[string];
  }

  return next;
}

/** Admin list search: SQLite `like` чувствителен к регистру кириллицы — нормализуем значения. */
export const normalizePortalSearchWhere: CollectionBeforeOperationHook = ({ args, operation }) => {
  if (operation !== "read" || !args.where) {
    return args;
  }

  return {
    ...args,
    where: normalizeWhereClause(args.where),
  };
};
