import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiPieChart, FiActivity, FiTarget } from 'react-icons/fi'
import Map from '../components/Map'
import { getMockDetections } from '../api/mockData'

export default function Analytics({ onAlert }) {
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getMockDetections()
      setDetections(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      onAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load analytics data'
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate analytics
  const analytics = {
    totalDetections: detections.length,
    rhinoCount: detections.filter(d => d.class_name?.toLowerCase().includes('rhino')).length,
    threatCount: detections.filter(d => 
      d.class_name?.toLowerCase().includes('human') || 
      d.class_name?.toLowerCase().includes('poacher')
    ).length,
    avgConfidence: (detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100).toFixed(1),
    detectionsByClass: detections.reduce((acc, d) => {
      acc[d.class_name] = (acc[d.class_name] || 0) + 1
      return acc
    }, {}),
    detectionsByHour: detections.reduce((acc, d) => {
      const hour = new Date(d.timestamp).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {})
  }

  const topClasses = Object.entries(analytics.detectionsByClass)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const hourlyPeaks = Object.entries(analytics.detectionsByHour)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-sm md:text-base text-slate-400">
          Statistical insights and detection patterns
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {[
          {
            label: 'Total Detections',
            value: analytics.totalDetections, 
            icon: FiActivity, 
            color: 'blue',
            change: '+12%'
          },
          { 
            label: 'Rhinos Protected', 
            value: analytics.rhinoCount, 
            icon: FiTarget, 
            color: 'emerald',
            change: '+8%'
          },
          { 
            label: 'Threats Detected', 
            value: analytics.threatCount, 
            icon: FiTrendingUp, 
            color: 'red',
            change: '-5%'
          },
          { 
            label: 'Avg Confidence', 
            value: analytics.avgConfidence + '%', 
            icon: FiPieChart, 
            color: 'purple',
            change: '+3%'
          }
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 border border-white/10 rounded-xl p-5 sm:p-6 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={'p-2.5 sm:p-3 rounded-lg bg-' + metric.color + '-500/20'}>
                <metric.icon className={'w-5 h-5 sm:w-6 sm:h-6 text-' + metric.color + '-400'} />
              </div>
              <span className={'text-xs font-medium px-2 py-1 rounded-full ' + (metric.change.startsWith('+') ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300')}>
                {metric.change}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {metric.value}
            </div>
            <div className="text-xs sm:text-sm text-slate-400">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Heatmap */}
      <div className="space-y-6">
        <div className="grid grid-flow-col auto-cols-[minmax(18rem,1fr)] gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 sm:mx-0 sm:px-0 md:grid md:grid-flow-row md:grid-cols-2 md:gap-5 md:overflow-visible md:snap-none md:pb-0 lg:gap-6 xl:gap-8">
          {/* Detection Heatmap */}
          <div className="snap-center min-w-[18rem] lg:min-w-0 bg-slate-900/50 border border-white/10 rounded-xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Detection Heatmap</h2>
            <div className="h-72 sm:h-80">
              <Map detections={detections} className="h-full" />
            </div>
          </div>

          {/* Top Detection Classes */}
          <div className="snap-center min-w-[18rem] lg:min-w-0 bg-slate-900/50 border border-white/10 rounded-xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Top Detection Classes</h2>
            <div className="space-y-3 sm:space-y-4">
              {topClasses.map(([className, count], i) => {
                const percentage = (count / analytics.totalDetections * 100).toFixed(1)
                const isRhino = className?.toLowerCase().includes('rhino')
                const isThreat = className?.toLowerCase().includes('human') || className?.toLowerCase().includes('poacher')

                return (
                  <motion.div
                    key={className}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{className}</span>
                      <span className="text-xs sm:text-sm text-slate-400">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: percentage + '%' }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                        className={'h-full rounded-full ' + (isRhino ? 'bg-emerald-500' : isThreat ? 'bg-red-500' : 'bg-blue-500')}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-flow-col auto-cols-[minmax(18rem,1fr)] gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 sm:mx-0 sm:px-0 md:grid md:grid-flow-row md:grid-cols-2 md:gap-5 md:overflow-visible md:snap-none md:pb-0 lg:gap-6 xl:gap-8">
          {/* Peak Activity Hours */}
          <div className="snap-center min-w-[18rem] lg:min-w-0 bg-slate-900/50 border border-white/10 rounded-xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Peak Activity Hours</h2>
            <div className="space-y-3 sm:space-y-4">
              {hourlyPeaks.map(([hour, count], i) => (
                <motion.div
                  key={hour}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                >
                  <div>
                    <div className="text-base sm:text-lg font-bold text-white">{hour}:00 - {parseInt(hour) + 1}:00</div>
                    <div className="text-xs sm:text-sm text-slate-400">{count} detections</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400">#{i + 1}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary Card */}
          <div className="snap-center min-w-[18rem] lg:min-w-0 bg-gradient-to-br from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 rounded-xl p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Summary</h2>
            <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-slate-300">
              <p>
                Over the past monitoring period, the system has detected <span className="text-emerald-400 font-bold">{analytics.rhinoCount} rhinos</span> and identified <span className="text-red-400 font-bold">{analytics.threatCount} potential threats</span>.
              </p>
              <p>
                The average detection confidence is <span className="text-blue-400 font-bold">{analytics.avgConfidence}%</span>, indicating high accuracy in classification.
              </p>
              <p>
                Most activity occurs during {hourlyPeaks[0] && hourlyPeaks[0][0] + ':00'} with {hourlyPeaks[0] && hourlyPeaks[0][1]} detections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
