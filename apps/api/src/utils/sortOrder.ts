// Use a dynamic Function constructor to bypass TypeScript's transpilation of import() to require() in CommonJS mode
const loadFractionalIndexing = async () => {
  const dynamicImport = new Function('return import("fractional-indexing")');
  return dynamicImport() as Promise<typeof import("fractional-indexing")>;
};

export async function nextSortOrder(lastSortOrder: string | null | undefined) {
  const { generateKeyBetween } = await loadFractionalIndexing();
  return generateKeyBetween(lastSortOrder ?? null, null);
}

export async function sortOrderBetween(
  before: string | null | undefined,
  after: string | null | undefined,
) {
  const { generateKeyBetween } = await loadFractionalIndexing();
  return generateKeyBetween(before ?? null, after ?? null);
}

