/**
 * Alert Ranger Type Definitions
 *
 * This file defines the core data structures and constants for the Alert Ranger system.
 * These types serve as the single source of truth for alert-related data across the frontend.
 */

/**
 * Alert Status States
 *
 * Lifecycle: created → sent → acknowledged → in_progress → resolved/failed/expired
 */
export const AlertStatus = {
  CREATED: 'created',           // Operator requested alert, not yet confirmed as sent
  SENT: 'sent',                 // Backend accepted & dispatched to ranger channel
  ACKNOWLEDGED: 'acknowledged', // Ranger confirmed receipt
  IN_PROGRESS: 'in_progress',   // Ranger en route / acting
  RESOLVED: 'resolved',         // Threat handled / false alarm confirmed
  FAILED: 'failed',             // Backend or delivery failure
  EXPIRED: 'expired'            // No acknowledgment within SLA
}

/**
 * Alert Severity Levels
 */
export const AlertSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Alert Source Types
 */
export const AlertSource = {
  CAMERA_TRAP: 'camera_trap',
  DRONE: 'drone',
  MANUAL: 'manual'
}

/**
 * Alert Types (threat classification)
 */
export const AlertType = {
  POACHER_SUSPECTED: 'poacher_suspected',
  VEHICLE_SUSPECTED: 'vehicle_suspected',
  RHINO_IN_DISTRESS: 'rhino_in_distress',
  UNKNOWN_THREAT: 'unknown_threat',
  HUMAN_DETECTED: 'human_detected'
}

/**
 * Terminal statuses (no further updates expected)
 */
export const TERMINAL_STATUSES = [
  AlertStatus.RESOLVED,
  AlertStatus.FAILED,
  AlertStatus.EXPIRED
]

/**
 * Active statuses (alert is ongoing)
 */
export const ACTIVE_STATUSES = [
  AlertStatus.CREATED,
  AlertStatus.SENT,
  AlertStatus.ACKNOWLEDGED,
  AlertStatus.IN_PROGRESS
]

/**
 * Status Display Configuration
 */
export const STATUS_CONFIG = {
  [AlertStatus.CREATED]: {
    label: 'Created',
    color: 'blue',
    bgClass: 'bg-blue-500/20',
    textClass: 'text-blue-300',
    borderClass: 'border-blue-500/30'
  },
  [AlertStatus.SENT]: {
    label: 'Awaiting ACK',
    color: 'yellow',
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-300',
    borderClass: 'border-yellow-500/30'
  },
  [AlertStatus.ACKNOWLEDGED]: {
    label: 'Acknowledged',
    color: 'orange',
    bgClass: 'bg-orange-500/20',
    textClass: 'text-orange-300',
    borderClass: 'border-orange-500/30'
  },
  [AlertStatus.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'purple',
    bgClass: 'bg-purple-500/20',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-500/30'
  },
  [AlertStatus.RESOLVED]: {
    label: 'Resolved',
    color: 'green',
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-300',
    borderClass: 'border-green-500/30'
  },
  [AlertStatus.FAILED]: {
    label: 'Failed',
    color: 'red',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-300',
    borderClass: 'border-red-500/30'
  },
  [AlertStatus.EXPIRED]: {
    label: 'Expired',
    color: 'gray',
    bgClass: 'bg-gray-500/20',
    textClass: 'text-gray-300',
    borderClass: 'border-gray-500/30'
  }
}

/**
 * Severity Display Configuration
 */
export const SEVERITY_CONFIG = {
  [AlertSeverity.LOW]: {
    label: 'Low',
    color: 'slate',
    bgClass: 'bg-slate-500/20',
    textClass: 'text-slate-300',
    borderClass: 'border-slate-500/30'
  },
  [AlertSeverity.MEDIUM]: {
    label: 'Medium',
    color: 'yellow',
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-300',
    borderClass: 'border-yellow-500/30'
  },
  [AlertSeverity.HIGH]: {
    label: 'High',
    color: 'orange',
    bgClass: 'bg-orange-500/20',
    textClass: 'text-orange-300',
    borderClass: 'border-orange-500/30'
  },
  [AlertSeverity.CRITICAL]: {
    label: 'Critical',
    color: 'red',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-300',
    borderClass: 'border-red-500/30'
  }
}

/**
 * Derives alert type from detection class
 */
export const deriveAlertType = (detectionClass) => {
  const className = detectionClass?.toLowerCase() || ''

  if (className.includes('poacher')) {
    return AlertType.POACHER_SUSPECTED
  }
  if (className.includes('human') || className.includes('person')) {
    return AlertType.HUMAN_DETECTED
  }
  if (className.includes('vehicle') || className.includes('car') || className.includes('truck')) {
    return AlertType.VEHICLE_SUSPECTED
  }
  if (className.includes('rhino') && className.includes('distress')) {
    return AlertType.RHINO_IN_DISTRESS
  }

  return AlertType.UNKNOWN_THREAT
}

/**
 * Derives alert severity from detection
 */
export const deriveAlertSeverity = (detection) => {
  if (!detection) {
    return AlertSeverity.LOW
  }

  const className = detection.class_name?.toLowerCase() || ''
  const confidence = detection.confidence || 0

  // Critical: High-confidence human or vehicle detections
  if (confidence >= 0.85 && (className.includes('human') || className.includes('vehicle') || className.includes('poacher'))) {
    return AlertSeverity.CRITICAL
  }

  // High: Moderate-confidence threats
  if (confidence >= 0.7 && (className.includes('human') || className.includes('vehicle'))) {
    return AlertSeverity.HIGH
  }

  // Medium: Low-confidence threats or rhino in unusual context
  if (className.includes('human') || className.includes('vehicle')) {
    return AlertSeverity.MEDIUM
  }

  return AlertSeverity.LOW
}

/**
 * Derives alert source from detection metadata
 */
export const deriveAlertSource = (detection) => {
  const source = detection.source?.toLowerCase() || ''

  if (source.includes('drone') || source.includes('aerial')) {
    return AlertSource.DRONE
  }
  if (source.includes('camera') || source.includes('trap')) {
    return AlertSource.CAMERA_TRAP
  }

  return AlertSource.CAMERA_TRAP // Default assumption
}

/**
 * Check if detection qualifies for ranger alert
 */
export const shouldShowAlertRanger = (detection) => {
  if (!detection) return false

  const className = detection.class_name?.toLowerCase() || ''
  const confidence = detection.confidence || 0

  // Always show for human/vehicle/poacher
  if (className.includes('human') || className.includes('vehicle') || className.includes('poacher')) {
    return true
  }

  // Show for low-confidence rhino near humans (future: backend flag)
  if (className.includes('rhino') && confidence < 0.6) {
    return false // Could be implemented with backend isThreatLikely flag
  }

  // Check for backend threat flag (future)
  if (detection.isThreatLikely) {
    return true
  }

  return false
}

/**
 * Generate a unique alert ID (client-side, replaced by backend)
 */
export const generateAlertId = () => {
  return `RG-${Date.now().toString().slice(-6)}`
}

/**
 * Format alert for display
 */
export const formatAlertId = (id) => {
  if (!id) return 'Unknown'
  if (id.startsWith('RG-')) return id
  return `RG-${id}`
}
