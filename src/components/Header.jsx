import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import {
  MdDashboard,
  MdHistory,
  MdAnalytics,
  MdLightMode,
  MdDarkMode,
  MdShield
} from 'react-icons/md'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import PillRail from './PillRail'

const pages = [
  { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
  { id: 'history', label: 'History', icon: MdHistory },
  { id: 'analytics', label: 'Analytics', icon: MdAnalytics }
]

/**
 * Header - Modern responsive header following Tailwind CSS 4.1 best practices
 * - Fixed 64-72px control bar with predictable vertical rhythm
 * - Simplified animations: no scale/y transforms, subtle interactions only
 * - Consistent pill heights across nav and actions
 * - Clean mobile split: row 1 (brand + toggle), row 2 (nav)
 * - Glass/neutral gradient aligned with design system
 */
export default function Header({ currentPage, onNavigate }) {
  const { activeTheme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  // Detect scroll for header elevation effect
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20)
  })

  return (
    <header
      className={`
        sticky top-0 z-40
        bg-neutral-50/95 dark:bg-neutral-950/95
        backdrop-blur-xl
        border-b border-neutral-200/70 dark:border-white/5
        transition-shadow duration-300
        ${scrolled ? 'shadow-soft' : ''}
      `}
      style={{
        background: activeTheme === 'light'
          ? 'linear-gradient(to bottom, rgb(250 250 250 / 0.97) 0%, rgb(250 250 250 / 0.95) 100%)'
          : 'linear-gradient(to bottom, rgb(10 10 10 / 0.97) 0%, rgb(10 10 10 / 0.95) 100%)'
      }}
    >
      {/* Single row: brand + nav + actions - Fixed 64px height */}
      <div className="mx-auto max-w-[1920px] flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-16 sm:h-[68px] md:h-[70px] lg:h-[72px] xl:h-[76px]">
        {/* LEFT: Brand (never shrinks away) */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl bg-gradient-to-br from-brand-600 to-brand-700
              shadow-soft
              transition-shadow duration-200
            "
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <MdShield className="h-6 w-6 text-white" />
          </motion.div>
          <div className="leading-tight min-w-0">
            <div className="
              text-base sm:text-lg font-semibold tracking-tight
              text-neutral-900 dark:text-neutral-50
              truncate
            ">
              RhinoGuardians
            </div>
            <div className="
              text-xs text-neutral-500 dark:text-neutral-400
              hidden sm:block truncate
            ">
              Wildlife Protection
            </div>
          </div>
        </div>

        {/* CENTER: Desktop nav - Centered with flex-1 */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <PillRail
            items={pages}
            activeId={currentPage}
            onChange={onNavigate}
            size="sm"
            align="center"
            scrollable={false}
          />
        </div>

        {/* RIGHT: Status + Theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Status pill - Slimmer */}
          <div
            className="
              flex items-center gap-2
              px-3 py-1.5 rounded-full
              h-9
              bg-neutral-100/80 dark:bg-neutral-900/80
              border border-neutral-200 dark:border-neutral-800
            "
          >
            <span
              className="
                h-2 w-2 rounded-full bg-emerald-500
                shadow-[0_0_8px_rgb(16_185_129)]
                animate-pulse
              "
            />
            <span className="
              text-xs font-medium
              text-neutral-700 dark:text-neutral-300
              hidden sm:inline
            ">
              Live
            </span>
          </div>

          {/* Theme toggle - Same height as nav pills, subtle rotation only */}
          <button
            className="
              flex items-center justify-center
              h-9 w-9 rounded-full
              bg-neutral-100/80 dark:bg-neutral-900/80
              border border-neutral-200 dark:border-neutral-800
              text-neutral-600 dark:text-neutral-400
              hover:text-neutral-900 dark:hover:text-neutral-50
              hover:bg-neutral-200 dark:hover:bg-neutral-800
              hover:border-neutral-300 dark:hover:border-neutral-700
              transition-all duration-200
              focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2
            "
            onClick={toggleTheme}
            aria-label={`Switch to ${activeTheme === 'light' ? 'dark' : 'light'} mode`}
          >
            {activeTheme === 'light' ? (
              <MdDarkMode className="h-5 w-5" />
            ) : (
              <MdLightMode className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav: Second row, scrollable pills */}
      <div className="md:hidden border-t border-neutral-200/70 dark:border-white/5 px-4 py-3">
        <PillRail
          items={pages}
          activeId={currentPage}
          onChange={onNavigate}
          size="sm"
          align="left"
          scrollable={true}
        />
      </div>
    </header>
  )
}
