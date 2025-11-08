/**
 * Alert Ranger Service
 *
 * Centralized API abstraction layer for all Alert Ranger operations.
 * All alert-related API calls MUST go through this service.
 *
 * Backend Contract (frontend expectations):
 * - POST /alerts/trigger - Trigger new alert
 * - GET /alerts - Fetch all alerts
 * - GET /alerts/{id} - Fetch single alert
 * - GET /rangers/positions - Fetch ranger positions (optional)
 */

import api from '../api/client'
import {
  AlertStatus,
  AlertSeverity,
  deriveAlertType,
  deriveAlertSeverity,
  deriveAlertSource,
  generateAlertId
} from '../types/alert'

/**
 * Feature flags for graceful degradation
 */
const FEATURES = {
  ALERTS_ENABLED: true,        // Set to false to disable alert creation
  RANGER_POSITIONS: false,     // Set to true when backend supports ranger positions
  REAL_TIME_UPDATES: true      // Polling enabled
}

/**
 * Trigger a new ranger alert from a detection
 *
 * @param {Object} detection - The detection object
 * @param {Object} overrides - Optional overrides for alert properties
 * @returns {Promise<Object>} The created alert object
 */
export const triggerAlert = async (detection, overrides = {}) => {
  if (!FEATURES.ALERTS_ENABLED) {
    throw new Error('Alert system is currently disabled')
  }

  if (!detection || !detection.id) {
    throw new Error('Invalid detection object')
  }

  // Build alert payload
  const payload = {
    detection_id: detection.id,
    type: overrides.type || deriveAlertType(detection.class_name),
    severity: overrides.severity || deriveAlertSeverity(detection),
    source: overrides.source || deriveAlertSource(detection),
    notes: overrides.notes || '',
    location: {
      lat: detection.gps_lat,
      lng: detection.gps_lng,
      zoneLabel: overrides.zoneLabel || null
    },
    // Frontend metadata (for optimistic UI)
    createdBy: overrides.createdBy || 'Operator 1'
  }

  try {
    console.log('[AlertRangerService] Triggering alert:', payload)

    const response = await api.post('/alerts/trigger', payload)

    // Backend should return full alert object
    const alert = normalizeAlert(response.data)

    console.log('[AlertRangerService] Alert created:', alert)
    return alert
  } catch (error) {
    console.error('[AlertRangerService] Failed to trigger alert:', error)

    // Check if backend is not implemented
    if (error.message.includes('404') || error.message.includes('No response')) {
      // Return mock alert for development/demo
      console.warn('[AlertRangerService] Backend not available, creating local mock alert')
      return createMockAlert(detection, overrides)
    }

    throw error
  }
}

/**
 * Fetch all alerts with optional filters
 *
 * @param {Object} filters - Query filters (status, limit, etc.)
 * @returns {Promise<Array>} List of alerts
 */
export const fetchAlerts = async (filters = {}) => {
  try {
    const params = {
      limit: filters.limit || 50,
      status: filters.status || null
    }

    console.log('[AlertRangerService] Fetching alerts:', params)

    const response = await api.get('/alerts', { params })

    // Normalize response
    const alerts = (response.data.alerts || response.data || []).map(normalizeAlert)

    console.log('[AlertRangerService] Fetched alerts:', alerts.length)
    return alerts
  } catch (error) {
    console.error('[AlertRangerService] Failed to fetch alerts:', error)

    // Graceful degradation
    if (error.message.includes('404') || error.message.includes('No response')) {
      console.warn('[AlertRangerService] Backend not available, returning empty list')
      return []
    }

    throw error
  }
}

/**
 * Fetch a single alert by ID
 *
 * @param {string} alertId - Alert ID
 * @returns {Promise<Object>} Alert object
 */
export const fetchAlertById = async (alertId) => {
  try {
    console.log('[AlertRangerService] Fetching alert:', alertId)

    const response = await api.get(`/alerts/${alertId}`)

    const alert = normalizeAlert(response.data)

    console.log('[AlertRangerService] Fetched alert:', alert)
    return alert
  } catch (error) {
    console.error('[AlertRangerService] Failed to fetch alert:', error)
    throw error
  }
}

