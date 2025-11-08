/**
 * Alert Ranger Context
 *
 * Central state management for all ranger alerts.
 * Provides alerts data, derived collections, and control methods to all components.
 *
 * Usage:
 *   const { alerts, activeAlerts, createAlertFromDetection, refreshAlerts } = useAlertRanger()
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  triggerAlert,
  fetchAlerts,
  fetchRangerPositions,
  isAlertFeatureEnabled
} from '../services/alertRangerService'
import { ACTIVE_STATUSES, TERMINAL_STATUSES } from '../types/alert'

const AlertRangerContext = createContext(null)

/**
 * Hook to access Alert Ranger context
 */
export const useAlertRanger = () => {
  const context = useContext(AlertRangerContext)
  if (!context) {
    throw new Error('useAlertRanger must be used within AlertRangerProvider')
  }
  return context
}

/**
 * Alert Ranger Provider Component
 */
export const AlertRangerProvider = ({ children }) => {
  // Core state
  const [alerts, setAlerts] = useState([])
  const [rangerPositions, setRangerPositions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isPolling, setIsPolling] = useState(true)

  // UI state
  const [selectedAlertId, setSelectedAlertId] = useState(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)

  // Polling interval ref
  const pollingIntervalRef = useRef(null)

  /**
   * Derived collections
   */

  // Active alerts (non-terminal statuses)
  const activeAlerts = useMemo(() => {
    return alerts.filter(alert => ACTIVE_STATUSES.includes(alert.status))
  }, [alerts])

  // Recently resolved alerts (last 2 hours)
  const recentlyResolvedAlerts = useMemo(() => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    return alerts.filter(alert => {
      if (!TERMINAL_STATUSES.includes(alert.status)) return false
      const updatedAt = new Date(alert.updatedAt)
      return updatedAt >= twoHoursAgo
    })
  }, [alerts])

  // Alerts by detection ID (for fast lookup)
  const alertsByDetectionId = useMemo(() => {
    const map = new Map()
    alerts.forEach(alert => {
      if (alert.detectionId) {
        if (!map.has(alert.detectionId)) {
          map.set(alert.detectionId, [])
        }
        map.get(alert.detectionId).push(alert)
      }
    })
    return map
  }, [alerts])

  /**
   * Check if detection already has an active alert
   */
  const hasActiveAlert = useCallback((detectionId) => {
    const detectionAlerts = alertsByDetectionId.get(detectionId) || []
    return detectionAlerts.some(alert => ACTIVE_STATUSES.includes(alert.status))
  }, [alertsByDetectionId])

  /**
   * Get alerts for a specific detection
   */
  const getAlertsForDetection = useCallback((detectionId) => {
    return alertsByDetectionId.get(detectionId) || []
  }, [alertsByDetectionId])

  /**
   * Get alert by ID
   */
  const getAlertById = useCallback((alertId) => {
    return alerts.find(alert => alert.id === alertId)
  }, [alerts])

  /**
   * Create a new alert from a detection
   *
   * @param {Object} detection - Detection object
   * @param {Object} overrides - Optional overrides (type, severity, notes, etc.)
   * @returns {Promise<Object>} Created alert
   */
  const createAlertFromDetection = useCallback(async (detection, overrides = {}) => {
    if (!isAlertFeatureEnabled()) {
      throw new Error('Alert feature is currently disabled')
    }

    // Check for duplicate alerts (prevent double-triggering within 30 seconds)
    if (hasActiveAlert(detection.id)) {
      const existingAlert = getAlertsForDetection(detection.id)[0]
      console.warn('[AlertRangerContext] Active alert already exists for this detection:', existingAlert.id)

      // Check if it's within 30 seconds
      const createdAt = new Date(existingAlert.createdAt)
      const now = new Date()
      const diffSeconds = (now - createdAt) / 1000

      if (diffSeconds < 30) {
        throw new Error('An alert was already sent for this detection less than 30 seconds ago')
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      const newAlert = await triggerAlert(detection, overrides)

      // Add to state (or update if exists)
      setAlerts(prev => {
        const existingIndex = prev.findIndex(a => a.id === newAlert.id)
        if (existingIndex >= 0) {
          // Update existing
          const updated = [...prev]
          updated[existingIndex] = newAlert
          return updated
        } else {
          // Add new (most recent first)
          return [newAlert, ...prev]
        }
      })

      return newAlert
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [hasActiveAlert, getAlertsForDetection])

  /**
   * Refresh alerts from backend
   */
  const refreshAlerts = useCallback(async () => {
    try {
      const fetchedAlerts = await fetchAlerts({ limit: 50 })

      setAlerts(prev => {
        // Merge with existing, deduplicating by ID and keeping most recent
        const merged = [...fetchedAlerts]
        prev.forEach(existingAlert => {
          if (!merged.find(a => a.id === existingAlert.id)) {
            merged.push(existingAlert)
          }
        })

        // Sort by created date (most recent first)
        return merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      })

      setError(null)
    } catch (err) {
      console.error('[AlertRangerContext] Failed to refresh alerts:', err)
      setError('Failed to update alerts: ' + err.message)
    }
  }, [])

  /**
   * Refresh ranger positions
   */
  const refreshRangerPositions = useCallback(async () => {
    try {
      const positions = await fetchRangerPositions()
      setRangerPositions(positions)
    } catch (err) {
      console.error('[AlertRangerContext] Failed to refresh ranger positions:', err)
      // Don't set error state for positions (optional feature)
    }
  }, [])

  /**
   * Update a single alert's status (optimistic update + sync)
   */
  const updateAlertStatus = useCallback((alertId, partialUpdate) => {
    setAlerts(prev => {
      return prev.map(alert => {
        if (alert.id === alertId) {
          return {
            ...alert,
            ...partialUpdate,
            updatedAt: new Date().toISOString()
          }
        }
        return alert
      })
    })
  }, [])

  /**
   * Select an alert and open detail panel
   */
  const selectAlert = useCallback((alertId) => {
    setSelectedAlertId(alertId)
    setIsDetailPanelOpen(true)
  }, [])

  /**
   * Close detail panel
   */
  const closeDetailPanel = useCallback(() => {
    setIsDetailPanelOpen(false)
    // Keep selectedAlertId for a moment for animation
    setTimeout(() => setSelectedAlertId(null), 300)
  }, [])

  /**
   * Start polling for alert updates
   */
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log('[AlertRangerContext] Polling already active')
      return
    }

    console.log('[AlertRangerContext] Starting alert polling (every 10 seconds)')
    setIsPolling(true)

    // Initial fetch
    refreshAlerts()
    refreshRangerPositions()

    // Poll every 10 seconds
    pollingIntervalRef.current = setInterval(() => {
      refreshAlerts()
      refreshRangerPositions()
    }, 10000)
  }, [refreshAlerts, refreshRangerPositions])

  /**
   * Stop polling
   */
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      console.log('[AlertRangerContext] Stopping alert polling')
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
      setIsPolling(false)
    }
  }, [])

  /**
   * Subscribe to alerts (abstraction for polling/WebSocket)
   *
   * Currently implements polling, can be swapped to WebSocket later
   */
  const subscribeToAlerts = useCallback(() => {
    startPolling()

    // Return cleanup function
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  /**
   * Auto-start polling on mount
   */
  useEffect(() => {
    const unsubscribe = subscribeToAlerts()

    return () => {
      unsubscribe()
    }
  }, [subscribeToAlerts])

  /**
   * Context value
   */
  const value = {
    // State
    alerts,
    activeAlerts,
    recentlyResolvedAlerts,
    rangerPositions,
    isLoading,
    error,
    isPolling,
    selectedAlertId,
    isDetailPanelOpen,

    // Methods
    createAlertFromDetection,
    refreshAlerts,
    refreshRangerPositions,
    updateAlertStatus,
    hasActiveAlert,
    getAlertsForDetection,
    getAlertById,
    selectAlert,
    closeDetailPanel,
    subscribeToAlerts,
    startPolling,
    stopPolling
  }

  return (
    <AlertRangerContext.Provider value={value}>
      {children}
    </AlertRangerContext.Provider>
  )
}
