package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/disk"
	"github.com/shirou/gopsutil/v4/host"
	"github.com/shirou/gopsutil/v4/load"
	"github.com/shirou/gopsutil/v4/mem"
	netUtil "github.com/shirou/gopsutil/v4/net"
)

type ServerStats struct {
	Timestamp   int64         `json:"timestamp"`
	Host        HostInfo      `json:"host"`
	CPU         CPUInfo       `json:"cpu"`
	Memory      MemoryInfo    `json:"memory"`
	Disk        DiskInfo      `json:"disk"`
	Network     NetworkInfo   `json:"network"`
	LoadAvg     LoadInfo      `json:"load_avg"`
	Runtime     GoRuntimeInfo `json:"runtime"`
	// Backward compatibility fields
	Coeurs      int           `json:"coeurs"`
	CPULegacy   []float64     `json:"cpu_legacy"`
	RAMUsed     uint64        `json:"ram_used"`
	RAMFree     uint64        `json:"ram_free"`
	RAMTotal    uint64        `json:"ram_total"`
	Uptime      uint64        `json:"uptime"`
}

type HostInfo struct {
	Hostname        string `json:"hostname"`
	Uptime          uint64 `json:"uptime"`
	UptimeFormatted string `json:"uptime_formatted"`
	BootTime        uint64 `json:"boot_time"`
	OS              string `json:"os"`
	Platform        string `json:"platform"`
	PlatformVersion string `json:"platform_version"`
	KernelVersion   string `json:"kernel_version"`
	KernelArch      string `json:"kernel_arch"`
}

type CPUInfo struct {
	CoresLogical  int       `json:"cores_logical"`
	CoresPhysical int       `json:"cores_physical"`
	ModelName     string    `json:"model_name"`
	Mhz           float64   `json:"mhz"`
	TotalPercent  float64   `json:"total_percent"`
	PerCore       []float64 `json:"per_core"`
}

type MemoryInfo struct {
	Total       uint64  `json:"total"`
	Used        uint64  `json:"used"`
	Free        uint64  `json:"free"`
	Available   uint64  `json:"available"`
	UsedPercent float64 `json:"used_percent"`
	SwapTotal   uint64  `json:"swap_total"`
	SwapUsed    uint64  `json:"swap_used"`
	SwapFree    uint64  `json:"swap_free"`
	SwapPercent float64 `json:"swap_percent"`
}

type DiskInfo struct {
	Path        string  `json:"path"`
	FSType      string  `json:"fs_type"`
	Total       uint64  `json:"total"`
	Free        uint64  `json:"free"`
	Used        uint64  `json:"used"`
	UsedPercent float64 `json:"used_percent"`
}

type NetworkInfo struct {
	BytesSent        uint64  `json:"bytes_sent"`
	BytesRecv        uint64  `json:"bytes_recv"`
	PacketsSent      uint64  `json:"packets_sent"`
	PacketsRecv      uint64  `json:"packets_recv"`
	UploadSpeedBps   float64 `json:"upload_speed_bps"`
	DownloadSpeedBps float64 `json:"download_speed_bps"`
}

type LoadInfo struct {
	Load1  float64 `json:"load1"`
	Load5  float64 `json:"load5"`
	Load15 float64 `json:"load15"`
}

type GoRuntimeInfo struct {
	Version      string `json:"version"`
	NumGoroutine int    `json:"num_goroutine"`
	NumCPU       int    `json:"num_cpu"`
	ProcessUpSec int64  `json:"process_uptime_seconds"`
}

type StatsCollector struct {
	mu           sync.RWMutex
	currentStats ServerStats
	prevNetSent  uint64
	prevNetRecv  uint64
	prevNetTime  time.Time
	startTime    time.Time
}

var collector *StatsCollector

func formatUptime(seconds uint64) string {
	days := seconds / 86400
	hours := (seconds % 86400) / 3600
	minutes := (seconds % 3600) / 60
	secs := seconds % 60

	if days > 0 {
		return fmt.Sprintf("%dj %dh %dmin", days, hours, minutes)
	}
	if hours > 0 {
		return fmt.Sprintf("%dh %dmin %ds", hours, minutes, secs)
	}
	if minutes > 0 {
		return fmt.Sprintf("%dmin %ds", minutes, secs)
	}
	return fmt.Sprintf("%ds", secs)
}

func initCollector() *StatsCollector {
	c := &StatsCollector{
		startTime:   time.Now(),
		prevNetTime: time.Now(),
	}
	c.collect()

	// Background ticker to keep stats updated non-blockingly
	go func() {
		ticker := time.NewTicker(1 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			c.collect()
		}
	}()

	return c
}

