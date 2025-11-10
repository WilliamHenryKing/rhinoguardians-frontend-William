import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navigation from './components/Navigation'
import AlertNotification from './components/AlertNotification'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Analytics from './pages/Analytics'
import { AlertRangerProvider } from './context/AlertRangerContext'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [alerts, setAlerts] = useState([])

  const addAlert = (alert) => {
    setAlerts((prev) => [...prev, { ...alert, id: Date.now() + Math.random() }])
  }

  const removeAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onAlert={addAlert} />
      case 'history':
        return <History onAlert={addAlert} />
      case 'analytics':
        return <Analytics onAlert={addAlert} />
      default:
        return <Dashboard onAlert={addAlert} />
    }
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  }

  return (
    <AlertRangerProvider>
      <div className="relative min-h-screen bg-slate-950 md:bg-gradient-to-br md:from-slate-950 md:via-slate-900 md:to-emerald-950">
        {/* Animated background elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden hidden supports-[hover]:md:block">
          <div className="absolute -top-40 -right-40 w-64 h-64 lg:w-80 lg:h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-72 h-72 lg:w-96 lg:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 lg:w-96 lg:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        {/* Navigation */}
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

        {/* Main Content */}
        <main className="relative z-10 container mx-auto max-w-[1800px] flex flex-col gap-y-10 pt-24 xs:pt-20 sm:pt-24 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Alert Notifications */}
        <div className="fixed inset-x-4 bottom-[max(env(safe-area-inset-bottom),1rem)] z-50 space-y-3 max-w-lg mx-auto pointer-events-none @container/alerts [container-type:inline-size] @xs/alerts:bottom-[calc(max(env(safe-area-inset-bottom),1rem)+3.5rem)] @xs/alerts:space-y-4 sm:bottom-[max(env(safe-area-inset-bottom),1.5rem)] md:inset-auto md:top-24 md:right-6 md:left-auto md:bottom-auto md:mx-0 md:w-full md:max-w-sm lg:max-w-md">
          <AnimatePresence>
            {alerts.map((alert) => (
              <AlertNotification
                key={alert.id}
                alert={alert}
                onClose={() => removeAlert(alert.id)}
                className="pointer-events-auto"
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </AlertRangerProvider>
  )
}
