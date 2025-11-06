import { useState } from 'react'
import { MdRefresh, MdClear, MdFilterList, MdBarChart } from 'react-icons/md'
import { motion } from 'framer-motion'

export default function Sidebar({ onFilterChange, onRefresh, detectionCount }) {
  const [filters, setFilters] = useState({
    class_name: '',
    zone: '',
    status: '',
    searchId: ''
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      class_name: '',
      zone: '',
      status: '',
      searchId: ''
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="sidebar"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="sidebar-header" variants={itemVariants}>
        <h2>Controls</h2>
      </motion.div>

      <motion.div className="controls-section" variants={itemVariants}>
        <motion.button
          onClick={onRefresh}
          className="btn btn-primary btn-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MdRefresh size={18} />
          Refresh Detections
        </motion.button>
      </motion.div>

      <motion.div className="filters-section" variants={itemVariants}>
        <h3><MdFilterList style={{ display: 'inline', marginRight: '8px' }} />Filters</h3>

        {/* Search by ID */}
        <div className="filter-group">
          <label htmlFor="search-id">Search by ID</label>
          <input
            id="search-id"
            type="text"
            placeholder="e.g., DET-001"
            value={filters.searchId}
            onChange={(e) => handleFilterChange('searchId', e.target.value)}
            className="filter-input"
          />
        </div>

        {/* Filter by Class */}
        <div className="filter-group">
          <label htmlFor="class-filter">Detection Class</label>
          <select
            id="class-filter"
            value={filters.class_name}
            onChange={(e) => handleFilterChange('class_name', e.target.value)}
            className="filter-select"
          >
            <option value="">All Classes</option>
            <option value="rhino">Rhino</option>
            <option value="human">Human</option>
            <option value="vehicle">Vehicle</option>
          </select>
        </div>

        {/* Filter by Zone */}
        <div className="filter-group">
          <label htmlFor="zone-filter">Location Zone</label>
          <select
            id="zone-filter"
            value={filters.zone}
            onChange={(e) => handleFilterChange('zone', e.target.value)}
            className="filter-select"
          >
            <option value="">All Zones</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
            <option value="Zone C">Zone C</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="threat">Threat</option>
            <option value="investigating">Investigating</option>
          </select>
        </div>

        <motion.button
          onClick={handleReset}
          className="btn btn-secondary btn-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MdClear size={18} />
          Clear Filters
        </motion.button>
      </motion.div>

      <motion.div className="stats-section" variants={itemVariants}>
        <h3><MdBarChart style={{ display: 'inline', marginRight: '8px' }} />Statistics</h3>
        <div className="stat-item">
          <span className="stat-label">Total Detections:</span>
          <motion.span
            className="stat-value"
            key={detectionCount}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {detectionCount}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  )
}
