import { useState } from 'react'
import { Cpu, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import ProgressBar from '../common/ProgressBar'
import Sparkline from '../common/Sparkline'
import { formatPercent, getStatusColor } from '../../utils/formatters'

export default function CPUCard({ cpu, history = [] }) {
  const [showAllCores, setShowAllCores] = useState(false)

  const totalPercent = cpu?.total_percent || 0
  const perCore = cpu?.per_core || []
  const logicalCores = cpu?.cores_logical || perCore.length || 1
  const physicalCores = cpu?.cores_physical || Math.ceil(logicalCores / 2)
  const modelName = cpu?.model_name || 'Processeur multi-cœurs'
  const mhz = cpu?.mhz ? `${(cpu.mhz / 1000).toFixed(2)} GHz` : ''

  const status = getStatusColor(totalPercent)

  return (
    <div className="card stat-card cpu-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-wrapper cpu">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="card-title">Processeur (CPU)</h3>
            <p className="card-subtitle" title={modelName}>
              {modelName.length > 32 ? `${modelName.substring(0, 32)}...` : modelName}
            </p>
          </div>
        </div>

        <div className="stat-highlight">
          <span className="stat-big-number" style={{ color: status.bg }}>
            {formatPercent(totalPercent, 1)}
          </span>
        </div>
      </div>

      {/* Main CPU Progress Bar */}
      <div className="stat-main-bar">
        <ProgressBar percent={totalPercent} height={10} animated />
      </div>

      {/* Live Sparkline History */}
      <div className="history-section">
        <div className="history-header">
          <span className="history-label">Historique d'activité</span>
          <span className="history-sublabel">30 derniers relevés</span>
        </div>
        <Sparkline data={history} color={status.bg} height={42} max={100} />
      </div>

      {/* Quick Specs Badges */}
      <div className="specs-bar">
        <div className="spec-badge">
          <Zap size={12} />
          <span>{logicalCores} Cœurs ({physicalCores} Physiques)</span>
        </div>
        {mhz && <div className="spec-badge font-mono">{mhz}</div>}
      </div>

      {/* Per Core Section */}
      {perCore.length > 0 && (
        <div className="per-core-container">
          <button
            type="button"
            className="toggle-cores-btn"
            onClick={() => setShowAllCores((prev) => !prev)}
          >
            <span>Détail par cœur ({perCore.length})</span>
            {showAllCores ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showAllCores && (
            <div className="cores-grid">
              {perCore.map((usage, idx) => {
                const coreStatus = getStatusColor(usage)
                return (
                  <div key={idx} className="core-item">
                    <div className="core-label-row">
                      <span className="core-name">C{idx}</span>
                      <span className="core-val" style={{ color: coreStatus.bg }}>
                        {usage.toFixed(0)}%
                      </span>
                    </div>
                    <ProgressBar percent={usage} height={5} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