func (c *StatsCollector) collect() {
	now := time.Now()

	// Host info
	hInfo, err := host.Info()
	var h HostInfo
	var uptimeSec uint64
	if err == nil && hInfo != nil {
		uptimeSec = hInfo.Uptime
		h = HostInfo{
			Hostname:        hInfo.Hostname,
			Uptime:          hInfo.Uptime,
			UptimeFormatted: formatUptime(hInfo.Uptime),
			BootTime:        hInfo.BootTime,
			OS:              hInfo.OS,
			Platform:        hInfo.Platform,
			PlatformVersion: hInfo.PlatformVersion,
			KernelVersion:   hInfo.KernelVersion,
			KernelArch:      hInfo.KernelArch,
		}
	} else {
		uptimeSec, _ = host.Uptime()
		h = HostInfo{
			OS:              runtime.GOOS,
			KernelArch:      runtime.GOARCH,
			Uptime:          uptimeSec,
			UptimeFormatted: formatUptime(uptimeSec),
		}
	}

	// CPU info
	coresLogical := runtime.NumCPU()
	coresPhysical, _ := cpu.Counts(false)
	cpuInfos, _ := cpu.Info()
	modelName := ""
	mhz := 0.0
	if len(cpuInfos) > 0 {
		modelName = cpuInfos[0].ModelName
		mhz = cpuInfos[0].Mhz
	}

	// Non-blocking CPU percent (instant calculation from last sample)
	perCore, _ := cpu.Percent(0, true)
	totalPercentArr, _ := cpu.Percent(0, false)
	totalPercent := 0.0
	if len(totalPercentArr) > 0 {
		totalPercent = totalPercentArr[0]
	}

	cpuData := CPUInfo{
		CoresLogical:  coresLogical,
		CoresPhysical: coresPhysical,
		ModelName:     modelName,
		Mhz:           mhz,
		TotalPercent:  totalPercent,
		PerCore:       perCore,
	}

	// Memory info
	vMem, _ := mem.VirtualMemory()
	sMem, _ := mem.SwapMemory()
	var memData MemoryInfo
	if vMem != nil {
		memData.Total = vMem.Total
		memData.Used = vMem.Used
		memData.Free = vMem.Free
		memData.Available = vMem.Available
		memData.UsedPercent = vMem.UsedPercent
	}
	if sMem != nil {
		memData.SwapTotal = sMem.Total
		memData.SwapUsed = sMem.Used
		memData.SwapFree = sMem.Free
		memData.SwapPercent = sMem.UsedPercent
	}

	// Disk info (root directory)
	dUsage, _ := disk.Usage("/")
	var diskData DiskInfo
	if dUsage != nil {
		diskData = DiskInfo{
			Path:        dUsage.Path,
			FSType:      dUsage.Fstype,
			Total:       dUsage.Total,
			Free:        dUsage.Free,
			Used:        dUsage.Used,
			UsedPercent: dUsage.UsedPercent,
		}
	}

	// Network info & speed rates
	netCounters, _ := netUtil.IOCounters(false)
	var netData NetworkInfo
	if len(netCounters) > 0 {
		sent := netCounters[0].BytesSent
		recv := netCounters[0].BytesRecv
		netData.BytesSent = sent
		netData.BytesRecv = recv
		netData.PacketsSent = netCounters[0].PacketsSent
		netData.PacketsRecv = netCounters[0].PacketsRecv

		timeDiff := now.Sub(c.prevNetTime).Seconds()
		if timeDiff > 0 && c.prevNetSent > 0 && c.prevNetRecv > 0 {
			if sent >= c.prevNetSent {
				netData.UploadSpeedBps = float64(sent-c.prevNetSent) / timeDiff
			}
			if recv >= c.prevNetRecv {
				netData.DownloadSpeedBps = float64(recv-c.prevNetRecv) / timeDiff
			}
		}
		c.prevNetSent = sent
		c.prevNetRecv = recv
		c.prevNetTime = now
	}

	// Load Average
	lAvg, _ := load.Avg()
	var loadData LoadInfo
	if lAvg != nil {
		loadData = LoadInfo{
			Load1:  lAvg.Load1,
			Load5:  lAvg.Load5,
			Load15: lAvg.Load15,
		}
	}

	// Go Runtime info
	rtData := GoRuntimeInfo{
		Version:      runtime.Version(),
		NumGoroutine: runtime.NumGoroutine(),
		NumCPU:       coresLogical,
		ProcessUpSec: int64(time.Since(c.startTime).Seconds()),
	}

	newStats := ServerStats{
		Timestamp:   now.UnixMilli(),
		Host:        h,
		CPU:         cpuData,
		Memory:      memData,
		Disk:        diskData,
		Network:     netData,
		LoadAvg:     loadData,
		Runtime:     rtData,
		Coeurs:      coresLogical,
		CPULegacy:   perCore,
		RAMUsed:     memData.Used,
		RAMFree:     memData.Free,
		RAMTotal:    memData.Total,
		Uptime:      uptimeSec,
	}

	c.mu.Lock()
	c.currentStats = newStats
	c.mu.Unlock()
}

func (c *StatsCollector) Get() ServerStats {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.currentStats
}

// CORSMiddleware adds CORS headers to all responses
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func main() {
	collector = initCollector()

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	r.Use(CORSMiddleware())

	// Health check endpoints
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
			"status":  "healthy",
			"time":    time.Now().Unix(),
		})
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "up",
			"time":   time.Now().Unix(),
		})
	})

	// Legacy stats endpoint
	r.GET("/stats", func(c *gin.Context) {
		stats := collector.Get()
		c.JSON(http.StatusOK, gin.H{
			"coeurs":    stats.Coeurs,
			"cpu":       stats.CPU.PerCore,
			"ram_used":  stats.RAMUsed,
			"ram_free":  stats.RAMFree,
			"ram_total": stats.RAMTotal,
			"uptime":    stats.Uptime,
			// Full detailed payload also available here
			"details":   stats,
		})
	})

	// Modern rich stats endpoint
	r.GET("/api/stats", func(c *gin.Context) {
		stats := collector.Get()
		c.JSON(http.StatusOK, stats)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := ":" + port
	log.Printf("🚀 Server running on http://0.0.0.0:%s", port)
	log.Printf("📊 Stats endpoint available at http://0.0.0.0:%s/api/stats and /stats", port)

	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
