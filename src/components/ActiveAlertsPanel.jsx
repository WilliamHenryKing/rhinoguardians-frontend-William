/**
 * Active Alerts Panel
 *
 * Global panel showing all active ranger alerts.
 * Visible on all main pages, typically as right-side or bottom drawer.
 *
 * Features:
 * - Shows count of active alerts
 * - Lists alerts with status chips
 * - Click to focus map and open details
 * - Shows recently resolved alerts
 */

import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiChevronDown, FiChevronUp, FiMapPin, FiClock } from 'react-icons/fi'
import { format, formatDistanceToNow } from 'date-fns'
import { useAlertRanger } from '../context/AlertRangerContext'
import { STATUS_CONFIG, SEVERITY_CONFIG, formatAlertId } from '../types/alert'
import { useState } from 'react'

function AlertItem({ alert, onSelect }) {
  const statusConfig = STATUS_CONFIG[alert.status]
  const severityConfig = SEVERITY_CONFIG[alert.severity]

  const timeAgo = alert.createdAt
    ? formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })
    : 'Unknown time'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
      onClick={() => onSelect(alert)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-semibold text-sm">
              {formatAlertId(alert.id)}
            </span>
            <span className={'px-2 py-0.5 rounded text-xs font-semibold ' + severityConfig.bgClass + ' ' + severityConfig.textClass}>
              {severityConfig.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 capitalize">
            {alert.type.replace(/_/g, ' ')}
          </p>
        </div>

        <span className={'px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ' +
          statusConfig.bgClass + ' ' + statusConfig.textClass + ' ' + statusConfig.borderClass}>
          {statusConfig.label}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FiMapPin className="w-3 h-3 flex-shrink-0" />
          <span className="font-mono truncate">
            {alert.location.lat?.toFixed(4)}, {alert.location.lng?.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FiClock className="w-3 h-3 flex-shrink-0" />
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Notes preview */}
      {alert.notes && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <p className="text-xs text-slate-400 line-clamp-2">
            {alert.notes}
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default function ActiveAlertsPanel({ onAlertSelect, onMapFocus }) {
  const { activeAlerts, recentlyResolvedAlerts, error, isPolling } = useAlertRanger()
  const [isExpanded, setIsExpanded] = useState(true)
  const [showResolved, setShowResolved] = useState(false)

  const handleAlertClick = (alert) => {
    // Focus map on alert location
    if (onMapFocus) {
      onMapFocus([alert.location.lat, alert.location.lng], alert)
    }

    // Open detail panel
    if (onAlertSelect) {
      onAlertSelect(alert)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full h-full flex flex-col bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiAlertTriangle className="w-5 h-5 text-red-400" />
            {activeAlerts.length > 0 && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">Active Alerts</h2>
            <p className="text-xs text-slate-400">
              {activeAlerts.length} {activeAlerts.length === 1 ? 'alert' : 'alerts'} active
              {isPolling && ' • Live'}
            </p>
          </div>
        </div>

        <button className="p-1 hover:bg-slate-800 rounded transition-colors">
          {isExpanded ? (
            <FiChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <FiChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/30">
          <p className="text-xs text-red-300">⚠️ {error}</p>
        </div>
      )}

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Active Alerts */}
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <FiAlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No active alerts</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Rangers will appear here when alerted
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {activeAlerts.map((alert) => (
                    <AlertItem
                      key={alert.id}
                      alert={alert}
                      onSelect={handleAlertClick}
                    />
                  ))}
                </AnimatePresence>
              )}

              {/* Recently Resolved Section */}
              {recentlyResolvedAlerts.length > 0 && (
                <div className="pt-4 border-t border-slate-700">
                  <button
                    onClick={() => setShowResolved(!showResolved)}
                    className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-slate-300 transition-colors mb-3"
                  >
                    <span className="font-semibold">
                      Recently Resolved ({recentlyResolvedAlerts.length})
                    </span>
                    {showResolved ? (
                      <FiChevronUp className="w-4 h-4" />
                    ) : (
                      <FiChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showResolved && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-3"
                      >
                        {recentlyResolvedAlerts.map((alert) => (
                          <AlertItem
                            key={alert.id}
                            alert={alert}
                            onSelect={handleAlertClick}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {activeAlerts.length > 0 && (
              <div className="px-4 py-2 bg-slate-900 border-t border-slate-700">
                <p className="text-xs text-slate-500 text-center">
                  Click an alert to view details and location
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
