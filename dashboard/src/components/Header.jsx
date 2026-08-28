import {
  Activity,
  Settings,
  RefreshCw,
  Clock,
  LayoutGrid,
} from 'lucide-react'
import StatusBadge from './common/StatusBadge'

export default function Header({
  isOnline,
  latency,
  loading,
  error,
  intervalMs,
  onChangeInterval,
  onRefresh,
  onOpenSettings,
  activeMobileTab,
  onSelectMobileTab,
}) {
  const intervals = [
    { label: '1s (Rapide)', value: 1000 },
    { label: '2s (Normal)', value: 2000 },
    { label: '5s (Éco)', value: 5000 },
    { label: 'Pause', value: 0 },
  ]

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand & Logo */}
        <div className="brand-group">
          <div className="brand-logo-box">
            <Activity size={22} className="brand-logo-icon" />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">ServDashboard</h1>
              <span className="brand-version-badge">v2.0</span>
            </div>
            <p className="brand-tagline">Monitoring & Gestion Serveur</p>
          </div>
        </div>

        {/* Server Status Badge */}
        <div className="header-status-slot">
          <StatusBadge
            isOnline={isOnline}
            latency={latency}
            loading={loading}
            error={error}
          />
        </div>

        {/* Action Controls */}
        <div className="header-controls">
          {/* Polling Interval Select */}
          <div className="interval-select-box">
            <Clock size={14} className="control-icon" />
            <select
              className="interval-select"
              value={intervalMs}
              onChange={(e) => onChangeInterval(Number(e.target.value))}
              aria-label="Fréquence de rafraîchissement"
            >
              {intervals.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Manual Refresh Button */}
          <button
            type="button"
            className="btn btn-icon"
            onClick={onRefresh}
            title="Rafraîchir manuellement"
            aria-label="Rafraîchir"
          >
            <RefreshCw size={16} className={loading ? 'spin-icon' : ''} />
          </button>

          {/* Settings Button */}
          <button
            type="button"
            className="btn btn-icon"
            onClick={onOpenSettings}
            title="Paramètres de connexion serveur"
            aria-label="Paramètres"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="mobile-tab-nav">
        <button
          type="button"
          className={`mobile-tab-btn ${activeMobileTab === 'stats' ? 'active' : ''}`}
          onClick={() => onSelectMobileTab('stats')}
        >
          <Activity size={16} />
          <span>Stats Serveur</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${activeMobileTab === 'modules' ? 'active' : ''}`}
          onClick={() => onSelectMobileTab('modules')}
        >
          <LayoutGrid size={16} />
          <span>Modules & Outils</span>
        </button>
      </div>
    </header>
  )
}
