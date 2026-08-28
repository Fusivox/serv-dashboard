export default function ProgressBar({
  percent = 0,
  colorScheme = 'auto', // 'auto', 'blue', 'green', 'amber', 'purple'
  height = 8,
  showLabel = false,
  animated = true,
}) {
  const clamped = Math.max(0, Math.min(100, isNaN(percent) ? 0 : percent))

  let gradient = 'linear-gradient(90deg, #10b981 0%, #059669 100%)' // green
  if (colorScheme === 'blue') {
    gradient = 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
  } else if (colorScheme === 'purple') {
    gradient = 'linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%)'
  } else if (colorScheme === 'amber') {
    gradient = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
  } else if (colorScheme === 'auto') {
    if (clamped >= 90) {
      gradient = 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)' // red
    } else if (clamped >= 75) {
      gradient = 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)' // amber
    } else if (clamped >= 50) {
      gradient = 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)' // blue
    } else {
      gradient = 'linear-gradient(90deg, #34d399 0%, #10b981 100%)' // emerald green
    }
  }

  return (
    <div className="progress-container">
      <div
        className="progress-track"
        style={{ height: `${height}px` }}
      >
        <div
          className={`progress-fill ${animated ? 'animated' : ''}`}
          style={{
            width: `${clamped}%`,
            background: gradient,
          }}
        />
      </div>
      {showLabel && (
        <span className="progress-label">{clamped.toFixed(1)}%</span>
      )}
    </div>
  )
}
