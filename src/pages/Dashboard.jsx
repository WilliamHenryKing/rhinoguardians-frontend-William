import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiActivity, FiAlertTriangle, FiShield, FiFilter, FiX } from 'react-icons/fi'
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
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Alert Ranger state
  const { activeAlerts, selectAlert, selectedAlertId, isDetailPanelOpen, closeDetailPanel } = useAlertRanger()
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

  const toggleFilters = () => setIsFilterOpen(prev => !prev)
  const closeFilters = () => setIsFilterOpen(false)

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

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)_minmax(0,3fr)] gap-6 md:gap-7 lg:gap-8 xl:gap-10 items-start">
        {/* Sidebar Shell */}
        <div className="order-4 lg:order-1 lg:col-span-1">
          <div className="hidden lg:block sticky top-24">
            <Sidebar filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Mobile/Tablet Drawer */}
          <div className={`lg:hidden fixed inset-0 z-40 transition-opacity ${
            isFilterOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
          >
            <div
              className={`absolute inset-y-0 left-0 w-full max-w-sm bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
                isFilterOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={closeFilters}
                  className="inline-flex items-center justify-center rounded-full p-2 text-slate-300 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close filters"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="h-[calc(100vh-4.5rem)] overflow-y-auto p-4">
                <Sidebar filters={filters} onFilterChange={setFilters} />
              </div>
            </div>
            <div className="absolute inset-0 bg-black/60" onClick={closeFilters} aria-hidden="true" />
          </div>
        </div>

        {/* Map, Stats & Detections */}
        <div className="order-1 lg:order-2 lg:col-span-1 flex flex-col gap-6">
          {/* Map */}
          <div className="relative rounded-2xl border border-white/10 bg-slate-900/40 overflow-hidden h-[60vh] sm:h-[50vh] md:h-[55vh] lg:h-[65vh] xl:h-full min-h-[320px]">
            <Map
              detections={filteredDetections}
              center={mapCenter}
              zoom={mapZoom}
              onMarkerClick={setSelectedDetection}
              onAlertCreated={handleAlertCreated}
              className="h-full"
            />
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Key Metrics</h2>
              <button
                onClick={toggleFilters}
                className="lg:hidden inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20 transition"
              >
                <FiFilter className="h-4 w-4" />
                Filters
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 xl:gap-6">
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
          </div>

          {/* Recent Detections */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 lg:gap-5 xl:gap-6">
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
        <div className="order-3 lg:order-3 lg:col-span-1">
          <div className="sticky top-24 h-full lg:h-[calc(100vh-8rem)] space-y-4">
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
