import { Terminal, CheckCircle } from 'lucide-react'
import { formatUptimeSeconds } from '../../utils/formatters'

export default function RuntimeCard({ runtime, timestamp }) {
  const goVersion = runtime?.version || 'Go'
  const goroutines = runtime?.num_goroutine || 0
  const processUptime = formatUptimeSeconds(runtime?.process_uptime_seconds || 0)
  const lastUpdateDate = timestamp ? new Date(timestamp).toLocaleTimeString() : ''

  return (
    <div className="card stat-card runtime-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-wrapper runtime">
            <Terminal size={18} />
          </div>
          <div>
            <h3 className="card-title">Processus Serveur</h3>
            <p className="card-subtitle">Moteur Go Backend</p>
          </div>
        </div>
        <div className="engine-badge">
          <CheckCircle size={13} className="engine-icon" />
          <span>{goVersion}</span>
        </div>
      </div>

      <div className="runtime-grid">
        <div className="runtime-stat-item">
          <span className="runtime-stat-label">Goroutines actives</span>
          <span className="runtime-stat-val font-mono">{goroutines}</span>
        </div>
        <div className="runtime-stat-item">
          <span className="runtime-stat-label">Uptime Processus</span>
          <span className="runtime-stat-val font-mono">{processUptime}</span>
        </div>
        {lastUpdateDate && (
          <div className="runtime-stat-item">
            <span className="runtime-stat-label">Dernier relevé</span>
            <span className="runtime-stat-val font-mono">{lastUpdateDate}</span>
          </div>
        )}
      </div>
    </div>
  )
}
