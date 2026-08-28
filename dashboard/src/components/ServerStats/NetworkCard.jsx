import { ArrowDown, ArrowUp, Network } from 'lucide-react'
import { formatBytes, formatSpeed } from '../../utils/formatters'

export default function NetworkCard({ network }) {
  const downSpeed = network?.download_speed_bps || 0
  const upSpeed = network?.upload_speed_bps || 0
  const bytesRecv = network?.bytes_recv || 0
  const bytesSent = network?.bytes_sent || 0

  const formattedDownSpeed = formatSpeed(downSpeed)
  const formattedUpSpeed = formatSpeed(upSpeed)
  const formattedRecvTotal = formatBytes(bytesRecv, 2)
  const formattedSentTotal = formatBytes(bytesSent, 2)

  return (
    <div className="card stat-card network-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-wrapper network">
            <Network size={18} />
          </div>
          <div>
            <h3 className="card-title">Trafic Réseau</h3>
            <p className="card-subtitle">Débits en temps réel</p>
          </div>
        </div>
      </div>

      <div className="network-speeds-row">
        {/* Download Box */}
        <div className="net-speed-card down">
          <div className="net-speed-top">
            <div className="net-dir-icon down">
              <ArrowDown size={16} />
            </div>
            <span className="net-dir-label">Réception (Download)</span>
          </div>
          <div className="net-speed-value">{formattedDownSpeed}</div>
          <div className="net-total-sub">Total : {formattedRecvTotal.text}</div>
        </div>

        {/* Upload Box */}
        <div className="net-speed-card up">
          <div className="net-speed-top">
            <div className="net-dir-icon up">
              <ArrowUp size={16} />
            </div>
            <span className="net-dir-label">Envoi (Upload)</span>
          </div>
          <div className="net-speed-value">{formattedUpSpeed}</div>
          <div className="net-total-sub">Total : {formattedSentTotal.text}</div>
        </div>
      </div>
    </div>
  )
}
