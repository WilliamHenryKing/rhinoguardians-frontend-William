import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiDownload, FiFilter, FiX } from 'react-icons/fi'
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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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

  const openFilters = () => setIsFilterOpen(true)
  const closeFilters = () => setIsFilterOpen(false)

  return (
    <div className="md:grid md:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] md:gap-6 lg:gap-8 xl:gap-10 md:items-start">
      <div className="hidden md:block sticky top-24 h-fit">
        <Sidebar filters={filters} onFilterChange={setFilters} />
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">
              Detection History
            </h1>
            <p className="text-sm md:text-base text-slate-400">
              Browse and search through all past detections
            </p>
          </div>
          <button
            onClick={handleExport}
            aria-label="Export detections as CSV"
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 text-white transition-colors hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 lg:w-auto lg:h-auto lg:rounded-lg lg:px-4 lg:py-2 lg:gap-2"
          >
            <FiDownload className="w-5 h-5" />
            <span className="hidden lg:inline text-sm font-medium">Export CSV</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search detections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none scroll-mt-28"
          />
        </div>

        {/* Mobile/Tablet Drawer */}
        <div
          className={`md:hidden fixed inset-0 z-40 transition-opacity ${
            isFilterOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div
            className={`absolute inset-y-0 right-0 w-full max-w-sm bg-slate-900/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out ${
              isFilterOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
              <h3 className="text-base font-semibold text-white">Filters</h3>
              <button
                onClick={closeFilters}
                className="inline-flex items-center justify-center rounded-full p-2 text-slate-300 hover:text-white hover:bg-white/10 transition"
                aria-label="Close filters"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="h-[calc(100vh-4.5rem)] overflow-y-auto p-4 pb-10">
              <Sidebar filters={filters} onFilterChange={setFilters} onClose={closeFilters} />
            </div>
          </div>
          <div className="absolute inset-0 bg-black/60" onClick={closeFilters} aria-hidden="true" />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="sticky top-20 z-20 bg-slate-950/80 backdrop-blur border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white md:text-xl">
                Results ({filteredDetections.length})
              </h2>
              <span className="text-xs md:text-sm text-slate-400">
                Sorted by most recent
              </span>
            </div>
            <button
              onClick={openFilters}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20 transition md:hidden"
              aria-label="Open filters"
            >
              <FiFilter className="w-5 h-5" />
            </button>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-5 xl:gap-6">
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
    </div>
  )
}
