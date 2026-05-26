/** Whether the pointer has crossed the target card center (works for grid + list layouts). */
export function shouldSwapOnHover(
  dragIndex: number,
  hoverIndex: number,
  hoverRect: DOMRect,
  clientOffset: { x: number; y: number },
): boolean {
  if (dragIndex === hoverIndex) return false;

  const hoverCenterX = hoverRect.left + hoverRect.width / 2;
  const hoverCenterY = hoverRect.top + hoverRect.height / 2;

  if (dragIndex < hoverIndex) {
    return (
      clientOffset.x > hoverCenterX || clientOffset.y > hoverCenterY
    );
  }

  return (
    clientOffset.x < hoverCenterX || clientOffset.y < hoverCenterY
  );
}
