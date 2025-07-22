"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Activity, AlertTriangle, CheckCircle, Clock, Eye, Play, Wifi, WifiOff } from "lucide-react"

export function ObservabilityPanel() {
  const [sessionReplayEnabled, setSessionReplayEnabled] = useState(true)
  const [observabilityEnabled, setObservabilityEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [systemHealth, setSystemHealth] = useState({
    cpu: 45,
    memory: 62,
    network: 23,
    errors: 2,
  })

  const [recentEvents, setRecentEvents] = useState([
    {
      id: 1,
      type: "evaluation",
      flag: "new-checkout-flow",
      user: "user_123",
      timestamp: "10:25:34",
      status: "success",
    },
    { id: 2, type: "conversion", flag: "premium-features", user: "user_456", timestamp: "10:25:31", status: "success" },
    { id: 3, type: "error", flag: "theme-variant", user: "user_789", timestamp: "10:25:28", status: "error" },
    {
      id: 4,
      type: "evaluation",
      flag: "new-checkout-flow",
      user: "user_321",
      timestamp: "10:25:25",
      status: "success",
    },
    { id: 5, type: "conversion", flag: "mobile-layout", user: "user_654", timestamp: "10:25:22", status: "success" },
  ])

  const [sessionReplays] = useState([
    {
      id: 1,
      user: "user_123",
      duration: "2:34",
      flags: ["new-checkout-flow", "theme-variant"],
      errors: 0,
      timestamp: "10:20:15",
    },
    { id: 2, user: "user_456", duration: "1:47", flags: ["premium-features"], errors: 1, timestamp: "10:18:42" },
    {
      id: 3,
      user: "user_789",
      duration: "3:12",
      flags: ["new-checkout-flow", "mobile-layout"],
      errors: 0,
      timestamp: "10:15:33",
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth((prev) => ({
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        errors: Math.max(0, prev.errors + (Math.random() > 0.8 ? 1 : 0)),
      }))

      // Add new events occasionally
      if (Math.random() > 0.7) {
        const eventTypes = ["evaluation", "conversion", "error"]
        const flags = ["new-checkout-flow", "premium-features", "theme-variant", "mobile-layout"]
        const newEvent = {
          id: Date.now(),
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          flag: flags[Math.floor(Math.random() * flags.length)],
          user: `user_${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toLocaleTimeString(),
          status: Math.random() > 0.1 ? "success" : "error",
        }
        setRecentEvents((prev) => [newEvent, ...prev.slice(0, 9)])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getEventIcon = (type: string, status: string) => {
    if (status === "error") return <AlertTriangle className="w-4 h-4 text-red-500" />
    switch (type) {
      case "evaluation":
        return <Activity className="w-4 h-4 text-blue-500" />
      case "conversion":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getHealthColor = (value: number) => {
    if (value < 30) return "text-green-600"
    if (value < 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthBgColor = (value: number) => {
    if (value < 30) return "bg-green-100 dark:bg-green-900/20"
    if (value < 70) return "bg-yellow-100 dark:bg-yellow-900/20"
    return "bg-red-100 dark:bg-red-900/20"
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Observability & Session Replay</h2>
        <p className="text-gray-600 dark:text-gray-400">Monitor system health and user sessions in real-time</p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Observability Controls</CardTitle>
          <CardDescription>Enable or disable monitoring features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="observability">System Observability</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor performance metrics, errors, and system health
              </p>
            </div>
            <Switch id="observability" checked={observabilityEnabled} onCheckedChange={setObservabilityEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="session-replay">Session Replay</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Record user sessions for debugging and analysis
              </p>
            </div>
            <Switch id="session-replay" checked={sessionReplayEnabled} onCheckedChange={setSessionReplayEnabled} />
          </div>

          {sessionReplayEnabled && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? (
                  <>
                    <WifiOff className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-2" />
                  Recording
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className={`text-sm font-bold ${getHealthColor(systemHealth.cpu)}`}>
                  {Math.round(systemHealth.cpu)}%
                </span>
              </div>
              <Progress value={systemHealth.cpu} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className={`text-sm font-bold ${getHealthColor(systemHealth.memory)}`}>
                  {Math.round(systemHealth.memory)}%
                </span>
              </div>
              <Progress value={systemHealth.memory} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network Latency</span>
                <span className={`text-sm font-bold ${getHealthColor(systemHealth.network)}`}>
                  {Math.round(systemHealth.network)}ms
                </span>
              </div>
              <Progress value={systemHealth.network} className="h-2" />
            </div>

            <div className={`p-3 rounded-lg ${getHealthBgColor(systemHealth.errors * 20)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Error Count</span>
                </div>
                <span className="text-sm font-bold text-red-600">{systemHealth.errors}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Live stream of flag evaluations and conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  {getEventIcon(event.type, event.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">{event.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {event.flag}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {event.user} • {event.timestamp}
                    </p>
                  </div>
                  <Badge variant={event.status === "success" ? "default" : "destructive"} className="text-xs">
                    {event.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Replays */}
      {sessionReplayEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Session Replays</CardTitle>
            <CardDescription>Recorded user sessions with flag interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionReplays.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{session.user}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-sm text-gray-600">{session.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {session.flags.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Errors</p>
                      <p className={`font-medium ${session.errors > 0 ? "text-red-600" : "text-green-600"}`}>
                        {session.errors}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Recorded</p>
                      <p className="text-sm font-medium">{session.timestamp}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Play className="w-3 h-3 mr-1" />
                      Replay
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
