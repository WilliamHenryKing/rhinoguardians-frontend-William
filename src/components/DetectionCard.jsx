import { formatDate, getRelativeTime } from '../utils/formatDate'
import { formatCoordinates } from '../utils/mapHelpers'
import { MdLocationOn, MdMap, MdAccessTime, MdWarning, MdCheckCircle } from 'react-icons/md'
import { motion } from 'framer-motion'

export default function DetectionCard({ detection, isSelected, onClick }) {
  const getThreatLevel = (className) => {
    if (className === 'rhino') return 'safe'
    if (className === 'human' || className === 'vehicle') return 'danger'
    return 'unknown'
  }

  const threatLevel = getThreatLevel(detection.class_name)

  return (
    <motion.div
      className={`detection-card ${isSelected ? 'selected' : ''} threat-${threatLevel}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.95 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      layout
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
      }}
    >
      {detection.image_path && (
        <div className="detection-image">
          <motion.img
            src={detection.image_path}
            alt={detection.class_name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
            }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="image-overlay">
            <motion.span
              className={`badge badge-${detection.class_name}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              {detection.class_name.toUpperCase()}
            </motion.span>
          </div>
        </div>
      )}

      <div className="detection-content px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10 flex flex-col gap-5 sm:gap-6 lg:gap-8 relative z-10 flex-1">
        {/* Header Section */}
        <div className="detection-header flex justify-between items-start gap-4 sm:gap-6 lg:gap-8 pb-5 sm:pb-6 lg:pb-8 border-b-2 border-neutral-200 dark:border-neutral-700">
          <div className="detection-id-section flex flex-col gap-2 sm:gap-3 flex-1">
            <span className="detection-id-label text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.12em] opacity-80">Detection ID</span>
            <strong className="detection-id text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight leading-tight">{detection.id}</strong>
          </div>
          <motion.div
            className="confidence-badge flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-700 text-white px-5 py-3 sm:px-6 sm:py-4 lg:px-7 lg:py-5 rounded-xl text-base sm:text-lg lg:text-xl font-bold shadow-md tracking-wide whitespace-nowrap min-h-[48px] sm:min-h-[56px] lg:min-w-[120px] transition-all duration-200 relative overflow-hidden"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent"></span>
            <span className="relative flex items-center gap-1.5 sm:gap-2">
              {threatLevel === 'safe' ? (
                <MdCheckCircle size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <MdWarning size={18} className="sm:w-5 sm:h-5" />
              )}
              {(detection.confidence * 100).toFixed(1)}%
            </span>
          </motion.div>
        </div>

        {/* Details Grid */}
        <motion.div
          className="detection-details flex flex-col gap-4 sm:gap-5 lg:gap-6 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="detail-row flex items-start gap-4 sm:gap-6 lg:gap-8 py-3 sm:py-4 transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:-mx-4 hover:px-4 sm:hover:-mx-6 sm:hover:px-6 hover:rounded-lg">
            <MdLocationOn className="detail-icon text-[28px] sm:text-[32px] lg:text-[36px] text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5 drop-shadow-[0_2px_4px_rgba(45,134,89,0.2)]" />
            <div className="detail-content flex flex-col gap-2 sm:gap-3 flex-1 min-w-0">
              <span className="detail-label text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.1em] opacity-80">Location</span>
              <span className="detail-text text-neutral-900 dark:text-neutral-50 text-lg sm:text-xl lg:text-2xl font-semibold leading-snug break-words">
                {formatCoordinates(detection.gps_lat, detection.gps_lng)}
              </span>
            </div>
          </div>

          {detection.zone && (
            <div className="detail-row flex items-start gap-4 sm:gap-6 lg:gap-8 py-3 sm:py-4 transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:-mx-4 hover:px-4 sm:hover:-mx-6 sm:hover:px-6 hover:rounded-lg">
              <MdMap className="detail-icon text-[28px] sm:text-[32px] lg:text-[36px] text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5 drop-shadow-[0_2px_4px_rgba(45,134,89,0.2)]" />
              <div className="detail-content flex flex-col gap-2 sm:gap-3 flex-1 min-w-0">
                <span className="detail-label text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.1em] opacity-80">Zone</span>
                <span className="detail-text text-neutral-900 dark:text-neutral-50 text-lg sm:text-xl lg:text-2xl font-semibold leading-snug break-words">{detection.zone}</span>
              </div>
            </div>
          )}

          <div className="detail-row flex items-start gap-4 sm:gap-6 lg:gap-8 py-3 sm:py-4 transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:-mx-4 hover:px-4 sm:hover:-mx-6 sm:hover:px-6 hover:rounded-lg">
            <MdAccessTime className="detail-icon text-[28px] sm:text-[32px] lg:text-[36px] text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5 drop-shadow-[0_2px_4px_rgba(45,134,89,0.2)]" />
            <div className="detail-content flex flex-col gap-2 sm:gap-3 flex-1 min-w-0">
              <span className="detail-label text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-[0.1em] opacity-80">Time</span>
              <span className="detail-text text-neutral-900 dark:text-neutral-50 text-lg sm:text-xl lg:text-2xl font-semibold leading-snug break-words" title={formatDate(detection.timestamp)}>
                {getRelativeTime(detection.timestamp)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Status Section */}
        {detection.status && (
          <motion.div
            className="detection-status flex items-center justify-between pt-5 sm:pt-6 lg:pt-8 mt-4 gap-4 border-t-2 border-neutral-200 dark:border-neutral-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <span className={`status-badge inline-block px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-bold capitalize tracking-wide status-${detection.status}`}>
              {detection.status}
            </span>
          </motion.div>
        )}

        {/* Action Button */}
        {threatLevel === 'danger' && (
          <motion.button
            className="btn btn-alert btn-full mt-3 sm:mt-4 px-6 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6 text-base sm:text-lg lg:text-xl font-bold min-h-[52px] sm:min-h-[60px] lg:min-h-[68px]"
            onClick={(e) => {
              e.stopPropagation()
              alert(`Alert sent for ${detection.id}`)
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MdWarning size={20} className="sm:w-6 sm:h-6" />
            Alert Ranger
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
