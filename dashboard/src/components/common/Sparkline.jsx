export default function Sparkline({
  data = [],
  color = '#3b82f6',
  height = 40,
  max = 100,
}) {
  if (!data || data.length < 2) {
    return (
      <div
        className="sparkline-placeholder"
        style={{ height: `${height}px` }}
      >
        <span className="sparkline-loading">Enregistrement des données...</span>
      </div>
    )
  }

  const width = 200
  const points = data.map((d) => (typeof d === 'object' ? d.value : d))
  const maxValue = max || Math.max(...points, 1)

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * width
    const clampedVal = Math.max(0, Math.min(val, maxValue))
    const y = height - (clampedVal / maxValue) * (height - 6) - 3
    return { x, y, val }
  })

  const pathD = coords.reduce(
    (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`,
    ''
  )

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`
  const lastPoint = coords[coords.length - 1]

  return (
    <div className="sparkline-wrapper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="sparkline-svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient fill underneath the line */}
        <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />

        {/* Trend stroke line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current live point glow */}
        {lastPoint && (
          <>
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="3.5"
              fill={color}
              className="sparkline-dot"
            />
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r="6"
              fill={color}
              opacity="0.3"
              className="sparkline-dot-pulse"
            />
          </>
        )}
      </svg>
    </div>
  )
}
