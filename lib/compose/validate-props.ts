/**
 * Примитивная проверка значения prop по строке типа из props-manifest.
 * Не полный TypeScript-парсер — достаточно для enum/boolean/string/array объектов.
 */
export function validatePropValue(
  typeStr: string,
  value: unknown,
): { valid: true } | { valid: false; message: string } {
  const normalized = typeStr.trim();

  if (normalized === "boolean") {
    return typeof value === "boolean"
      ? { valid: true }
      : { valid: false, message: "ожидается boolean" };
  }

  if (normalized === "string") {
    return typeof value === "string"
      ? { valid: true }
      : { valid: false, message: "ожидается string" };
  }

  if (normalized === "number") {
    return typeof value === "number" && Number.isFinite(value)
      ? { valid: true }
      : { valid: false, message: "ожидается number" };
  }

  if (normalized === "ReactNode") {
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return { valid: true };
    }
    return {
      valid: false,
      message: "ожидается string | number | boolean | null для ReactNode",
    };
  }

  if (normalized.includes("|")) {
    const literals = [...normalized.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
    if (literals.length > 0) {
      if (typeof value !== "string") {
        return { valid: false, message: `ожидается одно из: ${literals.join(", ")}` };
      }
      if (!literals.includes(value)) {
        return { valid: false, message: `допустимые значения: ${literals.join(", ")}` };
      }
      return { valid: true };
    }

    if (normalized.includes("string") && normalized.includes("number")) {
      if (typeof value === "string" || typeof value === "number") {
        return { valid: true };
      }
      return { valid: false, message: "ожидается string | number" };
    }
  }

  if (normalized.endsWith("[]")) {
    if (!Array.isArray(value)) {
      return { valid: false, message: "ожидается массив" };
    }

    const itemType = normalized.slice(0, -2).trim();
    if (itemType.includes("value: string") && itemType.includes("label: string")) {
      for (const [index, item] of value.entries()) {
        if (
          !item ||
          typeof item !== "object" ||
          typeof (item as { value?: unknown }).value !== "string" ||
          typeof (item as { label?: unknown }).label !== "string"
        ) {
          return {
            valid: false,
            message: `options[${index}] должен быть { value: string, label: string }`,
          };
        }
      }
      return { valid: true };
    }

    return { valid: true };
  }

  if (normalized.startsWith("{") && normalized.includes("value:")) {
    if (
      value &&
      typeof value === "object" &&
      typeof (value as { value?: unknown }).value === "string" &&
      typeof (value as { label?: unknown }).label === "string"
    ) {
      return { valid: true };
    }
    return { valid: false, message: "ожидается объект { value, label }" };
  }

  // Неизвестный сложный тип — пропускаем строгую проверку.
  return { valid: true };
}
