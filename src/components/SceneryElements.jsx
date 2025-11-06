/**
 * RhinoGuardians - Scenery SVG Elements
 * Subtle savanna-inspired silhouettes for parallax layers
 * Low-contrast, professional, nature-themed backgrounds
 */

/**
 * Horizon line with subtle vegetation silhouette
 */
export function HorizonSilhouette({ opacity = 0.15, color = 'currentColor' }) {
  return (
    <svg
      width="100%"
      height="200"
      viewBox="0 0 1920 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      preserveAspectRatio="xMidYMax slice"
    >
      <path
        d="M0 100 Q 240 85, 480 95 T 960 90 T 1440 100 T 1920 95 L 1920 200 L 0 200 Z"
        fill={color}
        opacity="0.3"
      />
      <path
        d="M0 120 Q 200 110, 400 115 T 800 112 T 1200 118 T 1600 115 T 1920 120 L 1920 200 L 0 200 Z"
        fill={color}
        opacity="0.2"
      />
      {/* Distant tree silhouettes */}
      <ellipse cx="300" cy="105" rx="8" ry="25" fill={color} opacity="0.25" />
      <ellipse cx="700" cy="98" rx="6" ry="20" fill={color} opacity="0.2" />
      <ellipse cx="1100" cy="103" rx="7" ry="22" fill={color} opacity="0.22" />
      <ellipse cx="1500" cy="100" rx="9" ry="28" fill={color} opacity="0.24" />
    </svg>
  )
}

/**
 * Abstract grass/vegetation texture
 */
export function VegetationTexture({ opacity = 0.1, color = 'currentColor' }) {
  return (
    <svg
      width="100%"
      height="150"
      viewBox="0 0 1920 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      preserveAspectRatio="xMidYMax slice"
    >
      {/* Create subtle grass-like patterns */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 1920) / 40 + Math.random() * 20
        const height = 30 + Math.random() * 40
        const width = 2 + Math.random() * 3
        return (
          <rect
            key={i}
            x={x}
            y={150 - height}
            width={width}
            height={height}
            fill={color}
            opacity={0.15 + Math.random() * 0.1}
            rx={width / 2}
          />
        )
      })}
    </svg>
  )
}

/**
 * Soft circular vignette overlay
 */
export function SoftVignette({ opacity = 0.2 }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="vignette-gradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="60%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#vignette-gradient)" />
    </svg>
  )
}

/**
 * Subtle light streak effect
 */
export function LightStreak({ opacity = 0.08, color = 'currentColor', angle = 45 }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`light-streak-${angle}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="40%" stopColor={color} stopOpacity="0.3" />
          <stop offset="60%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect
        width="200"
        height="15"
        fill={`url(#light-streak-${angle})`}
        transform={`rotate(${angle} 50 50) translate(-50, 42.5)`}
      />
    </svg>
  )
}

/**
 * Acacia tree silhouette - iconic savanna tree
 */
export function AcaciaTreeSilhouette({ opacity = 0.12, color = 'currentColor', scale = 1 }) {
  return (
    <svg
      width={120 * scale}
      height={100 * scale}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Trunk */}
      <path d="M55 100 L55 60 L65 60 L65 100 Z" fill={color} opacity="0.4" />
      {/* Canopy - flat top characteristic of acacia */}
      <ellipse cx="60" cy="45" rx="45" ry="25" fill={color} opacity="0.3" />
      <ellipse cx="60" cy="35" rx="50" ry="20" fill={color} opacity="0.25" />
    </svg>
  )
}

/**
 * Abstract organic shape for depth
 */
export function OrganicShape({ opacity = 0.08, color = 'currentColor' }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <path
        d="M 20 60 Q 30 40, 50 45 T 80 50 Q 85 70, 70 80 T 30 75 Q 15 68, 20 60 Z"
        fill={color}
        opacity="0.5"
      />
    </svg>
  )
}
