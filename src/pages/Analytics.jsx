import { useState, useEffect } from 'react'
import { getMockAnalytics, getMockDetections } from '../api/mockData'

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

  return (
    <div className="page-analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <p className="subtitle">Comprehensive threat analysis and metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card metric-primary">
          <div className="metric-icon">🦏</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.rhinoCount}</div>
            <div className="metric-label">Rhinos Detected</div>
          </div>
        </div>

        <div className="metric-card metric-danger">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.threatCount}</div>
            <div className="metric-label">Threats Identified</div>
          </div>
        </div>

        <div className="metric-card metric-warning">
          <div className="metric-icon">🚗</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.vehicleCount}</div>
            <div className="metric-label">Vehicles Spotted</div>
          </div>
        </div>

        <div className="metric-card metric-success">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.responseTime}m</div>
            <div className="metric-label">Avg Response Time</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        {/* Detections by Class */}
        <div className="chart-card">
          <h3>Detections by Class</h3>
          <div className="bar-chart">
            {Object.entries(classStats).map(([className, count]) => {
              const percentage = (count / detections.length) * 100
              return (
                <div key={className} className="bar-item">
                  <div className="bar-label">
                    <span className={`class-tag class-${className}`}>
                      {className}
                    </span>
                    <span className="bar-value">{count}</span>
                  </div>
                  <div className="bar-container">
                    <div
                      className={`bar bar-${className}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detections by Zone */}
        <div className="chart-card">
          <h3>Detections by Zone</h3>
          <div className="bar-chart">
            {Object.entries(zoneStats).map(([zone, count]) => {
              const percentage = (count / detections.length) * 100
              return (
                <div key={zone} className="bar-item">
                  <div className="bar-label">
                    <span>{zone}</span>
                    <span className="bar-value">{count}</span>
                  </div>
                  <div className="bar-container">
                    <div
                      className="bar bar-zone"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="chart-card">
          <h3>Detection Status</h3>
          <div className="bar-chart">
            {Object.entries(statusStats).map(([status, count]) => {
              const percentage = (count / detections.length) * 100
              return (
                <div key={status} className="bar-item">
                  <div className="bar-label">
                    <span className={`status-badge status-${status}`}>
                      {status}
                    </span>
                    <span className="bar-value">{count}</span>
                  </div>
                  <div className="bar-container">
                    <div
                      className={`bar bar-status-${status}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Hourly Activity */}
        <div className="chart-card chart-wide">
          <h3>Detections by Hour</h3>
          <p className="chart-subtitle">
            Peak activity: {peakHour.hour}:00 with {peakHour.count} detections
          </p>
          <div className="line-chart">
            {analytics.detectionsByHour.map((item) => {
              const maxCount = Math.max(
                ...analytics.detectionsByHour.map((i) => i.count)
              )
              const height = (item.count / maxCount) * 100

              return (
                <div key={item.hour} className="line-bar">
                  <div
                    className="line-bar-fill"
                    style={{ height: `${height}%` }}
                    title={`${item.hour}:00 - ${item.count} detections`}
                  />
                  <div className="line-bar-label">
                    {item.hour % 3 === 0 ? `${item.hour}h` : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="analytics-footer">
        <div className="performance-card">
          <h3>Ranger Efficiency</h3>
          <div className="performance-meter">
            <div className="meter-bar">
              <div
                className="meter-fill"
                style={{ width: `${analytics.rangerEfficiency}%` }}
              />
            </div>
            <div className="meter-value">{analytics.rangerEfficiency}%</div>
          </div>
          <p className="performance-note">
            Based on response time and threat neutralization rate
          </p>
        </div>

        <div className="summary-card">
          <h3>Summary</h3>
          <ul className="summary-list">
            <li>
              <strong>{analytics.totalDetections}</strong> total detections processed
            </li>
            <li>
              <strong>{analytics.threatCount}</strong> threats identified and reported
            </li>
            <li>
              <strong>{analytics.responseTime} minutes</strong> average response time
            </li>
            <li>
              <strong>Zone A</strong> has the highest activity
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
