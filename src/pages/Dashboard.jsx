import { useState, useEffect } from 'react'
import Map from '../components/Map'
import { getMockDetections } from '../api/mockData'

export default function Dashboard({ onAlert }) {
  const [detections, setDetections] = useState([])
  const [filteredDetections, setFilteredDetections] = useState([])
  const [selectedDetection, setSelectedDetection] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    loadDetections()
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadDetections()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [detections, filters])

  const loadDetections = async () => {
    setLoading(true)
    try {
      const data = await getMockDetections({ limit: 50 })
      setDetections(data)

      // Check for new threats and create alerts
      const threats = data.filter(
        (d) => (d.class_name === 'human' || d.class_name === 'vehicle') && d.status === 'threat'
      )

      if (threats.length > 0 && onAlert) {
        // Create an alert for the most recent threat
        const recentThreat = threats[0]
        onAlert({
          id: Date.now(),
          type: 'critical',
          message: `${recentThreat.class_name.toUpperCase()} detected in ${recentThreat.zone}!`,
          detection_id: recentThreat.id,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error loading detections:', error)
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...detections]

    // Filter by class
    if (filters.class_name) {
      filtered = filtered.filter((d) => d.class_name === filters.class_name)
    }

    // Filter by zone
    if (filters.zone) {
      filtered = filtered.filter((d) => d.zone === filters.zone)
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((d) => d.status === filters.status)
    }

    // Search by ID
    if (filters.searchId) {
      filtered = filtered.filter((d) =>
        d.id.toLowerCase().includes(filters.searchId.toLowerCase())
      )
    }

    setFilteredDetections(filtered)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="page-dashboard">
      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="map-section">
            <Map
              detections={filteredDetections}
              onMarkerClick={setSelectedDetection}
            />
          </div>
        </div>

        {/* <div className="dashboard-detections">
          <div className="detections-header">
            <h3>Recent Detections</h3>
            {loading && <span className="loading-spinner">⟳</span>}
          </div>

          <motion.div
            className="detections-list"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredDetections.length === 0 ? (
                <motion.div
                  className="no-results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <p>No detections found</p>
                  {Object.values(filters).some((f) => f) && (
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => setFilters({})}
                    >
                      Clear Filters
                    </button>
                  )}
                </motion.div>
              ) : (
                filteredDetections.map((detection, index) => (
                  <DetectionCard
                    key={detection.id}
                    detection={detection}
                    isSelected={selectedDetection?.id === detection.id}
                    onClick={() => setSelectedDetection(detection)}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div> */}
      </div>
    </div>
  )
}
