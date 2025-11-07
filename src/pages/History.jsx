import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiDownload, FiFilter } from 'react-icons/fi'
import DetectionCard from '../components/DetectionCard'
import Sidebar from '../components/Sidebar'
import { getMockDetections } from '../api/mockData'

export default function History({ onAlert }) {
  const [detections, setDetections] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    class: 'All',
    dateRange: 'all',
    minConfidence: 0
  })
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const data = await getMockDetections()
      setDetections(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    } catch (error) {
      console.error('Failed to load history:', error)
      onAlert({
        type: 'error',
        title: 'Error',
        message: 'Failed to load detection history'
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
    if (searchQuery && !d.class_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const handleExport = () => {
    const csv = 'ID,Class,Confidence,Latitude,Longitude,Timestamp\n' +
      filteredDetections.map(d => 
        d.id + ',' + d.class_name + ',' + d.confidence + ',' + d.gps_lat + ',' + d.gps_lng + ',' + d.timestamp
      ).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'detections-' + new Date().toISOString() + '.csv'
    a.click()

    onAlert({
      type: 'success',
      title: 'Export Complete',
      message: 'Detection history exported successfully'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Detection History
          </h1>
          <p className="text-slate-400">
            Browse and search through all past detections
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
        >
          <FiDownload className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search detections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={'flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ' + (showFilters ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900/50 text-slate-400 border border-white/10 hover:bg-slate-800')}
        >
          <FiFilter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Filters Sidebar (Mobile) */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Sidebar 
            filters={filters} 
            onFilterChange={setFilters}
            onClose={() => setShowFilters(false)}
          />
        </motion.div>
      )}

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Results ({filteredDetections.length})
          </h2>
          <span className="text-sm text-slate-400">
            Sorted by most recent
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredDetections.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-white/10">
            <p className="text-slate-400">No detections found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDetections.map((detection, i) => (
              <motion.div
                key={detection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <DetectionCard detection={detection} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
