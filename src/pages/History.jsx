import { useState, useEffect } from 'react'
import DetectionCard from '../components/DetectionCard'
import { getMockDetections } from '../api/mockData'
import { formatDateRange, formatDate } from '../utils/formatDate'

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
      <div className="history-header">
        <div className="header-title">
          <h2>Detection History</h2>
          <p className="subtitle">Browse and search past detections</p>
        </div>
      </div>

      <div className="history-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search detections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-row">
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

          <button onClick={resetFilters} className="btn btn-secondary">
            Reset
          </button>
        </div>

        <div className="results-summary">
          Showing {filteredDetections.length} of {detections.length} detections
        </div>
      </div>

      <div className="history-content">
        {loading ? (
          <div className="loading-state">Loading history...</div>
        ) : filteredDetections.length === 0 ? (
          <div className="no-results">
            <p>No detections found</p>
            <button onClick={resetFilters} className="btn btn-secondary btn-small">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="history-timeline">
            {Object.entries(groupedDetections).map(([date, items]) => (
              <div key={date} className="timeline-group">
                <div className="timeline-date">
                  <h3>{date}</h3>
                  <span className="count">{items.length} detections</span>
                </div>
                <div className="timeline-items">
                  {items.map((detection) => (
                    <DetectionCard
                      key={detection.id}
                      detection={detection}
                      isSelected={selectedDetection?.id === detection.id}
                      onClick={() => setSelectedDetection(detection)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
