import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiClock, FiZap, FiAlertTriangle, FiCheckCircle, FiEye } from 'react-icons/fi'
import { format } from 'date-fns'
import { useAlertRanger } from '../context/AlertRangerContext'
import { shouldShowAlertRanger } from '../types/alert'
import AlertConfirmModal from './AlertConfirmModal'

export default function DetectionCard({ detection, onClick, onAlertCreated }) {
  const { hasActiveAlert, createAlertFromDetection } = useAlertRanger()
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const [isAlertSending, setIsAlertSending] = useState(false)

  const isRhino = detection.class_name?.toLowerCase().includes('rhino')
  const isThreat = detection.class_name?.toLowerCase().includes('human') ||
                   detection.class_name?.toLowerCase().includes('vehicle') ||
                   detection.class_name?.toLowerCase().includes('poacher')

  const cardStyle = isRhino
    ? 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 focus-visible:bg-emerald-500/15'
    : isThreat
    ? 'border-red-500/30 bg-red-500/10 hover:bg-red-500/15 focus-visible:bg-red-500/15'
    : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/60 focus-visible:bg-slate-800/60'

  const badgeStyle = isRhino
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : isThreat
    ? 'bg-red-500/20 text-red-300 border-red-500/30'
    : 'bg-slate-500/20 text-slate-300 border-slate-500/30'

  const isInteractive = typeof onClick === 'function'

  // Check if this detection should show Alert Ranger button
  const showAlertRanger = shouldShowAlertRanger(detection)
  const activeAlert = hasActiveAlert(detection.id)

  const handleAlertRanger = (e) => {
    e.stopPropagation()
    setIsAlertModalOpen(true)
  }

  const handleViewAlert = (e) => {
    e.stopPropagation()
    if (onAlertCreated) {
      onAlertCreated(detection.id)
    }
  }

  const handleViewDetails = (e) => {
    e.stopPropagation()
    if (isInteractive) {
      onClick(e)
    }
  }

  const handleKeyDown = (event) => {
    if (!isInteractive) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(event)
    }
  }

  const handleConfirmAlert = async (overrides) => {
    try {
      setIsAlertSending(true)
      const newAlert = await createAlertFromDetection(detection, overrides)

      // Success - close modal
      setIsAlertModalOpen(false)

      // Notify parent
      if (onAlertCreated) {
        onAlertCreated(newAlert)
      }
    } catch (error) {
      // Error is handled in modal
      throw error
    } finally {
      setIsAlertSending(false)
    }
  }

  return (
    <motion.article
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={[
        'cq-card group/card border backdrop-blur-sm transition-colors',
        'motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out',
        'motion-safe:group-hover/card:-translate-y-1 motion-safe:group-focus-visible/card:-translate-y-1 motion-reduce:transform-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        isInteractive ? 'cursor-pointer' : 'cursor-default',
        cardStyle,
      ].join(' ')}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      layout
    >
      {detection.image_path && (
        <div className="detection-card__media relative w-full h-48 rounded-2xl overflow-hidden bg-slate-900/70">
          <img
            src={detection.image_path}
            alt={detection.class_name}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-3 right-3 rounded-xl bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {(detection.confidence * 100).toFixed(1)}%
          </div>
        </div>
      )}

      <div className="gap-fluid-sm flex flex-col">
        <div className="flex items-center justify-between gap-3">
          <span className={'px-3 py-1 rounded-full text-xs font-semibold border ' + badgeStyle}>
            {detection.class_name}
          </span>
          {isThreat && (
            <span className="detection-card__status-dot h-2 w-2 rounded-full bg-red-500 motion-safe:animate-pulse-slow motion-reduce:animate-none" />
          )}
        </div>

        <div className="detection-card__meta grid gap-3 text-sm text-slate-300">
          <div className="detection-card__meta-item flex items-center gap-2 text-slate-400">
            <FiMapPin className="h-4 w-4 flex-shrink-0" />
            <span className="font-mono">
              {detection.gps_lat?.toFixed(6)}, {detection.gps_lng?.toFixed(6)}
            </span>
          </div>

          <div className="detection-card__meta-item flex items-center gap-2 text-slate-400">
            <FiClock className="h-4 w-4 flex-shrink-0" />
            <span>
              {detection.timestamp
                ? format(new Date(detection.timestamp), 'MMM d, yyyy HH:mm')
                : 'Unknown time'
              }
            </span>
          </div>

          {detection.confidence && (
            <div className="detection-card__meta-item flex items-center gap-2 text-slate-400">
              <FiZap className="h-4 w-4 flex-shrink-0" />
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-slate-700">
                  <div
                    className={'h-full rounded-full transition-all ' + (isRhino ? 'bg-emerald-500' : isThreat ? 'bg-red-500' : 'bg-blue-500')}
                    style={{ width: (detection.confidence * 100) + '%' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {showAlertRanger && (
          <div className="detection-card__actions mt-2 border-t border-slate-700 pt-4">
            <div className="flex flex-col gap-fluid-sm sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleViewDetails}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600/60 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:hover:bg-transparent sm:w-auto sm:flex-1"
                disabled={!isInteractive}
              >
                <FiEye className="h-4 w-4" />
                View details
              </button>

              {activeAlert ? (
                <button
                  type="button"
                  onClick={handleViewAlert}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-600/20 px-4 py-2 text-sm font-semibold text-green-300 transition-colors hover:bg-green-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto sm:flex-1"
                  disabled={isAlertSending}
                >
                  <FiCheckCircle className="h-4 w-4" />
                  Alert Sent - View
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAlertRanger}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto sm:flex-1"
                  disabled={isAlertSending}
                >
                  <FiAlertTriangle className="h-4 w-4" />
                  {isAlertSending ? 'Sending…' : 'Alert Ranger'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <AlertConfirmModal
        detection={detection}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onConfirm={handleConfirmAlert}
      />
    </motion.article>
  )
}
