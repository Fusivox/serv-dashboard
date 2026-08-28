import { HardDrive } from 'lucide-react'
import ProgressBar from '../common/ProgressBar'
import { formatBytes, formatPercent, getStatusColor } from '../../utils/formatters'

export default function DiskCard({ disk }) {
  const total = disk?.total || 0
  const used = disk?.used || 0
  const free = disk?.free || 0
  const percent = disk?.used_percent || (total > 0 ? (used / total) * 100 : 0)
  const path = disk?.path || '/'
  const fsType = disk?.fs_type || 'Système'

  const formattedUsed = formatBytes(used, 1)
  const formattedTotal = formatBytes(total, 1)
  const formattedFree = formatBytes(free, 1)

  const status = getStatusColor(percent)

  return (
    <div className="card stat-card disk-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-wrapper disk">
            <HardDrive size={18} />
          </div>
          <div>
            <h3 className="card-title">Stockage Disque ({path})</h3>
            <p className="card-subtitle">Système de fichiers : {fsType}</p>
          </div>
        </div>

        <div className="stat-highlight">
          <span className="stat-big-number" style={{ color: status.bg }}>
            {formatPercent(percent, 1)}
          </span>
        </div>
      </div>

      <div className="stat-main-bar">
        <ProgressBar percent={percent} height={10} animated />
      </div>

      <div className="disk-stats-grid">
        <div className="disk-stat-box">
          <span className="disk-stat-label">Utilisé</span>
          <span className="disk-stat-val text-used">{formattedUsed.text}</span>
        </div>
        <div className="disk-stat-box">
          <span className="disk-stat-label">Disponible</span>
          <span className="disk-stat-val text-free">{formattedFree.text}</span>
        </div>
        <div className="disk-stat-box">
          <span className="disk-stat-label">Capacité Totale</span>
          <span className="disk-stat-val">{formattedTotal.text}</span>
        </div>
      </div>
    </div>
  )
}
