import { Sparkles, Box, Terminal, Database, Bell } from 'lucide-react'

export default function FutureWidgetCard() {
  const futureIdeas = [
    {
      title: 'Conteneurs Docker',
      desc: 'Affichage des conteneurs actifs, mémoire et redémarrage.',
      icon: Box,
      color: '#0284c7',
    },
    {
      title: 'Visionneuse de Logs',
      desc: 'Streaming en direct des logs systemd / journalctl / nginx.',
      icon: Terminal,
      color: '#10b981',
    },
    {
      title: 'Base de données',
      desc: 'Métriques MySQL, PostgreSQL ou Redis (connexions, requêtes/sec).',
      icon: Database,
      color: '#8b5cf6',
    },
    {
      title: 'Alertes & Webhooks',
      desc: 'Notifications Discord/Telegram en cas de surcharge CPU/RAM.',
      icon: Bell,
      color: '#f59e0b',
    },
  ]

  return (
    <div className="card future-workspace-card">
      <div className="future-workspace-header">
        <div className="future-title-group">
          <div className="sparkle-icon-wrapper">
            <Sparkles size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="future-title">Espace réservé pour vos futurs modules</h3>
            <p className="future-subtitle">
              Cette colonne de droite est conçue pour accueillir vos prochains widgets, métriques et interfaces métiers.
            </p>
          </div>
        </div>
      </div>

      <div className="future-ideas-grid">
        {futureIdeas.map((idea, idx) => {
          const Icon = idea.icon
          return (
            <div key={idx} className="idea-card">
              <div className="idea-icon-box" style={{ color: idea.color, backgroundColor: `${idea.color}15` }}>
                <Icon size={18} />
              </div>
              <div className="idea-content">
                <h4 className="idea-title">{idea.title}</h4>
                <p className="idea-desc">{idea.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="code-hint-box">
        <span className="code-hint-title">💡 Comment ajouter un nouveau widget ?</span>
        <code className="code-hint-snippet">
          Créez votre composant dans <code>src/components/RightSpace/</code> et importez-le dans <code>RightSpacePanel.jsx</code>
        </code>
      </div>
    </div>
  )
}
