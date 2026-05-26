// import { generateKeyBetween } from "fractional-indexing";

// export function nextSortOrder(
//   lastSortOrder: string | null | undefined,
// ): string {
//   return generateKeyBetween(lastSortOrder ?? null, null);
// }

// export function sortOrderBetween(
//   before: string | null | undefined,
//   after: string | null | undefined,
// ): string {
//   return generateKeyBetween(before ?? null, after ?? null);
// }

export async function nextSortOrder(lastSortOrder: string | null | undefined) {
  const { generateKeyBetween } = await import("fractional-indexing");
  return generateKeyBetween(lastSortOrder ?? null, null);
}

export async function sortOrderBetween(
  before: string | null | undefined,
  after: string | null | undefined,
) {
  const { generateKeyBetween } = await import("fractional-indexing");
  return generateKeyBetween(before ?? null, after ?? null);
}
