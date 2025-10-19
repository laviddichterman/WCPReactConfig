import type { Transition } from 'motion/react';

// ----------------------------------------------------------------------

export const varHover = (scale?: number) => ({
  hover: {
    scale: scale || 1.1,
  },
});
export const varTap = (value = 0.9) => ({
  scale: value,
});

export const transitionTap = (props?: Transition): Transition => ({
  type: 'spring',
  stiffness: 400,
  damping: 18,
  ...props,
});

export const transitionHover = (props?: Transition): Transition => ({
  duration: 0.32,
  ease: [0.43, 0.13, 0.23, 0.96],
  ...props,
});
