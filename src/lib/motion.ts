import type { Transition } from 'framer-motion';

/** Soft, natural spring — used for hero entrances and page transitions. */
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 90,
  damping: 22,
  mass: 0.9,
};

/** Snappier spring for small UI movements (button states, chip swaps). */
export const springSnap: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
};

/** Heavier, momentum-based spring for the mockup fan. */
export const springHeavy: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 18,
  mass: 1.1,
};

export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { ...springSoft, delay },
});

export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.25, delay, ease: 'easeOut' as const },
});
