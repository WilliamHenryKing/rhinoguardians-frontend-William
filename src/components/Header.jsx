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
      className={`header ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="header-content"
        animate={{
          paddingTop: scrolled ? 'var(--space-4)' : 'var(--space-5)',
          paddingBottom: scrolled ? 'var(--space-4)' : 'var(--space-5)'
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* TOP: Brand - Full Width Centered */}
        <div className="header-brand">
          <div className="header-logo-lockup">
            <motion.div
              className="header-logo"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <MdShield size={32} />
            </motion.div>
            <div className="header-title-block">
              <h1 className="header-title">RhinoGuardians</h1>
              <p className="header-subtitle">
                Real-time Wildlife Protection Console
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Nav + Status + Theme */}
        <div className="header-bottom-row">
          {/* Nav */}
          <nav className="header-nav">
            {pages.map((page, index) => {
              const Icon = page.icon
              const isActive = currentPage === page.id
              return (
                <motion.button
                  key={page.id}
                  className={`nav-button ${isActive ? 'active' : ''}`}
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
                  <Icon className="nav-icon" size={18} />
                  <span className="nav-label">{page.label}</span>
                </motion.button>
              )
            })}
          </nav>

          {/* Status + Theme */}
          <div className="header-info">
            <motion.div
              className="status-indicator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <span className="status-dot status-online" />
              <span className="status-text">Live feed</span>
            </motion.div>

            <motion.button
              className="theme-toggle"
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
