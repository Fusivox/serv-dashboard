import { useState, useEffect, useRef, useCallback } from 'react'

const MAX_HISTORY_POINTS = 30

export function useServerStats(baseUrl = '', intervalMs = 2000) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [latency, setLatency] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isOnline, setIsOnline] = useState(false)
  const [history, setHistory] = useState({
    cpu: [],
    ram: [],
    netDown: [],
    netUp: [],
  })

  const failureCountRef = useRef(0)

  const normalizeUrl = useCallback((url, path) => {
    const trimmed = (url || '').trim().replace(/\/+$/, '')
    if (!trimmed) return path
    return `${trimmed}${path}`
  }, [])

  const fetchStats = useCallback(async () => {
    const startTime = performance.now()
    const endpoint = normalizeUrl(baseUrl, '/api/stats')
    const fallbackEndpoint = normalizeUrl(baseUrl, '/stats')

    try {
      let response

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)
        response = await fetch(endpoint, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        clearTimeout(timeoutId)
      } catch {
        // Try legacy fallback endpoint
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)
        response = await fetch(fallbackEndpoint, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        })
        clearTimeout(timeoutId)
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const raw = await response.json()
      const pingMs = Math.round(performance.now() - startTime)

      // Normalize data whether it's the rich endpoint or legacy endpoint
      const normalized = normalizeStatsData(raw)

      setStats(normalized)
      setLatency(pingMs)
      setLastUpdated(new Date())
      setIsOnline(true)
      setError(null)
      setLoading(false)
      failureCountRef.current = 0

      // Update historical data
      const nowTs = Date.now()
      setHistory((prev) => {
        const nextCpu = [
          ...prev.cpu,
          { time: nowTs, value: normalized.cpu?.total_percent || 0 },
        ].slice(-MAX_HISTORY_POINTS)

        const nextRam = [
          ...prev.ram,
          { time: nowTs, value: normalized.memory?.used_percent || 0 },
        ].slice(-MAX_HISTORY_POINTS)

        const nextNetDown = [
          ...prev.netDown,
          { time: nowTs, value: normalized.network?.download_speed_bps || 0 },
        ].slice(-MAX_HISTORY_POINTS)

        const nextNetUp = [
          ...prev.netUp,
          { time: nowTs, value: normalized.network?.upload_speed_bps || 0 },
        ].slice(-MAX_HISTORY_POINTS)

        return {
          cpu: nextCpu,
          ram: nextRam,
          netDown: nextNetDown,
          netUp: nextNetUp,
        }
      })
    } catch (err) {
      failureCountRef.current += 1
      if (failureCountRef.current >= 2) {
        setIsOnline(false)
      }
      setError(err.message || 'Serveur inaccessible')
      setLoading(false)
      setLatency(null)
    }
  }, [baseUrl, normalizeUrl])

  useEffect(() => {
    let isMounted = true

    const runFetch = async () => {
      if (isMounted) {
        await fetchStats()
      }
    }

    runFetch()

    if (!intervalMs || intervalMs <= 0) return () => { isMounted = false }

    const timer = setInterval(() => {
      if (isMounted) {
        fetchStats()
      }
    }, intervalMs)

    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [fetchStats, intervalMs])

  return {
    stats,
    history,
    loading,
    error,
    latency,
    lastUpdated,
    isOnline,
    refresh: fetchStats,
  }
}

/**
 * Ensures a consistent format regardless of whether the backend
 * returned the new rich structure or old legacy structure.
 */
function normalizeStatsData(raw) {
  if (raw.details) {
    return raw.details
  }

  // If already standard modern format
  if (raw.cpu && typeof raw.cpu === 'object' && raw.memory) {
    return raw
  }

  // Handle legacy payload shape
  const ramTotal = raw.ram_total || 0
  const ramUsed = raw.ram_used || 0
  const ramFree = raw.ram_free || 0
  const ramUsedPct = ramTotal > 0 ? (ramUsed / ramTotal) * 100 : 0

  const perCore = Array.isArray(raw.cpu) ? raw.cpu : []
  const totalCpu =
    perCore.length > 0
      ? perCore.reduce((acc, v) => acc + v, 0) / perCore.length
      : 0

  return {
    timestamp: Date.now(),
    host: {
      hostname: 'Serveur Host',
      uptime: raw.uptime || 0,
      uptime_formatted: '',
      os: 'linux',
      platform: 'linux',
      kernel_arch: 'x86_64',
    },
    cpu: {
      cores_logical: raw.coeurs || perCore.length || 1,
      cores_physical: raw.coeurs || perCore.length || 1,
      model_name: 'CPU Processeur',
      total_percent: totalCpu,
      per_core: perCore,
    },
    memory: {
      total: ramTotal,
      used: ramUsed,
      free: ramFree,
      available: ramFree,
      used_percent: ramUsedPct,
      swap_total: 0,
      swap_used: 0,
      swap_free: 0,
      swap_percent: 0,
    },
    disk: {
      path: '/',
      fs_type: 'ext4',
      total: 0,
      free: 0,
      used: 0,
      used_percent: 0,
    },
    network: {
      bytes_sent: 0,
      bytes_recv: 0,
      upload_speed_bps: 0,
      download_speed_bps: 0,
    },
    load_avg: {
      load1: 0,
      load5: 0,
      load15: 0,
    },
    runtime: {
      version: 'go',
      num_goroutine: 1,
      num_cpu: raw.coeurs || 1,
      process_uptime_seconds: raw.uptime || 0,
    },
  }
}
