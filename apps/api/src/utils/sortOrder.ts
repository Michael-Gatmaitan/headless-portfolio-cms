import { generateKeyBetween } from "fractional-indexing";

export function nextSortOrder(
  lastSortOrder: string | null | undefined,
): string {
  return generateKeyBetween(lastSortOrder ?? null, null);
}

export function sortOrderBetween(
  before: string | null | undefined,
  after: string | null | undefined,
): string {
  return generateKeyBetween(before ?? null, after ?? null);
}
