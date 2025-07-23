"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, Target, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MetricsDashboardProps {
  conversionRate: number
  onConversionRateChange: (rate: number) => void
}

interface Metrics {
  totalUsers: number
  flagEvaluations: number
  conversionEvents: number
  averageLatency: number
  errorRate: number
  activeExperiments: number
}

interface RealtimeData {
  time: string
  evaluations: number
  conversions: number
}

interface FlagPerformance {
  name: string
  enabled: boolean
  conversions: number
  rate: number
  trend: "up" | "down" | "stable"
}

const INITIAL_METRICS: Metrics = {
  totalUsers: 2847,
  flagEvaluations: 15234,
  conversionEvents: 354,
  averageLatency: 23,
  errorRate: 0.02,
  activeExperiments: 5,
}

const INITIAL_REALTIME_DATA: RealtimeData[] = [
  { time: "10:00", evaluations: 120, conversions: 15 },
  { time: "10:05", evaluations: 135, conversions: 18 },
  { time: "10:10", evaluations: 142, conversions: 16 },
  { time: "10:15", evaluations: 158, conversions: 22 },
  { time: "10:20", evaluations: 167, conversions: 19 },
  { time: "10:25", evaluations: 174, conversions: 25 },
]

const FLAG_PERFORMANCE: FlagPerformance[] = [
  { name: "New Checkout Flow", enabled: true, conversions: 156, rate: 14.2, trend: "up" },
  { name: "Premium Features", enabled: false, conversions: 89, rate: 8.7, trend: "down" },
  { name: "Theme Variant", enabled: true, conversions: 109, rate: 11.3, trend: "up" },
  { name: "Mobile Layout", enabled: true, conversions: 67, rate: 9.1, trend: "stable" },
]

const MetricCard = memo(({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  trendValue, 
  iconColor 
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string | number
  trend?: "up" | "down"
  trendValue?: string
  iconColor: string
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {trend && trendValue && (
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-green-500" />
          )}
          <span className={`text-xs ${trend === "up" ? "text-green-600" : "text-green-600"}`}>
            {trendValue}
          </span>
        </div>
      )}
    </CardContent>
  </Card>
))

MetricCard.displayName = "MetricCard"

const FlagPerformanceRow = memo(({ flag }: { flag: FlagPerformance }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${flag.enabled ? "bg-green-500" : "bg-gray-400"}`} />
        <span className="font-medium">{flag.name}</span>
      </div>
      <Badge variant={flag.enabled ? "default" : "secondary"}>
        {flag.enabled ? "Enabled" : "Disabled"}
      </Badge>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className="text-sm text-gray-600 dark:text-gray-400">Conversions</p>
        <p className="font-medium">{flag.conversions}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600 dark:text-gray-400">Rate</p>
        <div className="flex items-center gap-1">
          <p className="font-medium">{flag.rate}%</p>
          {flag.trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
          {flag.trend === "down" && <TrendingDown className="w-3 h-3 text-red-500" />}
        </div>
      </div>
      <div className="w-24">
        <Progress value={flag.rate} className="h-2" />
      </div>
    </div>
  </div>
))

FlagPerformanceRow.displayName = "FlagPerformanceRow"

const RealtimeActivityItem = memo(({ data }: { data: RealtimeData }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span className="text-sm font-mono">{data.time}</span>
    </div>
    <div className="flex items-center gap-6 text-sm">
      <span className="text-gray-600 dark:text-gray-400">{data.evaluations} evaluations</span>
      <span className="text-green-600 font-medium">{data.conversions} conversions</span>
    </div>
  </div>
))

RealtimeActivityItem.displayName = "RealtimeActivityItem"

export function MetricsDashboard({ conversionRate, onConversionRateChange }: MetricsDashboardProps) {
  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS)
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>(INITIAL_REALTIME_DATA)
  const [error, setError] = useState<string | null>(null)

  const updateMetrics = useCallback(() => {
    try {
      setMetrics((prev) => ({
        ...prev,
        flagEvaluations: prev.flagEvaluations + Math.floor(Math.random() * 10) + 5,
        conversionEvents: prev.conversionEvents + Math.floor(Math.random() * 3),
        averageLatency: Math.max(15, prev.averageLatency + (Math.random() - 0.5) * 5),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
      }))

      // Update conversion rate
      const newRate = conversionRate + (Math.random() - 0.5) * 2
      onConversionRateChange(Math.max(0, Math.min(100, newRate)))
    } catch (err) {
      setError("Failed to update metrics")
      console.error("Metrics update error:", err)
    }
  }, [conversionRate, onConversionRateChange])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(updateMetrics, 3000)
    return () => clearInterval(interval)
  }, [updateMetrics])

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Metrics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time analytics and performance insights</p>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading metrics: {error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setError(null)
                setMetrics(INITIAL_METRICS)
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Metrics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Real-time analytics and performance insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          icon={Users}
          title="Total Users"
          value={metrics.totalUsers.toLocaleString()}
          trend="up"
          trendValue="+12%"
          iconColor="text-blue-600"
        />

        <MetricCard
          icon={Zap}
          title="Evaluations"
          value={metrics.flagEvaluations.toLocaleString()}
          trend="up"
          trendValue="+8%"
          iconColor="text-purple-600"
        />

        <MetricCard
          icon={Target}
          title="Conversions"
          value={metrics.conversionEvents}
          trend="up"
          trendValue="+15%"
          iconColor="text-green-600"
        />

        <MetricCard
          icon={Clock}
          title="Avg Latency"
          value={`${Math.round(metrics.averageLatency)}ms`}
          trend="down"
          trendValue="-3ms"
          iconColor="text-orange-600"
        />

        <MetricCard
          icon={() => <span className="w-4 h-4 text-red-600">⚠</span>}
          title="Error Rate"
          value={`${(metrics.errorRate * 100).toFixed(2)}%`}
          trend="down"
          trendValue="-0.01%"
          iconColor="text-red-600"
        />

        <MetricCard
          icon={() => <span className="w-4 h-4 text-indigo-600">🧪</span>}
          title="Experiments"
          value={metrics.activeExperiments}
          iconColor="text-indigo-600"
        />
      </div>

      {/* Flag Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Flag Performance</CardTitle>
          <CardDescription>Conversion rates and performance by feature flag</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {FLAG_PERFORMANCE.map((flag, index) => (
              <FlagPerformanceRow key={index} flag={flag} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Activity</CardTitle>
          <CardDescription>Live evaluation and conversion events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realtimeData.slice(-5).map((data, index) => (
              <RealtimeActivityItem key={index} data={data} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
