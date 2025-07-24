"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Activity, Video, Settings, AlertTriangle } from "lucide-react"
import { observability, sessionReplay } from "@/utils/launchdarkly-observability"

export function ObservabilityDemo() {
  const [observabilityEnabled, setObservabilityEnabled] = useState(false)
  const [sessionReplayEnabled, setSessionReplayEnabled] = useState(false)
  const [userConsent, setUserConsent] = useState(false)

  const handleObservabilityToggle = (enabled: boolean) => {
    setObservabilityEnabled(enabled)
    if (enabled) {
      observability.start()
    } else {
      observability.stop()
    }
  }

  const handleSessionReplayToggle = (enabled: boolean) => {
    setSessionReplayEnabled(enabled)
    if (enabled) {
      sessionReplay.start({ forceNew: true })
    } else {
      sessionReplay.stop()
    }
  }

  const handleUserConsent = (consent: boolean) => {
    setUserConsent(consent)
    if (consent) {
      observability.start()
      sessionReplay.start()
      setObservabilityEnabled(true)
      setSessionReplayEnabled(true)
    } else {
      observability.stop()
      sessionReplay.stop()
      setObservabilityEnabled(false)
      setSessionReplayEnabled(false)
    }
  }

  const simulateError = () => {
    throw new Error("Simulated error for observability testing")
  }

  const simulatePerformanceIssue = () => {
    // Simulate a performance issue
    const start = performance.now()
    for (let i = 0; i < 1000000; i++) {
      Math.random()
    }
    const end = performance.now()
    console.log(`Performance test took ${end - start}ms`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Observability & Session Replay</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Test LaunchDarkly's observability and session replay features
        </p>
      </div>

      {/* User Consent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            User Consent
          </CardTitle>
          <CardDescription>
            Enable or disable observability based on user consent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="user-consent"
              checked={userConsent}
              onCheckedChange={handleUserConsent}
            />
            <Label htmlFor="user-consent">I consent to observability data collection</Label>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>• Enabling consent will start both observability and session replay</p>
            <p>• Disabling consent will stop all data collection</p>
            <p>• This simulates GDPR/privacy compliance scenarios</p>
          </div>
        </CardContent>
      </Card>

      {/* Observability Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Observability Controls
          </CardTitle>
          <CardDescription>
            Manually control observability data collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="observability"
                checked={observabilityEnabled}
                onCheckedChange={handleObservabilityToggle}
                disabled={!userConsent}
              />
              <Label htmlFor="observability">Enable Observability</Label>
            </div>
            <Badge variant="outline" className={observabilityEnabled ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300"}>
              {observabilityEnabled ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={simulateError}
              disabled={!observabilityEnabled}
              className="h-16 flex flex-col gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Simulate Error</span>
            </Button>
            <Button
              variant="outline"
              onClick={simulatePerformanceIssue}
              disabled={!observabilityEnabled}
              className="h-16 flex flex-col gap-2"
            >
              <Activity className="w-5 h-5" />
              <span className="text-sm">Performance Test</span>
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>• Observability tracks errors, performance metrics, and network requests</p>
            <p>• Data is sent to LaunchDarkly for analysis</p>
            <p>• Requires user consent to be enabled</p>
          </div>
        </CardContent>
      </Card>

      {/* Session Replay Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Session Replay Controls
          </CardTitle>
          <CardDescription>
            Control session recording and replay functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="session-replay"
                checked={sessionReplayEnabled}
                onCheckedChange={handleSessionReplayToggle}
                disabled={!userConsent}
              />
              <Label htmlFor="session-replay">Enable Session Replay</Label>
            </div>
            <Badge variant="outline" className={sessionReplayEnabled ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-gray-100 text-gray-700 border-gray-300"}>
              {sessionReplayEnabled ? "Recording" : "Stopped"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => sessionReplay.start({ forceNew: true })}
              disabled={!userConsent || sessionReplayEnabled}
              className="h-16 flex flex-col gap-2"
            >
              <Video className="w-5 h-5" />
              <span className="text-sm">Start New Session</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => sessionReplay.stop()}
              disabled={!userConsent || !sessionReplayEnabled}
              className="h-16 flex flex-col gap-2"
            >
              <EyeOff className="w-5 h-5" />
              <span className="text-sm">Stop Recording</span>
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>• Session replay records user interactions for debugging</p>
            <p>• Privacy settings control what data is captured</p>
            <p>• Requires user consent to be enabled</p>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Observability Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Activity className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Error Monitoring</p>
                <p className="text-gray-600 dark:text-gray-400">Automatically captures and reports JavaScript errors</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Activity className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Performance Metrics</p>
                <p className="text-gray-600 dark:text-gray-400">Tracks Core Web Vitals and custom performance data</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Video className="w-4 h-4 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium">Session Replay</p>
                <p className="text-gray-600 dark:text-gray-400">Records user sessions for debugging and analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Settings className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium">Privacy Controls</p>
                <p className="text-gray-600 dark:text-gray-400">Configurable privacy settings for data collection</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 