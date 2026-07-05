/**
 * Freeze page scroll for a fullscreen takeover. Pins the body at the current
 * offset (position: fixed + negative top) so the page can't scroll behind the
 * overlay, and returns an unlock fn that restores the exact prior styles and
 * scroll position.
 */
export function lockBodyScroll(): () => void {
  const scrollY = window.scrollY;
  const { body } = document;
  const prev = {
    position: body.style.position,
    top: body.style.top,
    width: body.style.width,
    overflow: body.style.overflow,
  };

  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.width = "100%";
  body.style.overflow = "hidden";

  return () => {
    body.style.position = prev.position;
    body.style.top = prev.top;
    body.style.width = prev.width;
    body.style.overflow = prev.overflow;
    window.scrollTo(0, scrollY);
  };
}
