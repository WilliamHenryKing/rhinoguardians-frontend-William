import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Subtle Parallax Background Effect
 * Respects reduced-motion preferences
 * Provides layered background with minimal distraction
 */
export default function ParallaxBackground() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const { scrollY } = useScroll()

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Subtle parallax transforms (conservative values)
  const y1 = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 150])
  const y2 = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 100])
  const opacity = useTransform(scrollY, [0, 300], [0.4, 0.1])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Layer 1 - Deepest */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '120%',
          height: '120%',
          background:
            'radial-gradient(circle at 20% 30%, rgba(45, 134, 89, 0.03) 0%, transparent 50%)',
          y: y1,
          opacity
        }}
      />

      {/* Layer 2 - Middle */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-5%',
          right: '-10%',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at 80% 60%, rgba(45, 134, 89, 0.02) 0%, transparent 40%)',
          y: y2,
          opacity
        }}
      />

      {/* Subtle gradient overlay */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '40%',
          background:
            'linear-gradient(to top, rgba(45, 134, 89, 0.01) 0%, transparent 100%)',
          opacity
        }}
      />
    </div>
  )
}
