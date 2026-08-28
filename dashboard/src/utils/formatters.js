/**
 * Format bytes into human readable format (Mo, Go, To)
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0 || isNaN(bytes) || bytes === null || bytes === undefined) {
    return { value: '0', unit: 'o', text: '0 o' }
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['o', 'Ko', 'Mo', 'Go', 'To', 'Po']

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const safeIndex = Math.min(i, sizes.length - 1)
  const val = parseFloat((bytes / Math.pow(k, safeIndex)).toFixed(dm))
  const unit = sizes[safeIndex]

  return {
    value: val.toString(),
    unit,
    text: `${val} ${unit}`,
  }
}

/**
 * Format network transfer speed (bytes per second)
 */
export function formatSpeed(bytesPerSec) {
  if (!bytesPerSec || bytesPerSec <= 0 || isNaN(bytesPerSec)) {
    return '0 Ko/s'
  }

  const k = 1024
  if (bytesPerSec < k) {
    return `${Math.round(bytesPerSec)} o/s`
  }
  if (bytesPerSec < k * k) {
    return `${(bytesPerSec / k).toFixed(1)} Ko/s`
  }
  if (bytesPerSec < k * k * k) {
    return `${(bytesPerSec / (k * k)).toFixed(2)} Mo/s`
  }
  return `${(bytesPerSec / (k * k * k)).toFixed(2)} Go/s`
}

/**
 * Format uptime in seconds to localized string
 */
export function formatUptimeSeconds(seconds) {
  if (!seconds || seconds <= 0) return '0s'

  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  if (d > 0) return `${d}j ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}min ${s}s`
  return `${s}s`
}

/**
 * Format percentage with threshold color helper
 */
export function formatPercent(val, decimals = 1) {
  if (val === null || val === undefined || isNaN(val)) return '0%'
  return `${Number(val).toFixed(decimals)}%`
}

/**
 * Return color status class based on percentage (0-100)
 */
export function getStatusColor(percent) {
  if (percent >= 90) return { name: 'danger', bg: '#ef4444', text: '#fca5a5' }
  if (percent >= 75) return { name: 'warning', bg: '#f59e0b', text: '#fde68a' }
  if (percent >= 50) return { name: 'accent', bg: '#3b82f6', text: '#93c5fd' }
  return { name: 'success', bg: '#10b981', text: '#a7f3d0' }
}
