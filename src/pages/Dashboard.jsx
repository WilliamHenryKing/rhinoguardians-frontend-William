import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiActivity, FiAlertTriangle, FiShield } from 'react-icons/fi'
import Map from '../components/Map'
import DetectionCard from '../components/DetectionCard'
import Sidebar from '../components/Sidebar'
import ActiveAlertsPanel from '../components/ActiveAlertsPanel'
import AlertDetailPanel from '../components/AlertDetailPanel'
import { getMockDetections } from '../api/mockData'
import { useAlertRanger } from '../context/AlertRangerContext'

export default function Dashboard({ onAlert }) {
  const [detections, setDetections] = useState([])
  const [selectedDetection, setSelectedDetection] = useState(null)
  const [filters, setFilters] = useState({
    class: 'All',
    dateRange: '24h',
    minConfidence: 0
  })
  const [loading, setLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState([-23.8859, 31.5205])
  const [mapZoom, setMapZoom] = useState(10)

  // Alert Ranger state
  const { activeAlerts, selectAlert, selectedAlertId, isDetailPanelOpen, closeDetailPanel } = useAlertRanger()
  const mapRef = useRef(null)

  useEffect(() => {
    loadDetections()
  }, [])

  const loadDetections = async () => {
    setLoading(true)
    try {
      const data = await getMockDetections()
      setDetections(data)
      
      // Check for threats and send alert
      const threats = data.filter(d => 
        d.class_name?.toLowerCase().includes('human') || 
        d.class_name?.toLowerCase().includes('poacher')
      )
      
      if (threats.length > 0) {
        onAlert({
          type: 'threat',
          title: 'Threat Detected',
          message: threats.length + ' potential threat(s) detected in the area!'
        })
      }
    } catch (error) {
      console.error('Failed to load detections:', error)
      onAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load detection data'
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredDetections = detections.filter(d => {
    if (filters.class !== 'All' && !d.class_name?.toLowerCase().includes(filters.class.toLowerCase())) {
      return false
    }
    if (d.confidence * 100 < filters.minConfidence) {
      return false
    }
    return true
  })

  const stats = {
    total: filteredDetections.length,
    rhinos: filteredDetections.filter(d => d.class_name?.toLowerCase().includes('rhino')).length,
    threats: filteredDetections.filter(d =>
      d.class_name?.toLowerCase().includes('human') ||
      d.class_name?.toLowerCase().includes('poacher')
    ).length,
    activeAlerts: activeAlerts.length
  }

  // Handle alert created - show success notification
  const handleAlertCreated = (alert) => {
    onAlert({
      type: 'success',
      title: 'Alert Sent',
      message: `Alert ${alert.id} sent to ranger network. Awaiting acknowledgment.`
    })

    // Focus map on alert location if it's an alert object
    if (alert.location) {
      setMapCenter([alert.location.lat, alert.location.lng])
      setMapZoom(14)
    }
  }

  // Handle alert selection from panel
  const handleAlertSelect = (alert) => {
    selectAlert(alert.id)
  }

  // Handle map focus from alert panel
  const handleMapFocus = (location, alert) => {
    setMapCenter(location)
    setMapZoom(14)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Live Detection Dashboard
        </h1>
        <p className="text-slate-400">
          Real-time monitoring of rhino populations and potential threats
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Detections', value: stats.total, icon: FiMapPin, color: 'blue' },
          { label: 'Rhinos Detected', value: stats.rhinos, icon: FiShield, color: 'emerald' },
          { label: 'Ranger Alerts', value: stats.activeAlerts, icon: FiActivity, color: 'amber' },
          { label: 'Threats', value: stats.threats, icon: FiAlertTriangle, color: 'red' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={'bg-' + stat.color + '-500/10 border border-' + stat.color + '-500/20 rounded-xl p-4 backdrop-blur-sm'}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={'w-5 h-5 text-' + stat.color + '-400'} />
              <span className={'text-2xl font-bold text-' + stat.color + '-300'}>
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="xl:col-span-2">
          <Sidebar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Map and Detections */}
        <div className="xl:col-span-7 space-y-6">
          {/* Map */}
          <div className="h-96 lg:h-[500px]">
            <Map
              ref={mapRef}
              detections={filteredDetections}
              center={mapCenter}
              zoom={mapZoom}
              onMarkerClick={setSelectedDetection}
              onAlertCreated={handleAlertCreated}
            />
          </div>

          {/* Recent Detections */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Recent Detections ({filteredDetections.length})
            </h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredDetections.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-white/10">
                <p className="text-slate-400">No detections found matching your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDetections.slice(0, 6).map((detection) => (
                  <DetectionCard
                    key={detection.id}
                    detection={detection}
                    onClick={() => setSelectedDetection(detection)}
                    onAlertCreated={handleAlertCreated}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Alerts Panel */}
        <div className="xl:col-span-3">
          <div className="sticky top-24 h-[calc(100vh-8rem)]">
            <ActiveAlertsPanel
              onAlertSelect={handleAlertSelect}
              onMapFocus={handleMapFocus}
            />
          </div>
        </div>
      </div>

      {/* Alert Detail Panel */}
      <AlertDetailPanel
        alertId={selectedAlertId}
        isOpen={isDetailPanelOpen}
        onClose={closeDetailPanel}
      />
    </div>
  )
}
