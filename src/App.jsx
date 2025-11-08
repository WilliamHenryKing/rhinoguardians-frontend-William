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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>

        {/* Navigation */}
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

        {/* Main Content */}
        <main className="relative z-10 pt-20 px-4 pb-8">
          <div className="max-w-[1800px] mx-auto">
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
          </div>
        </main>

        {/* Alert Notifications */}
        <div className="fixed top-24 right-4 z-50 space-y-3 max-w-md">
          <AnimatePresence>
            {alerts.map((alert) => (
              <AlertNotification
                key={alert.id}
                alert={alert}
                onClose={() => removeAlert(alert.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </AlertRangerProvider>
  )
}