/**
 * Fetch ranger positions (optional feature)
 *
 * @returns {Promise<Array>} List of ranger positions
 */
export const fetchRangerPositions = async () => {
  if (!FEATURES.RANGER_POSITIONS) {
    console.log('[AlertRangerService] Ranger positions feature disabled')
    return []
  }

  try {
    console.log('[AlertRangerService] Fetching ranger positions')

    const response = await api.get('/rangers/positions')

    const positions = response.data.rangers || response.data || []

    console.log('[AlertRangerService] Fetched ranger positions:', positions.length)
    return positions
  } catch (error) {
    console.error('[AlertRangerService] Failed to fetch ranger positions:', error)

    // Graceful degradation
    if (error.message.includes('404')) {
      console.warn('[AlertRangerService] Ranger positions endpoint not implemented')
      return []
    }

    return []
  }
}

/**
 * Normalize alert object from backend to frontend format
 *
 * Ensures consistent structure regardless of backend response shape
 */
const normalizeAlert = (rawAlert) => {
  return {
    id: rawAlert.id || rawAlert.alert_id || generateAlertId(),
    detectionId: rawAlert.detection_id || rawAlert.detectionId,
    source: rawAlert.source || 'camera_trap',
    type: rawAlert.type || 'unknown_threat',
    severity: rawAlert.severity || 'medium',
    status: rawAlert.status || AlertStatus.SENT,
    location: {
      lat: rawAlert.location?.lat || rawAlert.gps_lat,
      lng: rawAlert.location?.lng || rawAlert.gps_lng,
      zoneLabel: rawAlert.location?.zoneLabel || rawAlert.zone_label || null
    },
    createdAt: rawAlert.created_at || rawAlert.createdAt || new Date().toISOString(),
    updatedAt: rawAlert.updated_at || rawAlert.updatedAt || new Date().toISOString(),
    createdBy: rawAlert.created_by || rawAlert.createdBy || 'Unknown',
    notes: rawAlert.notes || '',
    deliveryChannelStatus: rawAlert.delivery_channel_status || rawAlert.deliveryChannelStatus || [],
    // Optional fields
    acknowledgedAt: rawAlert.acknowledged_at || rawAlert.acknowledgedAt || null,
    resolvedAt: rawAlert.resolved_at || rawAlert.resolvedAt || null,
    rangerAssigned: rawAlert.ranger_assigned || rawAlert.rangerAssigned || null
  }
}

/**
 * Create a mock alert for development when backend is unavailable
 *
 * This allows the frontend to function with full UI/UX even without backend
 */
const createMockAlert = (detection, overrides = {}) => {
  const alertId = generateAlertId()

  return {
    id: alertId,
    detectionId: detection.id,
    source: overrides.source || deriveAlertSource(detection),
    type: overrides.type || deriveAlertType(detection.class_name),
    severity: overrides.severity || deriveAlertSeverity(detection),
    status: AlertStatus.SENT,
    location: {
      lat: detection.gps_lat,
      lng: detection.gps_lng,
      zoneLabel: overrides.zoneLabel || null
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: overrides.createdBy || 'Operator 1',
    notes: overrides.notes || '',
    deliveryChannelStatus: ['sms_pending'],
    acknowledgedAt: null,
    resolvedAt: null,
    rangerAssigned: null,
    _isMock: true // Flag for debugging
  }
}

/**
 * Check if alert feature is enabled
 */
export const isAlertFeatureEnabled = () => FEATURES.ALERTS_ENABLED

/**
 * Check if ranger positions are available
 */
export const isRangerPositionsEnabled = () => FEATURES.RANGER_POSITIONS

/**
 * Enable/disable features (for testing/configuration)
 */
export const setFeatureFlag = (feature, enabled) => {
  if (feature in FEATURES) {
    FEATURES[feature] = enabled
    console.log(`[AlertRangerService] Feature ${feature} set to ${enabled}`)
  }
}
