"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Activity, Video, Settings, AlertTriangle, Loader2, BarChart3, CheckCircle, XCircle } from "lucide-react"
import { useObservabilityState } from "@/hooks/useObservabilityState"
import { performanceMonitor, type PerformanceMetrics } from "@/utils/performance-monitor"
import { useToast } from "@/hooks/useToast"

export function ObservabilityDemo() {
  const {
    state,
    setUserConsent,
    toggleObservability,
    toggleSessionReplay,
    startNewSession,
    stopSessionReplay
  } = useObservabilityState()

  const { toast } = useToast()
  const [performanceMetrics, setPerformanceMetrics] = React.useState<PerformanceMetrics | null>(null)
  const [showPerformanceReport, setShowPerformanceReport] = React.useState(false)

  // Start performance monitoring when component mounts
  React.useEffect(() => {
    const initializePerformanceMonitor = async () => {
      try {
        performanceMonitor.start((metrics) => {
          setPerformanceMetrics(metrics)
        })
        
        // Show toast when performance monitoring starts
        toast({
          title: "Performance Monitoring Active",
          description: "Core Web Vitals and performance metrics are being tracked.",
          variant: "default",
        })
      } catch (error) {
        toast({
          title: "Performance Monitoring Failed",
          description: "Could not initialize performance monitoring.",
          variant: "destructive",
        })
      }
    }

    initializePerformanceMonitor()

    return () => {
      performanceMonitor.stop()
    }
  }, [toast])

  const simulateError = () => {
    try {
      throw new Error("Simulated error for observability testing")
    } catch (error) {
      toast({
        title: "Error Simulated",
        description: "A test error has been thrown and should be captured by observability.",
        variant: "default",
      })
      throw error // Re-throw to be caught by error boundary
    }
  }

  const simulatePerformanceIssue = () => {
    try {
      // Use the performance monitor to measure a heavy operation
      const result = performanceMonitor.measureOperation('Heavy Computation', () => {
        let sum = 0
        for (let i = 0; i < 1000000; i++) {
          sum += Math.random()
        }
        return sum
      })

      // Get current metrics and score
      const metrics = performanceMonitor.getMetrics()
      const score = performanceMonitor.getPerformanceScore()
      
      // Log comprehensive performance report
      console.group('🚀 Performance Test Results')
      console.log(performanceMonitor.generateReport())
      console.log('')
      console.log('⚡ Heavy Operation Results:')
      console.log(`  • Operation Duration: ${metrics.customOperationTime?.toFixed(2)}ms`)
      console.log(`  • Performance Impact: ${(metrics.customOperationTime || 0) > 16 ? '⚠️ May cause frame drops' : '✅ Smooth'}`)
      console.log(`  • Performance Score: ${score.score}/100 (${score.grade})`)
      console.groupEnd()

      // Show performance report in UI
      setShowPerformanceReport(true)

      // Show success toast
      toast({
        title: "Performance Test Complete",
        description: `Operation completed in ${metrics.customOperationTime?.toFixed(2)}ms. Performance score: ${score.score}/100 (${score.grade})`,
        variant: "default",
      })

      // If observability is enabled, this data will be automatically sent to LaunchDarkly
      if (state.observability.isEnabled) {
        toast({
          title: "Data Sent to LaunchDarkly",
          description: "Performance metrics have been sent to observability.",
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Performance Test Failed",
        description: "An error occurred during the performance test.",
        variant: "destructive",
      })
      console.error('Performance test failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Observability & Session Replay</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Test LaunchDarkly's observability and session replay features
          </p>
        </div>
        
        {/* System Status Indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            state.userConsent && !state.observability.error && !state.sessionReplay.error
              ? 'bg-green-500 animate-pulse'
              : state.observability.error || state.sessionReplay.error
              ? 'bg-red-500'
              : 'bg-gray-400'
          }`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {state.userConsent && !state.observability.error && !state.sessionReplay.error
              ? 'All Systems Active'
              : state.observability.error || state.sessionReplay.error
              ? 'System Error'
              : 'System Inactive'
            }
          </span>
        </div>
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
              checked={state.userConsent}
              onCheckedChange={(checked) => {
                setUserConsent(checked)
                if (checked) {
                  toast({
                    title: "Consent Granted",
                    description: "Observability and session replay have been enabled.",
                    variant: "default",
                  })
                } else {
                  toast({
                    title: "Consent Revoked",
                    description: "All data collection has been stopped.",
                    variant: "default",
                  })
                }
              }}
              disabled={state.observability.isLoading || state.sessionReplay.isLoading}
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

      {/* Error Display */}
      {(state.observability.error || state.sessionReplay.error) && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            {state.observability.error && (
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Observability: {state.observability.error}</span>
              </div>
            )}
            {state.sessionReplay.error && (
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Session Replay: {state.sessionReplay.error}</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Display */}
      {state.userConsent && !state.observability.error && !state.sessionReplay.error && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            All systems are running normally. Data collection is active.
          </AlertDescription>
        </Alert>
      )}

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
                checked={state.observability.isEnabled}
                onCheckedChange={toggleObservability}
                disabled={!state.userConsent || state.observability.isLoading}
              />
              <Label htmlFor="observability">Enable Observability</Label>
            </div>
            <Badge variant="outline" className={state.observability.isEnabled ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300"}>
              {state.observability.isLoading ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </div>
              ) : (
                state.observability.isEnabled ? "Active" : "Inactive"
              )}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={simulateError}
              disabled={!state.observability.isEnabled}
              className="h-16 flex flex-col gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Simulate Error</span>
            </Button>
            <Button
              variant="outline"
              onClick={simulatePerformanceIssue}
              disabled={!state.observability.isEnabled}
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
                checked={state.sessionReplay.isEnabled}
                onCheckedChange={toggleSessionReplay}
                disabled={!state.userConsent || state.sessionReplay.isLoading}
              />
              <Label htmlFor="session-replay">Enable Session Replay</Label>
            </div>
            <Badge variant="outline" className={state.sessionReplay.isEnabled ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-gray-100 text-gray-700 border-gray-300"}>
              {state.sessionReplay.isLoading ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading...
                </div>
              ) : (
                state.sessionReplay.isEnabled ? "Recording" : "Stopped"
              )}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await startNewSession()
                  toast({
                    title: "Session Started",
                    description: "New session recording has begun.",
                    variant: "default",
                  })
                } catch (error) {
                  toast({
                    title: "Failed to Start Session",
                    description: "Could not start session recording.",
                    variant: "destructive",
                  })
                }
              }}
              disabled={!state.userConsent || state.sessionReplay.isEnabled || state.sessionReplay.isLoading}
              className="h-16 flex flex-col gap-2"
            >
              {state.sessionReplay.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Video className="w-5 h-5" />
              )}
              <span className="text-sm">
                {state.sessionReplay.isLoading ? "Starting..." : "Start New Session"}
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await stopSessionReplay()
                  toast({
                    title: "Session Stopped",
                    description: "Session recording has been stopped.",
                    variant: "default",
                  })
                } catch (error) {
                  toast({
                    title: "Failed to Stop Session",
                    description: "Could not stop session recording.",
                    variant: "destructive",
                  })
                }
              }}
              disabled={!state.userConsent || !state.sessionReplay.isEnabled || state.sessionReplay.isLoading}
              className="h-16 flex flex-col gap-2"
            >
              {state.sessionReplay.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
              <span className="text-sm">
                {state.sessionReplay.isLoading ? "Stopping..." : "Stop Recording"}
              </span>
            </Button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>• Session replay records user interactions for debugging</p>
            <p>• Privacy settings control what data is captured</p>
            <p>• Requires user consent to be enabled</p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Display */}
      {showPerformanceReport && performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Real-time Core Web Vitals and performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Core Web Vitals</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>LCP:</span>
                      <span className="font-mono">{performanceMetrics.largestContentfulPaint.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FID:</span>
                      <span className="font-mono">{performanceMetrics.firstInputDelay.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CLS:</span>
                      <span className="font-mono">{performanceMetrics.cumulativeLayoutShift.toFixed(3)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Additional Metrics</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>FCP:</span>
                      <span className="font-mono">{performanceMetrics.firstContentfulPaint.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FP:</span>
                      <span className="font-mono">{performanceMetrics.firstPaint.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Load Time:</span>
                      <span className="font-mono">{performanceMetrics.pageLoadTime}ms</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {performanceMetrics.customOperationTime && (
                <div className="pt-2 border-t">
                  <h4 className="font-medium text-sm mb-2">Custom Operation</h4>
                  <div className="flex justify-between text-sm">
                    <span>Heavy Computation:</span>
                    <span className="font-mono">{performanceMetrics.customOperationTime.toFixed(2)}ms</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPerformanceReport(false)}
                >
                  Hide Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const report = performanceMonitor.generateReport()
                    console.log(report)
                  }}
                >
                  Log Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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