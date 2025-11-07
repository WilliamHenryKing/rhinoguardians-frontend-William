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

export default function Header({ currentPage, onNavigate }) {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  // Detect scroll for header elevation effect
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 20) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  })

  return (
    <motion.header
      className={`
        sticky top-0 z-[1100]
        bg-[var(--color-bg-secondary)]
        border-b border-[var(--color-border)]
        transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]
        backdrop-blur-[10px]
        ${scrolled ? 'shadow-[var(--shadow-xl)]' : 'shadow-[var(--shadow-md)]'}
      `}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="
          max-w-[1600px] mx-auto
          px-2 py-3
          sm:px-3 sm:py-3
          md:px-4 md:py-4
          lg:px-5 lg:py-5
          xl:px-6 xl:py-5
          flex flex-col items-center
          gap-3
          md:gap-4
          lg:gap-5
        "
        animate={{
          paddingTop: scrolled ? 'var(--space-3)' : 'var(--space-4)',
          paddingBottom: scrolled ? 'var(--space-3)' : 'var(--space-4)'
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* TOP: Brand - Full Width Centered */}
        <div className="w-full flex justify-center items-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
            <motion.div
              className="
                w-8 h-8
                sm:w-9 sm:h-9
                md:w-10 md:h-10
                lg:w-12 lg:h-12
                xl:w-14 xl:h-14
                rounded-lg lg:rounded-xl
                flex items-center justify-center
                bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)]
                shadow-[var(--shadow-md)]
                flex-shrink-0 relative overflow-hidden
                transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                hover:scale-105 hover:shadow-[var(--shadow-lg)]
                before:content-[''] before:absolute before:inset-0
                before:bg-gradient-to-br before:from-white/20 before:to-transparent
                before:opacity-0 before:transition-opacity before:duration-[150ms]
                hover:before:opacity-100
              "
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <MdShield className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-white" />
            </motion.div>
            <div className="flex flex-col gap-0.5 items-center text-center">
              <h1 className="
                text-base leading-tight
                sm:text-lg
                md:text-xl
                lg:text-2xl
                xl:text-3xl
                font-extrabold tracking-tight
                text-[var(--color-text-primary)]
                whitespace-nowrap
              ">
                RhinoGuardians
              </h1>
              <p className="
                text-[10px] leading-tight
                sm:text-xs
                md:text-xs
                lg:text-sm
                font-medium
                text-[var(--color-text-secondary)]
                whitespace-nowrap
                hidden sm:block
              ">
                Real-time Wildlife Protection Console
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Nav + Status + Theme */}
        <div className="
          w-full flex items-center justify-between
          gap-2
          md:gap-3
          lg:gap-4
          px-0
          sm:px-1
          md:px-2
          lg:px-3
          xl:px-4
        ">
          {/* Nav */}
          <nav className="
            flex items-center justify-center
            gap-0
            sm:gap-0.5
            md:gap-1
            flex-1
          ">
            {pages.map((page, index) => {
              const Icon = page.icon
              const isActive = currentPage === page.id
              return (
                <motion.button
                  key={page.id}
                  className={`
                    inline-flex items-center justify-center
                    gap-1 sm:gap-1.5 md:gap-2
                    px-2 py-2
                    sm:px-2 sm:py-2
                    md:px-3 md:py-2
                    lg:px-4 lg:py-2
                    xl:px-5 xl:py-2
                    rounded-full
                    border-none
                    text-xs
                    sm:text-xs
                    md:text-sm
                    font-semibold tracking-wide
                    cursor-pointer
                    transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                    relative whitespace-nowrap overflow-hidden
                    min-w-[44px] min-h-[44px]
                    sm:min-w-0 sm:min-h-0
                    focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]'
                        : 'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                    }
                  `}
                  onClick={() => onNavigate(page.id)}
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <Icon className="
                    w-5 h-5
                    sm:w-4 sm:h-4
                    md:w-[18px] md:h-[18px]
                    lg:w-5 lg:h-5
                    flex-shrink-0 relative z-[1]
                  " />
                  <span className="
                    hidden
                    sm:inline
                    relative z-[1]
                  ">
                    {page.label}
                  </span>
                </motion.button>
              )
            })}
          </nav>

          {/* Status + Theme */}
          <div className="
            flex items-center
            gap-2
            md:gap-3
            lg:gap-4
            flex-shrink-0
          ">
            <motion.div
              className="
                inline-flex items-center
                gap-1 sm:gap-1.5 md:gap-2
                px-1 py-1
                sm:px-2 sm:py-2
                md:px-3 md:py-2
                rounded-full
                bg-[var(--color-bg-tertiary)]
                text-xs
                sm:text-xs
                md:text-sm
                font-semibold
                text-[var(--color-text-secondary)]
                border border-[var(--color-border)]
                min-w-[44px] min-h-[44px]
                justify-center
                sm:min-w-0 sm:min-h-0
                sm:justify-start
              "
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <span className="
                w-2 h-2
                rounded-full
                bg-[var(--color-success)]
                shadow-[0_0_8px_var(--color-success)]
                animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]
              " />
              <span className="
                whitespace-nowrap
                hidden
                sm:inline
              ">
                Live feed
              </span>
            </motion.div>

            <motion.button
              className="
                inline-flex items-center justify-center
                w-8 h-8
                sm:w-9 sm:h-9
                md:w-10 md:h-10
                rounded-md
                border border-[var(--color-border)]
                bg-[var(--color-bg-tertiary)]
                cursor-pointer
                text-base
                sm:text-lg
                md:text-xl
                text-[var(--color-text-secondary)]
                transition-all duration-[150ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                hover:bg-[var(--color-bg-hover)]
                hover:text-[var(--color-text-primary)]
                hover:border-[var(--color-border-dark)]
                active:scale-95
                min-w-[44px] min-h-[44px]
                sm:min-w-0 sm:min-h-0
                focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2
              "
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === 'light' ? 'dark' : 'light'
              } mode`}
              whileHover={{ scale: 1.08, rotate: 180 }}
              whileTap={{ scale: 0.92 }}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}
