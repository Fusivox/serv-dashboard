import { useState } from 'react'
import Header from './components/Header'
import ServerStatsPanel from './components/ServerStats/ServerStatsPanel'
import RightSpacePanel from './components/RightSpace/RightSpacePanel'
import SettingsModal from './components/SettingsModal'
import { useServerStats } from './hooks/useServerStats'
import { useLocalStorage } from './hooks/useLocalStorage'
import './App.css'

function App() {
  const [serverUrl, setServerUrl] = useLocalStorage('servdashboard_server_url', '')
  const [intervalMs, setIntervalMs] = useLocalStorage('servdashboard_interval_ms', 2000)
  const [activeMobileTab, setActiveMobileTab] = useState('stats')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const {
    stats,
    history,
    loading,
    error,
    latency,
    isOnline,
    refresh,
  } = useServerStats(serverUrl, intervalMs)

  return (
    <div className="dashboard-app">
      {/* Top Navigation & Status Bar */}
      <Header
        isOnline={isOnline}
        latency={latency}
        loading={loading}
        error={error}
        intervalMs={intervalMs}
        onChangeInterval={setIntervalMs}
        onRefresh={refresh}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeMobileTab={activeMobileTab}
        onSelectMobileTab={setActiveMobileTab}
      />

      {/* Main Responsive Dashboard Container */}
      <main className="dashboard-main">
        <div className="dashboard-layout">
          {/* Left Column: Server Stats Panel */}
          <section
            className={`dashboard-column left-column ${
              activeMobileTab === 'stats' ? 'mobile-active' : 'mobile-hidden'
            }`}
            aria-label="Statistiques du serveur"
          >
            <div className="column-header">
              <span className="column-badge">Panel Gauche</span>
              <h2 className="column-title">Statistiques Serveur</h2>
            </div>

            <ServerStatsPanel
              stats={stats}
              history={history}
              loading={loading}
              error={error}
              isOnline={isOnline}
              onRefresh={refresh}
              onOpenSettings={() => setIsSettingsOpen(true)}
              serverUrl={serverUrl}
            />
          </section>

          {/* Right Column: Space for future widgets & tools */}
          <section
            className={`dashboard-column right-column ${
              activeMobileTab === 'modules' ? 'mobile-active' : 'mobile-hidden'
            }`}
            aria-label="Espace pour modules futurs"
          >
            <div className="column-header">
              <span className="column-badge badge-accent">Panel Droit</span>
              <h2 className="column-title">Espace Modules & Outils</h2>
            </div>

            <RightSpacePanel
              isOnline={isOnline}
              stats={stats}
              serverUrl={serverUrl}
              onRefresh={refresh}
            />
          </section>
        </div>
      </main>

      {/* Server Endpoint Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        serverUrl={serverUrl}
        onSaveServerUrl={setServerUrl}
      />
    </div>
  )
}

export default App
