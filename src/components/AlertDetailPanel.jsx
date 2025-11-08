/**
 * Alert Detail Panel
 *
 * Full detail view of a selected alert.
 * Shows complete alert information, timeline, and status.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiMapPin, FiClock, FiUser, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { format } from 'date-fns'
import { useAlertRanger } from '../context/AlertRangerContext'
import { STATUS_CONFIG, SEVERITY_CONFIG, formatAlertId, AlertStatus } from '../types/alert'

function TimelineItem({ status, label, timestamp, isCurrent = false }) {
  const config = STATUS_CONFIG[status]

  return (
    <div className="flex gap-3 relative">
      {/* Connector Line */}
      {!isCurrent && (
        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-700" />
      )}

      {/* Icon */}
      <div className={'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ' +
        (isCurrent ? config.bgClass + ' ring-2 ring-offset-2 ring-offset-slate-900 ' + config.borderClass.replace('border-', 'ring-') : 'bg-slate-700')}>
        {timestamp ? (
          <FiCheckCircle className={'w-3 h-3 ' + (isCurrent ? config.textClass : 'text-slate-400')} />
        ) : (
          <div className={'w-2 h-2 rounded-full ' + (isCurrent ? config.textClass.replace('text-', 'bg-') : 'bg-slate-500')} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-baseline gap-2">
          <span className={'text-sm font-semibold ' + (isCurrent ? 'text-white' : 'text-slate-400')}>
            {label}
          </span>
          {isCurrent && (
            <span className={'px-2 py-0.5 rounded text-xs font-semibold ' + config.bgClass + ' ' + config.textClass}>
              Current
            </span>
          )}
        </div>
        {timestamp && (
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {format(new Date(timestamp), 'MMM d, yyyy HH:mm:ss')}
          </p>
        )}
      </div>
    </div>
  )
}

export default function AlertDetailPanel({ alertId, isOpen, onClose }) {
  const { getAlertById } = useAlertRanger()
  const alert = getAlertById(alertId)

  if (!alert) return null

  const statusConfig = STATUS_CONFIG[alert.status]
  const severityConfig = SEVERITY_CONFIG[alert.severity]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold text-white">Alert Details</h2>
                <p className="text-sm text-slate-400">{formatAlertId(alert.id)}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <FiX className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status & Severity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Status</label>
                  <div className={'px-3 py-2 rounded-lg border font-semibold text-sm text-center ' +
                    statusConfig.bgClass + ' ' + statusConfig.textClass + ' ' + statusConfig.borderClass}>
                    {statusConfig.label}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Severity</label>
                  <div className={'px-3 py-2 rounded-lg border font-semibold text-sm text-center ' +
                    severityConfig.bgClass + ' ' + severityConfig.textClass + ' ' + severityConfig.borderClass}>
                    {severityConfig.label}
                  </div>
                </div>
              </div>

              {/* Alert Type */}
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Alert Type</label>
                <p className="text-white font-medium capitalize">{alert.type.replace(/_/g, ' ')}</p>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <FiMapPin className="w-3 h-3" />
                  Location
                </label>
                <div className="bg-slate-800 rounded-lg p-3 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400">GPS:</span>
                    <span className="text-white font-mono text-sm">
                      {alert.location.lat?.toFixed(6)}, {alert.location.lng?.toFixed(6)}
                    </span>
                  </div>
                  {alert.location.zoneLabel && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-slate-400">Zone:</span>
                      <span className="text-white text-sm">{alert.location.zoneLabel}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <FiClock className="w-3 h-3" />
                    Created
                  </label>
                  <p className="text-white text-sm font-mono">
                    {alert.createdAt ? format(new Date(alert.createdAt), 'MMM d, HH:mm:ss') : 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Updated</label>
                  <p className="text-white text-sm font-mono">
                    {alert.updatedAt ? format(new Date(alert.updatedAt), 'MMM d, HH:mm:ss') : 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Created By */}
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <FiUser className="w-3 h-3" />
                  Created By
                </label>
                <p className="text-white font-medium">{alert.createdBy}</p>
              </div>

              {/* Notes */}
              {alert.notes && (
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <FiFileText className="w-3 h-3" />
                    Notes
                  </label>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-white text-sm leading-relaxed">{alert.notes}</p>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-4 block">Alert Timeline</label>
                <div className="space-y-0">
                  <TimelineItem
                    status={AlertStatus.CREATED}
                    label="Alert Created"
                    timestamp={alert.createdAt}
                    isCurrent={alert.status === AlertStatus.CREATED}
                  />
                  <TimelineItem
                    status={AlertStatus.SENT}
                    label="Dispatched to Rangers"
                    timestamp={alert.status !== AlertStatus.CREATED ? alert.createdAt : null}
                    isCurrent={alert.status === AlertStatus.SENT}
                  />
                  <TimelineItem
                    status={AlertStatus.ACKNOWLEDGED}
                    label="Ranger Acknowledged"
                    timestamp={alert.acknowledgedAt}
                    isCurrent={alert.status === AlertStatus.ACKNOWLEDGED}
                  />
                  <TimelineItem
                    status={AlertStatus.IN_PROGRESS}
                    label="Ranger En Route / Acting"
                    timestamp={alert.status === AlertStatus.IN_PROGRESS ? alert.updatedAt : null}
                    isCurrent={alert.status === AlertStatus.IN_PROGRESS}
                  />
                  <TimelineItem
                    status={AlertStatus.RESOLVED}
                    label="Resolved"
                    timestamp={alert.resolvedAt}
                    isCurrent={alert.status === AlertStatus.RESOLVED}
                  />
                </div>
              </div>

              {/* Delivery Status (if available) */}
              {alert.deliveryChannelStatus && alert.deliveryChannelStatus.length > 0 && (
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Delivery Channels</label>
                  <div className="space-y-2">
                    {alert.deliveryChannelStatus.map((channel, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-slate-300 capitalize">{channel.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning for Failed/Expired */}
              {(alert.status === AlertStatus.FAILED || alert.status === AlertStatus.EXPIRED) && (
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-semibold text-sm">
                      {alert.status === AlertStatus.FAILED ? 'Delivery Failed' : 'No Acknowledgment'}
                    </p>
                    <p className="text-red-400 text-xs mt-1">
                      {alert.status === AlertStatus.FAILED
                        ? 'Alert delivery failed. Escalate manually via radio or direct contact.'
                        : 'No ranger acknowledgment received. Possible communication failure. Verify manually.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Debug Info (for development) */}
              {alert._isMock && (
                <div className="px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-300">
                  ⚠️ Mock alert (backend not connected)
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-700 bg-slate-900">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
