import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiX, FiAlertTriangle, FiInfo, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'

export default function AlertNotification({ alert, onClose, className = '' }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const types = {
    info: {
      icon: FiInfo,
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-300',
      iconBg: 'bg-blue-500/20'
    },
    success: {
      icon: FiCheckCircle,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-300',
      iconBg: 'bg-emerald-500/20'
    },
    warning: {
      icon: FiAlertTriangle,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-300',
      iconBg: 'bg-amber-500/20'
    },
    error: {
      icon: FiAlertCircle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-300',
      iconBg: 'bg-red-500/20'
    },
    threat: {
      icon: FiAlertTriangle,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-300',
      iconBg: 'bg-red-500/20'
    }
  }

  const config = types[alert.type] || types.info
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.95 }}
      className={`flex items-start gap-3 p-4 rounded-xl backdrop-blur-lg border ${config.bg} ${config.border} ${className}`.trim()}
    >
      <div className={'p-2 rounded-lg ' + config.iconBg}>
        <Icon className={'w-5 h-5 ' + config.text} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={'font-semibold text-sm mb-1 ' + config.text}>
          {alert.title || 'Notification'}
        </h4>
        <p className="text-sm text-slate-300">
          {alert.message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <FiX className="w-4 h-4 text-slate-400 hover:text-white" />
      </button>
    </motion.div>
  )
}
