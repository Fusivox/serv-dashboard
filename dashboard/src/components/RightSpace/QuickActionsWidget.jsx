import { useState } from 'react'
import { Zap, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react'

export default function QuickActionsWidget({ onRefresh, serverUrl }) {
  const [copied, setCopied] = useState(false)
  const [pinging, setPinging] = useState(false)
  const [pingResult, setPingResult] = useState(null)

  const handleCopyEndpoint = () => {
    const url = serverUrl || window.location.origin
    navigator.clipboard.writeText(`${url}/api/stats`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTestPing = async () => {
    setPinging(true)
    setPingResult(null)
    const start = performance.now()
    try {
      const url = (serverUrl || '').replace(/\/+$/, '')
      const res = await fetch(`${url || ''}/ping`)
      const elapsed = Math.round(performance.now() - start)
      if (res.ok) {
        setPingResult({ success: true, text: `Pong! ${elapsed} ms (HTTP 200 OK)` })
      } else {
        setPingResult({ success: false, text: `Erreur HTTP ${res.status}` })
      }
    } catch {
      setPingResult({ success: false, text: 'Serveur inaccessible' })
    } finally {
      setPinging(false)
    }
  }

  return (
    <div className="card widget-card">
      <div className="widget-header">
        <div className="widget-title-box">
          <Zap size={18} className="widget-icon accent" />
          <h3 className="widget-title">Actions Rapides</h3>
        </div>
        <span className="widget-badge">Utilitaire</span>
      </div>

      <div className="quick-actions-grid">
        <button
          type="button"
          className="action-btn"
          onClick={onRefresh}
          title="Actualiser les données immédiatement"
        >
          <RefreshCw size={16} />
          <span>Rafraîchir Stats</span>
        </button>

        <button
          type="button"
          className="action-btn"
          onClick={handleTestPing}
          disabled={pinging}
          title="Tester le endpoint /ping"
        >
          <ShieldCheck size={16} />
          <span>{pinging ? 'Test...' : 'Tester /ping'}</span>
        </button>

        <button
          type="button"
          className="action-btn"
          onClick={handleCopyEndpoint}
          title="Copier l'URL de l'API /api/stats"
        >
          {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
          <span>{copied ? 'Copié !' : 'Copier URL API'}</span>
        </button>
      </div>

      {pingResult && (
        <div
          className={`ping-result-box ${pingResult.success ? 'ping-success' : 'ping-error'}`}
        >
          <span className="pulse-dot-small" />
          <span>{pingResult.text}</span>
        </div>
      )}
    </div>
  )
}
