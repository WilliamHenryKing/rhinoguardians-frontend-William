import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMap, FiClock, FiBarChart2, FiShield, FiMenu, FiX } from 'react-icons/fi'

export default function Navigation({ currentPage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const toggleRef = useRef(null)
  const focusableRefs = useRef([])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiMap },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
  ]

  useEffect(() => {
    if (!menuOpen) {
      focusableRefs.current = []
      return
    }

    const focusable = focusableRefs.current.filter(Boolean)

    const focusFirstItem = () => {
      if (focusable.length > 0) {
        focusable[0].focus()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        toggleRef.current?.focus()
        return
      }

      if (event.key === 'Tab' && focusable.length) {
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement

        if (event.shiftKey) {
          if (!menuRef.current?.contains(active) || active === first) {
            event.preventDefault()
            last.focus()
          }
        } else if (active === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    const handleFocusIn = (event) => {
      if (
        !menuRef.current?.contains(event.target) &&
        !toggleRef.current?.contains(event.target)
      ) {
        setMenuOpen(false)
      }
    }

    const handlePointerDown = (event) => {
      if (
        !menuRef.current?.contains(event.target) &&
        !toggleRef.current?.contains(event.target)
      ) {
        setMenuOpen(false)
      }
    }

    const frame = requestAnimationFrame(focusFirstItem)

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [currentPage])

  const handleNavigate = (pageId) => {
    onNavigate(pageId)
    setMenuOpen(false)
  }

  const assignFocusableRef = (index) => (element) => {
    focusableRefs.current[index] = element ?? null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4 py-3 [container-type:inline-size]">
        <div className="flex flex-col gap-3 @container/md:flex-row @container/md:items-center @container/md:justify-between">
          <div className="flex items-center justify-between gap-3">
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

            <motion.button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="md:hidden relative flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-slate-200 transition data-[open=true]:border-emerald-500/30 data-[open=true]:bg-emerald-500/10"
              data-open={menuOpen}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
            >
              {menuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </motion.button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
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

        <div className="md:hidden" data-open={menuOpen}>
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                key="mobile-navigation"
                ref={menuRef}
                id="mobile-navigation"
                data-open={menuOpen}
                initial={{ height: 0, opacity: 0, y: -12 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 240, damping: 28 }}
                className="origin-top overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-lg backdrop-blur data-[open=true]:mt-2 data-[open=true]:border-emerald-500/30 data-[open=true]:shadow-navigation"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-emerald-300">System Active</span>
                  </div>

                  <div className="flex flex-col gap-2" role="menu">
                    {navItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = currentPage === item.id

                      return (
                        <motion.button
                          key={item.id}
                          ref={assignFocusableRef(index)}
                          type="button"
                          role="menuitem"
                          onClick={() => handleNavigate(item.id)}
                          className={'relative flex w-full items-center gap-3 rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors ' + (isActive ? 'text-white' : 'text-slate-300 hover:text-white')}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>

                          {isActive && (
                            <motion.div
                              layoutId="activeTabMobile"
                              className="pointer-events-none absolute inset-0 -z-10 rounded-xl border border-emerald-500/40 bg-emerald-600/15"
                              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-3 pb-[env(safe-area-inset-bottom)] text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      toggleRef.current?.focus()
                    }}
                    className="text-xs font-medium uppercase tracking-wide text-slate-400 transition hover:text-slate-200"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}
