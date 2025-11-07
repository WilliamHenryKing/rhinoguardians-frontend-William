import { useState, useEffect } from 'react'
import DetectionCard from '../components/DetectionCard'
import { getMockDetections } from '../api/mockData'
import { formatDateRange, formatDate } from '../utils/formatDate'
import { MdSearch, MdClose } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import { panelAnimations, durations, easings } from '../utils/motionConfig'

export default function History() {
  const [detections, setDetections] = useState([])
  const [filteredDetections, setFilteredDetections] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    class_name: '',
    zone: '',
    dateRange: 'all',
    sortBy: 'newest'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDetection, setSelectedDetection] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [detections, filters, searchTerm])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const data = await getMockDetections({ limit: 100 })
      setDetections(data)
    } catch (error) {
      console.error('Error loading history:', error)
    }
    setLoading(false)
  }

  const applyFiltersAndSort = () => {
    let filtered = [...detections]

    // Apply class filter
    if (filters.class_name) {
      filtered = filtered.filter((d) => d.class_name === filters.class_name)
    }

    // Apply zone filter
    if (filters.zone) {
      filtered = filtered.filter((d) => d.zone === filters.zone)
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()

      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
      }

      filtered = filtered.filter((d) => new Date(d.timestamp) >= cutoffDate)
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.zone.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp)
      const dateB = new Date(b.timestamp)

      switch (filters.sortBy) {
        case 'newest':
          return dateB - dateA
        case 'oldest':
          return dateA - dateB
        case 'confidence':
          return b.confidence - a.confidence
        default:
          return 0
      }
    })

    setFilteredDetections(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const resetFilters = () => {
    setFilters({
      class_name: '',
      zone: '',
      dateRange: 'all',
      sortBy: 'newest'
    })
    setSearchTerm('')
  }

  // Group detections by date
  const groupByDate = (detections) => {
    const grouped = {}
    detections.forEach((detection) => {
      const date = new Date(detection.timestamp).toLocaleDateString()
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(detection)
    })
    return grouped
  }

  const groupedDetections = groupByDate(filteredDetections)

  return (
    <div className="page-history">
      <motion.div
        className="history-header"
        initial={panelAnimations.fadeInUp.initial}
        animate={panelAnimations.fadeInUp.animate}
        transition={panelAnimations.fadeInUp.transition}
      >
        <div className="header-title">
          <h2>Detection History</h2>
          <p className="subtitle">Browse and search past detections</p>
        </div>
      </motion.div>

      <motion.div
        className="history-controls"
        initial={panelAnimations.fadeInUp.initial}
        animate={panelAnimations.fadeInUp.animate}
        transition={{ ...panelAnimations.fadeInUp.transition, delay: 0.1 }}
      >
        <div className="search-bar">
          <div style={{ position: 'relative' }}>
            <MdSearch
              size={24}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search detections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ paddingLeft: '50px' }}
            />
            {searchTerm && (
              <MdClose
                size={24}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer'
                }}
                onClick={() => setSearchTerm('')}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-6">
          <select
            value={filters.class_name}
            onChange={(e) => handleFilterChange('class_name', e.target.value)}
            className="filter-select"
          >
            <option value="">All Classes</option>
            <option value="rhino">Rhino</option>
            <option value="human">Human</option>
            <option value="vehicle">Vehicle</option>
          </select>

          <select
            value={filters.zone}
            onChange={(e) => handleFilterChange('zone', e.target.value)}
            className="filter-select"
          >
            <option value="">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="confidence">Highest Confidence</option>
          </select>

          <motion.button
            onClick={resetFilters}
            className="btn btn-secondary sm:col-span-2 lg:col-span-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        </div>

        <motion.div
          className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base lg:text-lg font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Showing {filteredDetections.length} of {detections.length} detections
        </motion.div>
      </motion.div>

      <motion.div
        className="history-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="loading-state">Loading history...</div>
        ) : filteredDetections.length === 0 ? (
          <motion.div
            className="no-results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p>No detections found</p>
            <button onClick={resetFilters} className="btn btn-secondary btn-small">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="history-timeline">
            <AnimatePresence>
              {Object.entries(groupedDetections).map(([date, items], groupIndex) => (
                <motion.div
                  key={date}
                  className="timeline-group"
                  initial={panelAnimations.fadeInUp.initial}
                  animate={panelAnimations.fadeInUp.animate}
                  exit={panelAnimations.fadeInUp.exit}
                  transition={{ ...panelAnimations.fadeInUp.transition, delay: groupIndex * 0.08 }}
                >
                  <motion.div
                    className="timeline-date"
                    initial={panelAnimations.slideInRight.initial}
                    animate={panelAnimations.slideInRight.animate}
                    transition={{ ...panelAnimations.slideInRight.transition, delay: groupIndex * 0.08 + 0.05 }}
                  >
                    <h3>{date}</h3>
                    <motion.span
                      className="count"
                      initial={panelAnimations.scaleIn.initial}
                      animate={panelAnimations.scaleIn.animate}
                      transition={{ ...panelAnimations.scaleIn.transition, delay: groupIndex * 0.08 + 0.1 }}
                    >
                      {items.length} detections
                    </motion.span>
                  </motion.div>
                  <motion.div
                    className="timeline-items"
                    initial="hidden"
                    animate="visible"
                    variants={panelAnimations.staggerContainer}
                  >
                    {items.map((detection) => (
                      <DetectionCard
                        key={detection.id}
                        detection={detection}
                        isSelected={selectedDetection?.id === detection.id}
                        onClick={() => setSelectedDetection(detection)}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}
