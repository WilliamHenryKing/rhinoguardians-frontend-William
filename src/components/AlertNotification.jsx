import { useState, useEffect } from 'react'

export default function AlertNotification({ alert, onClose, autoClose = 5000 }) {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (autoClose > 0) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const decrement = 100 / (autoClose / 100)
          return Math.max(0, prev - decrement)
        })
      }, 100)

      // Auto-close timer
      const closeTimer = setTimeout(() => {
        handleClose()
      }, autoClose)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(closeTimer)
      }
    }
  }, [autoClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose && onClose(alert.id)
    }, 300) // Match animation duration
  }

  const getIcon = (type) => {
    switch (type) {
      case 'critical':
        return '🚨'
      case 'warning':
        return '⚠️'
      case 'success':
        return '✅'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  const getSeverityClass = (type) => {
    switch (type) {
      case 'critical':
        return 'alert-critical'
      case 'warning':
        return 'alert-warning'
      case 'success':
        return 'alert-success'
      case 'info':
        return 'alert-info'
      default:
        return 'alert-default'
    }
  }

  return (
    <div className={`alert-toast ${getSeverityClass(alert.type)} ${isExiting ? 'exiting' : ''}`}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon(alert.type)}</span>
        <div className="alert-body">
          <div className="alert-message">{alert.message}</div>
          {alert.detection_id && (
            <div className="alert-subtext">Detection ID: {alert.detection_id}</div>
          )}
        </div>
        <button className="alert-close" onClick={handleClose} aria-label="Close alert">
          ✕
        </button>
      </div>
      {autoClose > 0 && (
        <div className="alert-progress">
          <div
            className="alert-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
