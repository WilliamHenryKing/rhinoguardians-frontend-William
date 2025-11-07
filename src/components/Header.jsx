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

const pages = [
  { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
  { id: 'history', label: 'History', icon: MdHistory },
  { id: 'analytics', label: 'Analytics', icon: MdAnalytics }
]

/**
 * Header - Modern responsive header following Tailwind CSS 4.1 best practices
 * - Single compact row with proper vertical spacing (py-2 to py-3)
 * - Touch-optimized with pointer-* variants
 * - Fixed empty white bar issue with proper layout structure
 * - Three zones: Brand (never hidden) | Nav (center) | Actions (right)
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
        bg-neutral-50/95 dark:bg-neutral-950/92
        backdrop-blur-sm
        border-b border-neutral-200/70 dark:border-white/5
        transition-shadow duration-300
        ${scrolled ? 'shadow-xl shadow-black/5 dark:shadow-black/30' : 'shadow-md shadow-black/5 dark:shadow-black/20'}
      `}
    >
      {/* Single row: brand + nav + actions */}
      <div className="mx-auto max-w-[1920px] flex items-center justify-between gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-5 lg:py-6">
        {/* LEFT: Brand (never shrinks away) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 min-w-0">
          <motion.div
            className="
              flex h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center
              rounded-2xl bg-emerald-700
              shadow-md shadow-emerald-700/20
              hover:shadow-lg hover:shadow-emerald-700/30
              transition-all duration-200
            "
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <MdShield className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
          </motion.div>
          <div className="leading-tight">
            <div className="
              text-base sm:text-lg lg:text-xl font-semibold tracking-tight
              text-neutral-900 dark:text-neutral-50
              truncate
            ">
              RhinoGuardians
            </div>
            <div className="
              text-xs sm:text-sm text-neutral-500 dark:text-neutral-400
              hidden sm:block
            ">
              Real-time Wildlife Protection Console
            </div>
          </div>
        </div>

        {/* CENTER: Desktop nav */}
        <nav className="
          hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4
          text-sm lg:text-base font-medium text-neutral-500
        ">
          {pages.map((page, index) => {
            const Icon = page.icon
            const isActive = currentPage === page.id
            return (
              <motion.button
                key={page.id}
                className={`
                  inline-flex items-center gap-2 lg:gap-2.5
                  px-5 py-2.5 lg:px-6 lg:py-3 xl:px-7 xl:py-3.5 rounded-full
                  transition-all duration-200
                  pointer-fine:px-5 pointer-fine:py-2.5 lg:pointer-fine:px-6 lg:pointer-fine:py-3
                  pointer-coarse:px-6 pointer-coarse:py-3.5
                  focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2
                  ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 hover:shadow-lg'
                      : 'bg-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-50'
                  }
                `}
                onClick={() => onNavigate(page.id)}
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Icon className="h-[18px] w-[18px] lg:h-5 lg:w-5 flex-shrink-0" />
                <span>{page.label}</span>
              </motion.button>
            )
          })}
        </nav>

        {/* RIGHT: Status + Theme toggle */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          <motion.div
            className="
              flex items-center gap-2 lg:gap-2.5
              px-3 py-2 lg:px-4 lg:py-2.5 rounded-full
              bg-neutral-100 dark:bg-neutral-900
              border border-neutral-200 dark:border-neutral-800
              pointer-coarse:px-4 pointer-coarse:py-2.5
            "
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span
              className="
                h-2 w-2 lg:h-2.5 lg:w-2.5 rounded-full bg-emerald-500
                shadow-[0_0_8px_rgb(16_185_129)]
                animate-pulse
              "
            />
            <span className="
              text-xs lg:text-sm font-medium
              text-neutral-700 dark:text-neutral-300
              hidden sm:inline
            ">
              Live feed
            </span>
          </motion.div>

          <motion.button
            className="
              flex items-center justify-center
              h-11 w-11 lg:h-12 lg:w-12 xl:h-14 xl:w-14 rounded-xl lg:rounded-2xl
              bg-neutral-100 dark:bg-neutral-900
              border border-neutral-200 dark:border-neutral-800
              text-neutral-500 dark:text-neutral-400
              hover:text-neutral-900 dark:hover:text-neutral-50
              hover:bg-neutral-200 dark:hover:bg-neutral-800
              hover:border-neutral-300 dark:hover:border-neutral-700
              active:scale-95
              transition-all duration-200
              pointer-coarse:h-12 pointer-coarse:w-12
              focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2
            "
            onClick={toggleTheme}
            aria-label={`Switch to ${activeTheme === 'light' ? 'dark' : 'light'} mode`}
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {activeTheme === 'light' ? (
              <MdDarkMode className="h-5 w-5 lg:h-6 lg:w-6" />
            ) : (
              <MdLightMode className="h-5 w-5 lg:h-6 lg:w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile nav: keeps logo visible, avoids tall whitespace */}
      <nav className="
        md:hidden border-t border-neutral-200/70 dark:border-white/5
      ">
        <div className="
          flex gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4
          overflow-x-auto no-scrollbar
          text-sm sm:text-base font-medium text-neutral-600 dark:text-neutral-400
          touch-pan-x
        ">
          {pages.map((page) => {
            const Icon = page.icon
            const isActive = currentPage === page.id
            return (
              <button
                key={page.id}
                className={`
                  inline-flex items-center gap-2 sm:gap-2.5
                  px-4 py-2.5 sm:px-5 sm:py-3 rounded-full whitespace-nowrap
                  transition-all duration-200
                  pointer-coarse:px-5 pointer-coarse:py-3.5
                  min-h-[44px] pointer-fine:min-h-0
                  ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }
                `}
                onClick={() => onNavigate(page.id)}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>{page.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
