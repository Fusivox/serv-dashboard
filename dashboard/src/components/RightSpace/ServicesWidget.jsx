import { Server, Globe, Database } from 'lucide-react'

export default function ServicesWidget({ isOnline, stats }) {
  const services = [
    {
      name: 'Serveur Go (Gin REST API)',
      port: ':8080',
      status: isOnline ? 'up' : 'down',
      icon: Server,
      desc: 'API de monitoring système & métriques gopsutil',
    },
    {
      name: 'Vite Dashboard (React 19)',
      port: ':5173',
      status: 'up',
      icon: Globe,
      desc: 'Interface utilisateur Web & Mobile Capacitor',
    },
    {
      name: 'Base de données / Stockage',
      port: 'Local FS',
      status: stats?.disk?.free ? 'up' : 'idle',
      icon: Database,
      desc: `Espace libre: ${(Number(stats?.disk?.free || 0) / (1024 * 1024 * 1024)).toFixed(1)} Go`,
    },
  ]

  return (
    <div className="card widget-card">
      <div className="widget-header">
        <div className="widget-title-box">
          <Server size={18} className="widget-icon primary" />
          <h3 className="widget-title">Services & Ports Actifs</h3>
        </div>
        <span className="widget-badge">{services.length} Surveillés</span>
      </div>

      <div className="services-list">
        {services.map((srv, idx) => {
          const Icon = srv.icon
          const isUp = srv.status === 'up'
          return (
            <div key={idx} className="service-row">
              <div className="service-icon-box">
                <Icon size={16} />
              </div>
              <div className="service-info">
                <div className="service-name-row">
                  <span className="service-name">{srv.name}</span>
                  <span className="service-port font-mono">{srv.port}</span>
                </div>
                <p className="service-desc">{srv.desc}</p>
              </div>
              <div className={`service-status-pill ${isUp ? 'online' : 'offline'}`}>
                <span className="dot" />
                <span>{isUp ? 'Actif' : 'Arrêté'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
