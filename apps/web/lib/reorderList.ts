/** Reorders a list in-place by id to match the drag target index. */
export function reorderListById<T extends { id: string }>(
  items: T[],
  itemId: string,
  targetIndex: number,
): T[] | null {
  const currentIndex = items.findIndex((item) => item.id === itemId);
  if (currentIndex === -1) return null;
  if (currentIndex === targetIndex) return items;

  const next = [...items];
  const [moved] = next.splice(currentIndex, 1);
  if (!moved) return null;
  next.splice(targetIndex, 0, moved);
  return next;
}
