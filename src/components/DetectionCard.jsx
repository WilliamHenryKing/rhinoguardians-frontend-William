import { formatDate, getRelativeTime } from '../utils/formatDate'
import { formatCoordinates } from '../utils/mapHelpers'

export default function DetectionCard({ detection, isSelected, onClick }) {
  const getThreatLevel = (className) => {
    if (className === 'rhino') return 'safe'
    if (className === 'human' || className === 'vehicle') return 'danger'
    return 'unknown'
  }

  const threatLevel = getThreatLevel(detection.class_name)

  return (
    <div
      className={`detection-card ${isSelected ? 'selected' : ''} threat-${threatLevel}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {detection.image_path && (
        <div className="detection-image">
          <img
            src={detection.image_path}
            alt={detection.class_name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
            }}
          />
          <div className="image-overlay">
            <span className={`badge badge-${detection.class_name}`}>
              {detection.class_name.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      <div className="detection-content">
        <div className="detection-header">
          <div className="detection-id">
            <strong>{detection.id}</strong>
          </div>
          <div className="confidence-badge">
            {(detection.confidence * 100).toFixed(1)}%
          </div>
        </div>

        <div className="detection-details">
          <div className="detail-row">
            <span className="detail-icon">📍</span>
            <span className="detail-text">
              {formatCoordinates(detection.gps_lat, detection.gps_lng)}
            </span>
          </div>

          {detection.zone && (
            <div className="detail-row">
              <span className="detail-icon">🗺️</span>
              <span className="detail-text">{detection.zone}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-icon">🕐</span>
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
        </div>

        {threatLevel === 'danger' && (
          <button
            className="btn btn-alert btn-small"
            onClick={(e) => {
              e.stopPropagation()
              alert(`Alert sent for ${detection.id}`)
            }}
          >
            ⚠️ Alert Ranger
          </button>
        )}
      </div>
    </div>
  )
}
