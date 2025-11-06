import { useState } from 'react'

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

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Controls</h2>
      </div>

      <div className="controls-section">
        <button onClick={onRefresh} className="btn btn-primary btn-full">
          🔄 Refresh Detections
        </button>
      </div>

      <div className="filters-section">
        <h3>Filters</h3>

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

        <button onClick={handleReset} className="btn btn-secondary btn-full">
          Clear Filters
        </button>
      </div>

      <div className="stats-section">
        <h3>Statistics</h3>
        <div className="stat-item">
          <span className="stat-label">Total Detections:</span>
          <span className="stat-value">{detectionCount}</span>
        </div>
      </div>
    </div>
  )
}
