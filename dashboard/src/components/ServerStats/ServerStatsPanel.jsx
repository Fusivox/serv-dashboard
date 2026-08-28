import { AlertTriangle, RefreshCw, Settings } from 'lucide-react'
import QuickOverview from './QuickOverview'
import CPUCard from './CPUCard'
import MemoryCard from './MemoryCard'
import DiskCard from './DiskCard'
import NetworkCard from './NetworkCard'
import RuntimeCard from './RuntimeCard'

export default function ServerStatsPanel({
  stats,
  history,
  loading,
  isOnline,
  onRefresh,
  onOpenSettings,
  serverUrl,
}) {
  if (loading && !stats) {
    return (
      <div className="stats-panel loading-state">
        <div className="skeleton-card skeleton-header" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    )
  }

  return (
    <div className="stats-panel">
      {/* Disconnection / Warning Banner */}
      {!isOnline && (
        <div className="server-alert-banner">
          <div className="alert-content">
            <AlertTriangle size={18} className="alert-icon" />
            <div className="alert-text">
              <strong>Serveur injoignable</strong>
              <p>
                Impossible de contacter {serverUrl || 'le serveur local'}. Vérifiez que le serveur Go
                est démarré sur le port 8080.
              </p>
            </div>
          </div>
          <div className="alert-actions">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={onOpenSettings}
            >
              <Settings size={14} />
              <span>Configurer URL</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={onRefresh}
            >
              <RefreshCw size={14} />
              <span>Réessayer</span>
            </button>
          </div>
        </div>
      )}

      {/* Host Overview */}
      <QuickOverview
        host={stats?.host}
        uptime={stats?.uptime}
        loadAvg={stats?.load_avg}
      />

      {/* CPU Card */}
      <CPUCard cpu={stats?.cpu} history={history?.cpu} />

      {/* Memory Card */}
      <MemoryCard memory={stats?.memory} history={history?.ram} />

      {/* Disk Card */}
      <DiskCard disk={stats?.disk} />

      {/* Network Card */}
      <NetworkCard network={stats?.network} />

      {/* Backend Runtime Card */}
      <RuntimeCard runtime={stats?.runtime} timestamp={stats?.timestamp} />
    </div>
  )
}
