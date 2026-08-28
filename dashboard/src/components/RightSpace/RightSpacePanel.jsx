import QuickActionsWidget from './QuickActionsWidget'
import ServicesWidget from './ServicesWidget'
import NotesWidget from './NotesWidget'
import FutureWidgetCard from './FutureWidgetCard'

export default function RightSpacePanel({
  isOnline,
  stats,
  serverUrl,
  onRefresh,
}) {
  return (
    <div className="right-panel">
      {/* Quick Actions & Utility Tools */}
      <QuickActionsWidget
        onRefresh={onRefresh}
        serverUrl={serverUrl}
      />

      {/* Monitored Services & Ports */}
      <ServicesWidget isOnline={isOnline} stats={stats} />

      {/* Persistent Notes & Scratchpad */}
      <NotesWidget />

      {/* Future Extensibility Workspace */}
      <FutureWidgetCard />
    </div>
  )
}
