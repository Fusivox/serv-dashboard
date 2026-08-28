import { WifiOff, RefreshCw } from 'lucide-react'

export default function StatusBadge({ isOnline, latency, loading, error }) {
  if (loading && !isOnline) {
    return (
      <div className="status-badge loading">
        <RefreshCw size={14} className="spin-icon" />
        <span>Connexion...</span>
      </div>
    )
  }

  if (!isOnline || error) {
    return (
      <div className="status-badge offline" title={error || 'Serveur déconnecté'}>
        <WifiOff size={14} />
        <span>Hors ligne</span>
      </div>
    )
  }

  const isHighLatency = latency && latency > 250

  return (
    <div className={`status-badge ${isHighLatency ? 'warning' : 'online'}`}>
      <span className="pulse-dot" />
      <span>En ligne</span>
      {latency !== null && latency !== undefined && (
        <span className="latency-pill">{latency} ms</span>
      )}
    </div>
  )
}
