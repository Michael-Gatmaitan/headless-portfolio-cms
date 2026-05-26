import { generateNKeysBetween } from "fractional-indexing";
import type { ReorderItem } from "@portfolio-types/shared";

/** Assigns fresh lexicographic keys for every item in visual order. */
export function buildReorderPayloadFromVisualOrder<
  T extends { id: string },
>(items: T[]): ReorderItem[] {
  const keys = generateNKeysBetween(null, null, items.length);
  return items.map((item, index) => ({
    id: item.id,
    sortOrder: keys[index]!,
  }));
}
