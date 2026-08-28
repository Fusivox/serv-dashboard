import { Database, Layers } from 'lucide-react'
import ProgressBar from '../common/ProgressBar'
import Sparkline from '../common/Sparkline'
import { formatBytes, formatPercent, getStatusColor } from '../../utils/formatters'

export default function MemoryCard({ memory, history = [] }) {
  const ramTotal = memory?.total || 0
  const ramUsed = memory?.used || 0
  const ramFree = memory?.free || 0
  const ramAvailable = memory?.available || ramFree
  const ramPercent = memory?.used_percent || (ramTotal > 0 ? (ramUsed / ramTotal) * 100 : 0)

  const swapTotal = memory?.swap_total || 0
  const swapUsed = memory?.swap_used || 0
  const swapPercent = memory?.swap_percent || (swapTotal > 0 ? (swapUsed / swapTotal) * 100 : 0)

  const formattedUsed = formatBytes(ramUsed, 2)
  const formattedTotal = formatBytes(ramTotal, 2)
  const formattedFree = formatBytes(ramAvailable, 2)

  const formattedSwapUsed = formatBytes(swapUsed, 2)
  const formattedSwapTotal = formatBytes(swapTotal, 2)

  const status = getStatusColor(ramPercent)

  return (
    <div className="card stat-card memory-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-wrapper ram">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="card-title">Mémoire Vive (RAM)</h3>
            <p className="card-subtitle">
              {formattedUsed.text} / {formattedTotal.text}
            </p>
          </div>
        </div>

        <div className="stat-highlight">
          <span className="stat-big-number" style={{ color: status.bg }}>
            {formatPercent(ramPercent, 1)}
          </span>
        </div>
      </div>

      {/* Main RAM Progress Bar */}
      <div className="stat-main-bar">
        <ProgressBar percent={ramPercent} height={10} animated />
      </div>

      {/* Memory breakdown tags */}
      <div className="mem-tags-row">
        <div className="mem-tag">
          <span className="mem-tag-dot used" />
          <span className="mem-tag-label">Utilisée:</span>
          <span className="mem-tag-val">{formattedUsed.text}</span>
        </div>
        <div className="mem-tag">
          <span className="mem-tag-dot free" />
          <span className="mem-tag-label">Disponible:</span>
          <span className="mem-tag-val">{formattedFree.text}</span>
        </div>
      </div>

      {/* Live Sparkline History */}
      <div className="history-section">
        <div className="history-header">
          <span className="history-label">Tendance d'utilisation RAM</span>
          <span className="history-sublabel">30 derniers relevés</span>
        </div>
        <Sparkline data={history} color="#8b5cf6" height={42} max={100} />
      </div>

      {/* Swap Section */}
      {swapTotal > 0 && (
        <div className="swap-section">
          <div className="swap-header">
            <div className="swap-title">
              <Database size={13} />
              <span>Mémoire Swap</span>
            </div>
            <span className="swap-values">
              {formattedSwapUsed.text} / {formattedSwapTotal.text} ({swapPercent.toFixed(0)}%)
            </span>
          </div>
          <ProgressBar percent={swapPercent} height={5} colorScheme="purple" />
        </div>
      )}
    </div>
  )
}
