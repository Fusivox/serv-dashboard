import { Server, Clock, Activity } from 'lucide-react'
import { formatUptimeSeconds } from '../../utils/formatters'

export default function QuickOverview({ host, uptime, loadAvg }) {
  const osName = host?.platform || host?.os || 'Linux'
  const osVersion = host?.platform_version || ''
  const hostname = host?.hostname || 'Serveur'
  const arch = host?.kernel_arch || 'x86_64'
  const uptimeStr = host?.uptime_formatted || formatUptimeSeconds(uptime || host?.uptime || 0)
  const kernel = host?.kernel_version || ''

  return (
    <div className="card overview-card">
      <div className="overview-header">
        <div className="host-icon-box">
          <Server size={22} className="host-icon" />
        </div>
        <div className="host-details">
          <div className="host-title-row">
            <h2 className="hostname-title" title={hostname}>
              {hostname}
            </h2>
            <span className="badge badge-os">
              {osName} {osVersion}
            </span>
            <span className="badge badge-arch">{arch}</span>
          </div>
          {kernel && <p className="kernel-text">Kernel: {kernel}</p>}
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-item">
          <div className="overview-item-label">
            <Clock size={14} />
            <span>Uptime</span>
          </div>
          <span className="overview-item-value uptime-val">{uptimeStr}</span>
        </div>

        <div className="overview-item">
          <div className="overview-item-label">
            <Activity size={14} />
            <span>Load Avg (1 / 5 / 15m)</span>
          </div>
          <div className="load-avg-row">
            <span className="load-pill load-1">
              {loadAvg?.load1?.toFixed(2) ?? '0.00'}
            </span>
            <span className="load-pill load-5">
              {loadAvg?.load5?.toFixed(2) ?? '0.00'}
            </span>
            <span className="load-pill load-15">
              {loadAvg?.load15?.toFixed(2) ?? '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
