import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { parallaxLayers, parallaxMoods } from '../utils/motionConfig'
import {
  HorizonSilhouette,
  VegetationTexture,
  SoftVignette,
  LightStreak,
  AcaciaTreeSilhouette
} from './SceneryElements'

/**
 * Enhanced Parallax Background Effect
 * 4-layer system with section-specific moods
 * Respects reduced-motion preferences
 * Theme-aware with subtle nature-inspired imagery
 */
export default function ParallaxBackground({ section = 'default' }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const { theme } = useTheme()
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

  // Get section-specific mood
  const mood = parallaxMoods[section] || parallaxMoods.default
  const colors = theme === 'dark' ? mood.colors.dark : mood.colors.light
  const intensity = prefersReducedMotion ? 0 : mood.intensity

  // Layer 1: Deepest background - large gradients (very slow)
  const y1 = useTransform(
    scrollY,
    parallaxLayers.back.scrollRange,
    [0, parallaxLayers.back.translateRange[1] * intensity]
  )
  const opacity1 = useTransform(scrollY, [0, 400], parallaxLayers.back.opacityRange)

  // Layer 2: Mid layer - scenery silhouettes (slow)
  const y2 = useTransform(
    scrollY,
    parallaxLayers.mid.scrollRange,
    [0, parallaxLayers.mid.translateRange[1] * intensity]
  )
  const x2 = useTransform(scrollY, [0, 2000], [0, -30 * intensity])
  const opacity2 = useTransform(scrollY, [0, 500], parallaxLayers.mid.opacityRange)

  // Layer 3: Foreground layer - texture overlay (minimal)
  const y3 = useTransform(
    scrollY,
    parallaxLayers.front.scrollRange,
    [0, parallaxLayers.front.translateRange[1] * intensity]
  )
  const opacity3 = useTransform(scrollY, [0, 600], parallaxLayers.front.opacityRange)

  // Layer 4: Highlight layer - light streaks (ultra-subtle)
  const y4 = useTransform(
    scrollY,
    parallaxLayers.highlight.scrollRange,
    [0, parallaxLayers.highlight.translateRange[1] * intensity]
  )
  const x4 = useTransform(scrollY, [0, 2000], [0, 40 * intensity])
  const opacity4 = useTransform(scrollY, [0, 800], parallaxLayers.highlight.opacityRange)

  return (
    <div className="parallax-background">
      {/* Layer 1: Deep Background - Large gradient shapes */}
      <motion.div
        className="parallax-layer parallax-layer-back"
        style={{ y: y1, opacity: opacity1 }}
      >
        {/* Main radial gradient - top left */}
        <div
          className="gradient-orb gradient-orb-1"
          style={{
            background: `radial-gradient(circle at 20% 30%, ${colors.primary} 0%, transparent 60%)`
          }}
        />

        {/* Secondary gradient - bottom right */}
        <div
          className="gradient-orb gradient-orb-2"
          style={{
            background: `radial-gradient(circle at 80% 70%, ${colors.secondary} 0%, transparent 50%)`
          }}
        />

        {/* Tertiary gradient - center */}
        <div
          className="gradient-orb gradient-orb-3"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${colors.accent} 0%, transparent 70%)`
          }}
        />

        {/* Soft vignette overlay */}
        <div
          className="vignette-overlay"
          style={{ color: theme === 'dark' ? '#0d1117' : '#f8f9fa' }}
        >
          <SoftVignette opacity={0.3} />
        </div>
      </motion.div>

      {/* Layer 2: Mid Layer - Scenery silhouettes */}
      <motion.div
        className="parallax-layer parallax-layer-mid"
        style={{ y: y2, x: x2, opacity: opacity2 }}
      >
        {/* Horizon with distant trees */}
        <div
          className="horizon-layer"
          style={{
            color: theme === 'dark' ? 'rgba(77, 167, 122, 0.15)' : 'rgba(45, 134, 89, 0.12)'
          }}
        >
          <HorizonSilhouette />
        </div>

        {/* Scattered acacia trees */}
        <div className="acacia-trees">
          <div style={{ position: 'absolute', left: '15%', bottom: '25%' }}>
            <AcaciaTreeSilhouette
              opacity={0.08}
              color={theme === 'dark' ? '#4da77a' : '#2d8659'}
              scale={0.8}
            />
          </div>
          <div style={{ position: 'absolute', right: '20%', bottom: '30%' }}>
            <AcaciaTreeSilhouette
              opacity={0.1}
              color={theme === 'dark' ? '#4da77a' : '#2d8659'}
              scale={1.0}
            />
          </div>
          <div style={{ position: 'absolute', left: '60%', bottom: '22%' }}>
            <AcaciaTreeSilhouette
              opacity={0.06}
              color={theme === 'dark' ? '#4da77a' : '#2d8659'}
              scale={0.6}
            />
          </div>
        </div>

        {/* Vegetation texture at bottom */}
        <div
          className="vegetation-layer"
          style={{
            color: theme === 'dark' ? 'rgba(77, 167, 122, 0.12)' : 'rgba(45, 134, 89, 0.1)'
          }}
        >
          <VegetationTexture />
        </div>
      </motion.div>

      {/* Layer 3: Foreground - Subtle gradient overlay */}
      <motion.div
        className="parallax-layer parallax-layer-front"
        style={{ y: y3, opacity: opacity3 }}
      >
        {/* Bottom gradient fade */}
        <div
          className="gradient-fade"
          style={{
            background: `linear-gradient(to top, ${colors.primary} 0%, transparent 100%)`
          }}
        />

        {/* Top gradient fade */}
        <div
          className="gradient-fade-top"
          style={{
            background: `linear-gradient(to bottom, ${colors.secondary} 0%, transparent 100%)`
          }}
        />
      </motion.div>

      {/* Layer 4: Highlight - Ultra-subtle light streaks */}
      <motion.div
        className="parallax-layer parallax-layer-highlight"
        style={{ y: y4, x: x4, opacity: opacity4 }}
      >
        {/* Diagonal light streak 1 */}
        <div className="light-streak light-streak-1">
          <LightStreak
            opacity={0.15}
            color={theme === 'dark' ? 'rgba(102, 184, 142, 0.4)' : 'rgba(77, 167, 122, 0.3)'}
            angle={35}
          />
        </div>

        {/* Diagonal light streak 2 */}
        <div className="light-streak light-streak-2">
          <LightStreak
            opacity={0.1}
            color={theme === 'dark' ? 'rgba(77, 167, 122, 0.3)' : 'rgba(61, 143, 104, 0.25)'}
            angle={-25}
          />
        </div>
      </motion.div>
    </div>
  )
}
