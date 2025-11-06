import { formatDate, getRelativeTime } from '../utils/formatDate'
import { formatCoordinates } from '../utils/mapHelpers'
import { MdLocationOn, MdMap, MdAccessTime, MdWarning } from 'react-icons/md'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
      transition={{
        duration: 0.3,
        layout: { duration: 0.3 }
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

      <div className="detection-content">
        <div className="detection-header">
          <div className="detection-id">
            <strong>{detection.id}</strong>
          </div>
          <motion.div
            className="confidence-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            {(detection.confidence * 100).toFixed(1)}%
          </motion.div>
        </div>

        <motion.div
          className="detection-details"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="detail-row">
            <MdLocationOn className="detail-icon" color="var(--color-primary)" />
            <span className="detail-text">
              {formatCoordinates(detection.gps_lat, detection.gps_lng)}
            </span>
          </div>

          {detection.zone && (
            <div className="detail-row">
              <MdMap className="detail-icon" color="var(--color-info)" />
              <span className="detail-text">{detection.zone}</span>
            </div>
          )}

          <div className="detail-row">
            <MdAccessTime className="detail-icon" color="var(--color-text-secondary)" />
            <span className="detail-text" title={formatDate(detection.timestamp)}>
              {getRelativeTime(detection.timestamp)}
            </span>
          </div>

          {detection.status && (
            <div className="detail-row">
              <span className={`status-badge status-${detection.status}`}>
                {detection.status}
              </span>
            </div>
          )}
        </motion.div>

        {threatLevel === 'danger' && (
          <motion.button
            className="btn btn-alert btn-small"
            onClick={(e) => {
              e.stopPropagation()
              alert(`Alert sent for ${detection.id}`)
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdWarning size={16} />
            Alert Ranger
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
