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
    ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
    : isThreat
    ? 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
    : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50'

  const badgeStyle = isRhino
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : isThreat
    ? 'bg-red-500/20 text-red-300 border-red-500/30'
    : 'bg-slate-500/20 text-slate-300 border-slate-500/30'

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
    <motion.div
      className={'rounded-xl border backdrop-blur-sm p-4 cursor-pointer transition-all ' + cardStyle}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      layout
    >
      {detection.image_path && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-slate-900">
          <img
            src={detection.image_path}
            alt={detection.class_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <span className="text-xs text-white font-medium">
              {(detection.confidence * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={'px-3 py-1 rounded-full text-xs font-semibold border ' + badgeStyle}>
            {detection.class_name}
          </span>
          {isThreat && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <FiMapPin className="w-4 h-4 flex-shrink-0" />
            <span className="font-mono">
              {detection.gps_lat?.toFixed(6)}, {detection.gps_lng?.toFixed(6)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <FiClock className="w-4 h-4 flex-shrink-0" />
            <span>
              {detection.timestamp 
                ? format(new Date(detection.timestamp), 'MMM d, yyyy HH:mm')
                : 'Unknown time'
              }
            </span>
          </div>

          {detection.confidence && (
            <div className="flex items-center gap-2 text-slate-400">
              <FiZap className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={'h-full rounded-full transition-all ' + (isRhino ? 'bg-emerald-500' : isThreat ? 'bg-red-500' : 'bg-blue-500')}
                    style={{ width: (detection.confidence * 100) + '%' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alert Ranger Button */}
        {showAlertRanger && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            {activeAlert ? (
              <button
                onClick={handleViewAlert}
                className="w-full px-4 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FiCheckCircle className="w-4 h-4" />
                Alert Sent - View
              </button>
            ) : (
              <button
                onClick={handleAlertRanger}
                className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FiAlertTriangle className="w-4 h-4" />
                Alert Ranger
              </button>
            )}
          </div>
        )}
      </div>

      {/* Alert Confirm Modal */}
      <AlertConfirmModal
        detection={detection}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onConfirm={handleConfirmAlert}
      />
    </motion.div>
  )
}
