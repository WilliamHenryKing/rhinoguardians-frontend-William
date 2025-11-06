export default function Header({ currentPage, onNavigate }) {
  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'history', label: 'History', icon: '📚' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ]

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <h1>🦏 RhinoGuardians</h1>
          <p className="header-subtitle">Real-Time Wildlife Detection Dashboard</p>
        </div>

        <nav className="header-nav">
          {pages.map((page) => (
            <button
              key={page.id}
              className={`nav-button ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => onNavigate(page.id)}
            >
              <span className="nav-icon">{page.icon}</span>
              <span className="nav-label">{page.label}</span>
            </button>
          ))}
        </nav>

        <div className="header-info">
          <div className="status-indicator">
            <span className="status-dot status-online"></span>
            <span className="status-text">Live</span>
          </div>
        </div>
      </div>
    </header>
  )
}
