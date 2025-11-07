import { motion } from 'framer-motion'
import { FiFilter, FiX } from 'react-icons/fi'

export default function Sidebar({ filters, onFilterChange, onClose }) {
  const classOptions = ['All', 'Rhino', 'Human', 'Vehicle', 'Poacher']

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full lg:w-80 bg-slate-900/50 backdrop-blur-lg border border-white/10 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiFilter className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Filters</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Class Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Detection Class
          </label>
          <div className="space-y-2">
            {classOptions.map((option) => (
              <button
                key={option}
                onClick={() => onFilterChange({ ...filters, class: option })}
                className={'w-full px-4 py-2 rounded-lg text-left text-sm transition-all ' + (filters.class === option ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800/50 text-slate-400 border border-transparent hover:bg-slate-800')}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Date Range
          </label>
          <select
            value={filters.dateRange || '24h'}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Confidence Threshold */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Min Confidence: {filters.minConfidence || 0}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minConfidence || 0}
            onChange={(e) => onFilterChange({ ...filters, minConfidence: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => onFilterChange({ class: 'All', dateRange: '24h', minConfidence: 0 })}
          className="w-full px-4 py-2 rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all"
        >
          Clear Filters
        </button>
      </div>
    </motion.div>
  )
}
