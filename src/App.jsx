import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import AlertNotification from './components/AlertNotification'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Analytics from './pages/Analytics'

/**
 * Main Application Component
 * Manages routing between different pages and global alert state
 *
 * Note: Currently using simple state-based routing instead of React Router
 * to minimize dependencies. For production, consider using React Router.
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [alerts, setAlerts] = useState([])

  /**
   * Add a new alert to the notification stack
   * Called by child components when important events occur
   */
  const addAlert = (alert) => {
    setAlerts((prev) => [...prev, alert])
  }

  /**
   * Remove an alert from the notification stack
   * Called when user dismisses or alert auto-closes
   */
  const removeAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  /**
   * Navigate to a different page
   */
  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  /**
   * Render the current page based on state
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onAlert={addAlert} />
      case 'history':
        return <History />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard onAlert={addAlert} />
    }
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="app-main">
        {renderPage()}
      </main>

      {/* Alert Notifications Container */}
      <div className="alerts-container">
        {alerts.map((alert) => (
          <AlertNotification
            key={alert.id}
            alert={alert}
            onClose={removeAlert}
            autoClose={5000}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * BACKEND INTEGRATION NOTES:
 *
 * When the backend is ready, replace the mock data imports in the page components:
 *
 * 1. In src/pages/Dashboard.jsx:
 *    - Replace: import { getMockDetections } from '../api/mockData'
 *    - With: import { fetchDetections } from '../api/client'
 *    - Update the API calls accordingly
 *
 * 2. In src/pages/History.jsx:
 *    - Replace: import { getMockDetections } from '../api/mockData'
 *    - With: import { fetchDetections } from '../api/client'
 *
 * 3. In src/pages/Analytics.jsx:
 *    - Replace: import { getMockAnalytics, getMockDetections } from '../api/mockData'
 *    - With: import { fetchDetections, fetchAnalytics } from '../api/client'
 *    - Add fetchAnalytics endpoint to src/api/client.js
 *
 * 4. Update src/api/client.js:
 *    - Uncomment production API calls
 *    - Set correct VITE_API_URL in .env files
 *    - Test all endpoints with real backend
 */
