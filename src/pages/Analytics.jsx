import { useState, useEffect } from 'react'
import { getMockAnalytics, getMockDetections } from '../api/mockData'
import { motion } from 'framer-motion'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const [analyticsData, detectionsData] = await Promise.all([
        getMockAnalytics(),
        getMockDetections({ limit: 100 })
      ])
      setAnalytics(analyticsData)
      setDetections(detectionsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="page-analytics">
        <div className="loading-state">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="page-analytics">
        <div className="error-state">Failed to load analytics</div>
      </div>
    )
  }

  // Calculate additional statistics from detections
  const classStats = detections.reduce((acc, d) => {
    acc[d.class_name] = (acc[d.class_name] || 0) + 1
    return acc
  }, {})

  const zoneStats = detections.reduce((acc, d) => {
    acc[d.zone] = (acc[d.zone] || 0) + 1
    return acc
  }, {})

  const statusStats = detections.reduce((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1
    return acc
  }, {})

  // Find peak detection hour
  const peakHour = analytics.detectionsByHour.reduce((max, item) =>
    item.count > max.count ? item : max
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="page-analytics"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="analytics-header" variants={itemVariants}>
        <h2>Analytics Dashboard</h2>
        <p className="subtitle">Comprehensive threat analysis and metrics</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div className="metrics-grid" variants={itemVariants}>
        <motion.div
          className="metric-card metric-primary"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="metric-icon">🦏</div>
          <div className="metric-content">
            <motion.div
              className="metric-value"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              {analytics.rhinoCount}
            </motion.div>
            <div className="metric-label">Rhinos Detected</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card metric-danger"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <motion.div
              className="metric-value"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              {analytics.threatCount}
            </motion.div>
            <div className="metric-label">Threats Identified</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card metric-warning"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="metric-icon">🚗</div>
          <div className="metric-content">
            <motion.div
              className="metric-value"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            >
              {analytics.vehicleCount}
            </motion.div>
            <div className="metric-label">Vehicles Spotted</div>
          </div>
        </motion.div>

        <motion.div
          className="metric-card metric-success"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <motion.div
              className="metric-value"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            >
              {analytics.responseTime}m
            </motion.div>
            <div className="metric-label">Avg Response Time</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div className="analytics-charts" variants={itemVariants}>
        {/* Detections by Class */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3>Detections by Class</h3>
          <div className="bar-chart">
            {Object.entries(classStats).map(([className, count], index) => {
              const percentage = (count / detections.length) * 100
              return (
                <motion.div
                  key={className}
                  className="bar-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="bar-label">
                    <span className={`class-tag class-${className}`}>
                      {className}
                    </span>
                    <span className="bar-value">{count}</span>
                  </div>
                  <div className="bar-container">
                    <motion.div
                      className={`bar bar-${className}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Detections by Zone */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3>Detections by Zone</h3>
          <div className="bar-chart">
            {Object.entries(zoneStats).map(([zone, count], index) => {
              const percentage = (count / detections.length) * 100
              return (
                <motion.div
                  key={zone}
                  className="bar-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <div className="bar-label">
                    <span>{zone}</span>
                    <span className="bar-value">{count}</span>
                  </div>
                  <div className="bar-container">
                    <motion.div
                      className="bar bar-zone"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
        >
          <h3>Detection Status</h3>
          <div className="bar-chart">
            {Object.entries(statusStats).map(([status, count], index) => {
              const percentage = (count / detections.length) * 100
              return (
                <motion.div
                  key={status}
                  className="bar-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                >
                  <div className="bar-label">
                    <span className={`status-badge status-${status}`}>
                      {status}
                    </span>
                    <span className="bar-value">{count}</span>
                  </div>
                  <div className="bar-container">
                    <motion.div
                      className={`bar bar-status-${status}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 1.1 + index * 0.1, duration: 0.6 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Hourly Activity */}
        <motion.div
          className="chart-card chart-wide"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
        >
          <h3>Detections by Hour</h3>
          <p className="chart-subtitle">
            Peak activity: {peakHour.hour}:00 with {peakHour.count} detections
          </p>
          <div className="line-chart">
            {analytics.detectionsByHour.map((item, index) => {
              const maxCount = Math.max(
                ...analytics.detectionsByHour.map((i) => i.count)
              )
              const height = (item.count / maxCount) * 100

              return (
                <div key={item.hour} className="line-bar">
                  <motion.div
                    className="line-bar-fill"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      delay: 1.2 + index * 0.02,
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 100
                    }}
                    title={`${item.hour}:00 - ${item.count} detections`}
                  />
                  <div className="line-bar-label">
                    {item.hour % 3 === 0 ? `${item.hour}h` : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div className="analytics-footer" variants={itemVariants}>
        <motion.div
          className="performance-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <h3>Ranger Efficiency</h3>
          <div className="performance-meter">
            <div className="meter-bar">
              <motion.div
                className="meter-fill"
                initial={{ width: 0 }}
                animate={{ width: `${analytics.rangerEfficiency}%` }}
                transition={{ delay: 1.4, duration: 1, ease: 'easeOut' }}
              />
            </div>
            <motion.div
              className="meter-value"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
            >
              {analytics.rangerEfficiency}%
            </motion.div>
          </div>
          <p className="performance-note">
            Based on response time and threat neutralization rate
          </p>
        </motion.div>

        <motion.div
          className="summary-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <h3>Summary</h3>
          <motion.ul
            className="summary-list"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 1.5
                }
              }
            }}
          >
            <motion.li variants={itemVariants}>
              <strong>{analytics.totalDetections}</strong> total detections processed
            </motion.li>
            <motion.li variants={itemVariants}>
              <strong>{analytics.threatCount}</strong> threats identified and reported
            </motion.li>
            <motion.li variants={itemVariants}>
              <strong>{analytics.responseTime} minutes</strong> average response time
            </motion.li>
            <motion.li variants={itemVariants}>
              <strong>Zone A</strong> has the highest activity
            </motion.li>
          </motion.ul>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
