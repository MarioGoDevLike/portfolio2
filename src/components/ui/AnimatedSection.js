import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { DEFAULT_VIEWPORT, fadeIn } from "../../animations/variants";

const AnimatedSection = forwardRef(
  (
    {
      children,
      direction = "up",
      delay = 0,
      className = "",
      as = motion.div,
      viewport = DEFAULT_VIEWPORT,
      ...props
    },
    ref
  ) => {
    const Component = as;

    return (
      <Component
        ref={ref}
        variants={fadeIn(direction, delay)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className={className}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
