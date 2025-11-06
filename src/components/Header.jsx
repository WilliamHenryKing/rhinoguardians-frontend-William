import { useTheme } from '../context/ThemeContext'
import { MdDashboard, MdHistory, MdAnalytics, MdLightMode, MdDarkMode } from 'react-icons/md'
import { motion } from 'framer-motion'

export default function Header({ currentPage, onNavigate }) {
  const { theme, toggleTheme } = useTheme()

  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
    { id: 'history', label: 'History', icon: MdHistory },
    { id: 'analytics', label: 'Analytics', icon: MdAnalytics }
  ]

  return (
    <header className="header">
      <div className="header-content">
        <motion.div
          className="header-brand"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>🦏 RhinoGuardians</h1>
          <p className="header-subtitle">Real-Time Wildlife Detection Dashboard</p>
        </motion.div>

        <div className="header-info">
          <motion.div
            className="status-indicator"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="status-dot status-online"></span>
            <span className="status-text">Live</span>
          </motion.div>

          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'light' ? <MdDarkMode /> : <MdLightMode />}
            </motion.div>
          </motion.button>
        </div>

        <nav className="header-nav">
          {pages.map((page, index) => {
            const Icon = page.icon
            return (
              <motion.button
                key={page.id}
                className={`nav-button ${currentPage === page.id ? 'active' : ''}`}
                onClick={() => onNavigate(page.id)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={page.label}
              >
                <Icon className="nav-icon" size={20} />
                <span className="nav-label">{page.label}</span>
              </motion.button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
