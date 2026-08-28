import { FileText, Check } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function NotesWidget() {
  const [notes, setNotes] = useLocalStorage(
    'servdashboard_admin_notes',
    '• Serveur Go lancé sur le port :8080\n• Endpoint de test : /ping\n• Endpoint stats : /api/stats\n• Mémo : Pensez à configurer le pare-feu et les sauvegardes.'
  )

  return (
    <div className="card widget-card notes-widget">
      <div className="widget-header">
        <div className="widget-title-box">
          <FileText size={18} className="widget-icon warning" />
          <h3 className="widget-title">Bloc-notes & Mémo Serveur</h3>
        </div>
        <span className="widget-badge auto-save">
          <Check size={12} /> Auto-enregistré
        </span>
      </div>

      <div className="notes-body">
        <textarea
          className="notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Écrivez vos notes d'administration, commandes à retenir, TODOs..."
          rows={4}
        />
      </div>
    </div>
  )
}
