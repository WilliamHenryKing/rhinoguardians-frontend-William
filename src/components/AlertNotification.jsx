import { useState, useEffect } from 'react'
import { MdClose, MdError, MdWarning, MdCheckCircle, MdInfo } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

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
        return <MdError size={28} />
      case 'warning':
        return <MdWarning size={28} />
      case 'success':
        return <MdCheckCircle size={28} />
      case 'info':
        return <MdInfo size={28} />
      default:
        return <MdInfo size={28} />
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
    <motion.div
      className={`alert-toast ${getSeverityClass(alert.type)}`}
      initial={{ opacity: 0, x: 400, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 400, scale: 0.8 }}
      transition={{
        duration: 0.3,
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
    >
      <div className="alert-content">
        <motion.span
          className="alert-icon"
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          {getIcon(alert.type)}
        </motion.span>
        <div className="alert-body">
          <motion.div
            className="alert-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {alert.message}
          </motion.div>
          {alert.detection_id && (
            <motion.div
              className="alert-subtext"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Detection ID: {alert.detection_id}
            </motion.div>
          )}
        </div>
        <motion.button
          className="alert-close"
          onClick={handleClose}
          aria-label="Close alert"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <MdClose size={20} />
        </motion.button>
      </div>
      {autoClose > 0 && (
        <div className="alert-progress">
          <motion.div
            className="alert-progress-bar"
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}
