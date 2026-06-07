export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1];

export const DEFAULT_VIEWPORT = { once: true, amount: 0.3 };

export const fadeIn = (direction, delay = 0) => ({
  hidden: {
    y: direction === "up" ? 50 : direction === "down" ? -50 : 0,
    opacity: 0,
    x: direction === "left" ? 50 : direction === "right" ? -50 : 0,
  },
  show: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.85,
      delay,
      ease: EASE_OUT_EXPO,
    },
  },
});

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});
