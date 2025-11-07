import { motion } from 'framer-motion'
import { FiMap, FiClock, FiBarChart2, FiShield } from 'react-icons/fi'

export default function Navigation({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiMap },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiShield className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-white">RhinoGuardians</h1>
              <p className="text-xs text-emerald-400">AI Wildlife Protection</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={'relative px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ' + (isActive ? 'text-white' : 'text-slate-400 hover:text-white')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-emerald-600/20 rounded-lg border border-emerald-500/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-300 font-medium">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
