/**
 * RhinoGuardians - Centralized Motion Configuration
 * SaaS-grade animation settings with refined easing
 * Aligned with CSS transition tokens
 */

/**
 * Professional easing curves - no bounce, no overshoot
 */
export const easings = {
  // Smooth, refined easings for professional UI
  smooth: [0.4, 0, 0.2, 1], // matches CSS cubic-bezier(0.4, 0, 0.2, 1)
  smoothIn: [0.4, 0, 1, 1],
  smoothOut: [0, 0, 0.2, 1],

  // Subtle easing for micro-interactions
  subtle: [0.32, 0.72, 0, 1],

  // Linear for continuous motion
  linear: [0, 0, 1, 1]
}

/**
 * Duration tokens aligned with CSS variables
 */
export const durations = {
  fast: 0.15, // 150ms
  base: 0.25, // 250ms
  slow: 0.35, // 350ms
  slowest: 0.5 // 500ms
}

/**
 * Parallax layer configurations
 * 4-layer system: Back → Mid → Foreground → Highlight
 */
export const parallaxLayers = {
  // Layer 1: Deepest background - very slow movement
  back: {
    speed: 0.15, // 15% scroll rate
    scrollRange: [0, 2000],
    translateRange: [0, 150],
    opacityRange: [0.35, 0.08]
  },

  // Layer 2: Mid layer - slow parallax for scenery
  mid: {
    speed: 0.1, // 10% scroll rate
    scrollRange: [0, 2000],
    translateRange: [0, 100],
    opacityRange: [0.25, 0.05]
  },

  // Layer 3: Foreground layer - minimal movement
  front: {
    speed: 0.05, // 5% scroll rate
    scrollRange: [0, 2000],
    translateRange: [0, 50],
    opacityRange: [0.15, 0.02]
  },

  // Layer 4: Highlight layer - ultra-subtle glow effects
  highlight: {
    speed: 0.08, // 8% scroll rate
    scrollRange: [0, 2000],
    translateRange: [0, 80],
    opacityRange: [0.12, 0.01]
  }
}

/**
 * Section-specific parallax moods
 */
export const parallaxMoods = {
  default: {
    intensity: 1.0, // normal motion
    colors: {
      light: {
        primary: 'rgba(45, 134, 89, 0.04)',
        secondary: 'rgba(45, 134, 89, 0.02)',
        accent: 'rgba(77, 167, 122, 0.03)'
      },
      dark: {
        primary: 'rgba(77, 167, 122, 0.06)',
        secondary: 'rgba(77, 167, 122, 0.03)',
        accent: 'rgba(102, 184, 142, 0.04)'
      }
    }
  },

  detections: {
    intensity: 1.2, // slightly more intense
    colors: {
      light: {
        primary: 'rgba(45, 134, 89, 0.05)',
        secondary: 'rgba(255, 212, 59, 0.02)',
        accent: 'rgba(77, 167, 122, 0.04)'
      },
      dark: {
        primary: 'rgba(77, 167, 122, 0.08)',
        secondary: 'rgba(255, 212, 59, 0.03)',
        accent: 'rgba(102, 184, 142, 0.05)'
      }
    }
  },

  analytics: {
    intensity: 0.8, // cooler, more subdued
    colors: {
      light: {
        primary: 'rgba(77, 171, 247, 0.04)',
        secondary: 'rgba(45, 134, 89, 0.02)',
        accent: 'rgba(51, 154, 240, 0.03)'
      },
      dark: {
        primary: 'rgba(77, 171, 247, 0.06)',
        secondary: 'rgba(77, 167, 122, 0.03)',
        accent: 'rgba(116, 192, 252, 0.04)'
      }
    }
  },

  history: {
    intensity: 0.9, // neutral
    colors: {
      light: {
        primary: 'rgba(108, 117, 125, 0.04)',
        secondary: 'rgba(45, 134, 89, 0.02)',
        accent: 'rgba(173, 181, 189, 0.03)'
      },
      dark: {
        primary: 'rgba(139, 148, 158, 0.06)',
        secondary: 'rgba(77, 167, 122, 0.03)',
        accent: 'rgba(110, 118, 129, 0.04)'
      }
    }
  }
}

/**
 * Panel entrance animations - staggered motion
 */
export const panelAnimations = {
  // Card/panel fade in with subtle scale
  fadeInUp: {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.99
    },
    transition: {
      duration: durations.slow,
      ease: easings.smooth
    }
  },

  // Stagger container for lists
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08, // 80ms between children
        delayChildren: 0.05 // 50ms initial delay
      }
    }
  },

  // Individual stagger items
  staggerItem: {
    initial: {
      opacity: 0,
      y: 12,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: durations.base,
        ease: easings.smooth
      }
    }
  },

  // Slide in from side
  slideInRight: {
    initial: {
      opacity: 0,
      x: 30
    },
    animate: {
      opacity: 1,
      x: 0
    },
    transition: {
      duration: durations.slow,
      ease: easings.smooth
    }
  },

  // Subtle scale-fade for metrics
  scaleIn: {
    initial: {
      opacity: 0,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      scale: 1
    },
    transition: {
      duration: durations.base,
      ease: easings.subtle
    }
  }
}

/**
 * Page transition animations
 */
export const pageTransitions = {
  initial: {
    opacity: 0,
    y: 8
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -8
  },
  transition: {
    duration: durations.base,
    ease: easings.smooth
  }
}

/**
 * Reduced motion variants
 * Simplified animations for accessibility
 */
export const reducedMotionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: durations.fast }
  }
}

/**
 * Hook to get motion variants based on user preference
 */
export const getMotionVariants = (prefersReducedMotion, variantName) => {
  if (prefersReducedMotion) {
    return reducedMotionVariants.fadeIn
  }
  return panelAnimations[variantName] || panelAnimations.fadeInUp
}
