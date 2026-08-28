import { useState } from 'react'
import { X, Server, Check, RotateCcw, Globe } from 'lucide-react'

export default function SettingsModal({
  isOpen,
  onClose,
  serverUrl,
  onSaveServerUrl,
}) {
  const [urlInput, setUrlInput] = useState(serverUrl || '')

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    onSaveServerUrl(urlInput.trim())
    onClose()
  }

  const handleSetPreset = (preset) => {
    setUrlInput(preset)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <Server size={20} className="text-primary" />
            <h3 className="modal-title">Configuration du Serveur</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <label className="form-label" htmlFor="server-url-input">
            URL du serveur Go Backend (avec protocole et port)
          </label>
          <div className="input-group">
            <Globe size={18} className="input-icon" />
            <input
              id="server-url-input"
              type="text"
              className="form-input"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="http://localhost:8080 ou http://192.168.1.10:8080"
              autoFocus
            />
          </div>

          <div className="presets-section">
            <span className="presets-label">Raccourcis rapides :</span>
            <div className="presets-row">
              <button
                type="button"
                className="preset-btn"
                onClick={() => handleSetPreset('http://localhost:8080')}
              >
                Localhost (:8080)
              </button>
              <button
                type="button"
                className="preset-btn"
                onClick={() => handleSetPreset('')}
              >
                Relatif (Proxy Vite)
              </button>
            </div>
          </div>

          <p className="modal-hint">
            💡 Sur smartphone ou Capacitor, entrez l'adresse IP locale de votre machine (ex: <code>http://192.168.1.45:8080</code>).
          </p>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setUrlInput('')
                onSaveServerUrl('')
                onClose()
              }}
            >
              <RotateCcw size={14} />
              <span>Réinitialiser</span>
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={14} />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
