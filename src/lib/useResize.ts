import { useEffect, useRef, useState } from 'react';

/**
 * Returns the live width of the element attached to the returned ref. Updates
 * on container resize via a ResizeObserver.
 */
export function useElementWidth<T extends HTMLElement>(): {
  ref: React.RefObject<T>;
  width: number;
} {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}
