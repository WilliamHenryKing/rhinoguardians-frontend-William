/**
 * Alert Confirm Modal
 *
 * Modal for confirming and customizing a ranger alert before sending.
 * Shows detection details, allows editing alert type/severity/notes.
 *
 * This is the main entry point for creating alerts.
 */

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiAlertTriangle, FiMapPin, FiClock, FiZap, FiSend } from 'react-icons/fi'
import { format } from 'date-fns'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import {
  AlertType,
  AlertSeverity,
  SEVERITY_CONFIG,
  deriveAlertType,
  deriveAlertSeverity,
  formatAlertId
} from '../types/alert'

// Small map marker
const smallMarkerIcon = L.divIcon({
  className: 'custom-marker-small',
  html: '<div style="width: 12px; height: 12px; background-color: #ef4444; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

export default function AlertConfirmModal({ detection, isOpen, onClose, onConfirm }) {
  const [alertType, setAlertType] = useState(deriveAlertType(detection?.class_name))
  const [severity, setSeverity] = useState(deriveAlertSeverity(detection))
  const [notes, setNotes] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setAlertType(deriveAlertType(detection?.class_name))
    setSeverity(deriveAlertSeverity(detection))
  }, [detection])

  const handleConfirm = async () => {
    setIsSending(true)
    setError(null)

    try {
      await onConfirm({
        type: alertType,
        severity: severity,
        notes: notes.trim()
      })

      // Success - modal will be closed by parent
    } catch (err) {
      console.error('Failed to send alert:', err)
      setError(err.message || 'Failed to send alert. Please try again.')
      setIsSending(false)
    }
  }

  const handleClose = () => {
    if (!isSending) {
      setError(null)
      setNotes('')
      onClose()
    }
  }

  // Disable submit if threat is high/critical but severity is being downgraded too much
  const canSubmit = useMemo(() => {
    const isThreat = detection?.class_name?.toLowerCase().includes('human') ||
                     detection?.class_name?.toLowerCase().includes('vehicle')

    if (isThreat && (severity === AlertSeverity.LOW)) {
      return false // Don't allow low severity for threats
    }

    return true
  }, [detection, severity])

  if (!detection) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <FiAlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Confirm Ranger Alert</h2>
                    <p className="text-sm text-slate-400">Review details before sending</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSending}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <FiX className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Detection Snapshot */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Detection Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image */}
                    {detection.image_path && (
                      <div className="relative rounded-lg overflow-hidden bg-slate-800 h-48">
                        <img
                          src={detection.image_path}
                          alt={detection.class_name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
                          <span className="text-xs text-white font-medium">
                            {(detection.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FiZap className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">Class:</span>
                        <span className="text-white font-semibold">{detection.class_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <FiClock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">Time:</span>
                        <span className="text-white font-mono text-xs">
                          {detection.timestamp
                            ? format(new Date(detection.timestamp), 'MMM d, yyyy HH:mm:ss')
                            : 'Unknown'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <FiMapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">GPS:</span>
                        <span className="text-white font-mono text-xs">
                          {detection.gps_lat?.toFixed(6)}, {detection.gps_lng?.toFixed(6)}
                        </span>
                      </div>

                      <div className="pt-2">
                        <div className="text-xs text-slate-400 mb-1">Confidence</div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="h-full rounded-full bg-red-500"
                            style={{ width: (detection.confidence * 100) + '%' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert Configuration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Alert Configuration</h3>

                  {/* Alert Type */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Alert Type</label>
                    <select
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value)}
                      disabled={isSending}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    >
                      <option value={AlertType.POACHER_SUSPECTED}>Poacher Suspected</option>
                      <option value={AlertType.HUMAN_DETECTED}>Human Detected</option>
                      <option value={AlertType.VEHICLE_SUSPECTED}>Vehicle Suspected</option>
                      <option value={AlertType.RHINO_IN_DISTRESS}>Rhino in Distress</option>
                      <option value={AlertType.UNKNOWN_THREAT}>Unknown Threat</option>
                    </select>
                  </div>

                  {/* Severity */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Severity Level</label>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.values(AlertSeverity).map((sev) => {
                        const config = SEVERITY_CONFIG[sev]
                        const isSelected = severity === sev
                        return (
                          <button
                            key={sev}
                            onClick={() => setSeverity(sev)}
                            disabled={isSending}
                            className={'px-3 py-2 rounded-lg border text-sm font-semibold transition-all disabled:opacity-50 ' +
                              (isSelected
                                ? config.bgClass + ' ' + config.textClass + ' ' + config.borderClass
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700')}
                          >
                            {config.label}
                          </button>
                        )
                      })}
                    </div>
                    {!canSubmit && (
                      <p className="text-xs text-red-400 mt-2">⚠️ Threat detections cannot be marked as low severity</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Notes (optional, max 240 characters)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value.slice(0, 240))}
                      disabled={isSending}
                      placeholder="e.g., 2 individuals on foot near borehole, no vehicle visible"
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 resize-none"
                    />
                    <div className="text-xs text-slate-500 mt-1 text-right">
                      {notes.length} / 240
                    </div>
                  </div>
                </div>

                {/* Location Preview */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Location Confirmation</h3>
                  <div className="w-full h-40 rounded-lg overflow-hidden border border-slate-700">
                    <MapContainer
                      center={[detection.gps_lat, detection.gps_lng]}
                      zoom={13}
                      className="w-full h-full"
                      zoomControl={false}
                      dragging={false}
                      scrollWheelZoom={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={[detection.gps_lat, detection.gps_lng]}
                        icon={smallMarkerIcon}
                      />
                    </MapContainer>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={handleClose}
                  disabled={isSending}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={isSending || !canSubmit}
                  className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending alert to ranger network...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Send Alert
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
