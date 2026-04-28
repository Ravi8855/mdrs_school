import { useEffect, useRef, useState } from 'react';

/**
 * Hook that detects when an element enters the viewport.
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - 0–1, how much visible to trigger (default 0.1)
 * @param {string} options.rootMargin - e.g. '0px 0px -50px 0px' to trigger slightly before
 * @returns {[React.RefObject, boolean]} [ref, isInView]
 */
export function useInView(options = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px' } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            break;
          }
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    /* Already in view on first paint: browsers may not enqueue an initial callback. */
    for (const entry of observer.takeRecords()) {
      if (entry.isIntersecting && entry.target === el) {
        setIsInView(true);
        break;
      }
    }
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isInView];
}
