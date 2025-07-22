"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Square, Users, Zap, Target, Globe } from "lucide-react"

interface TrafficSimulatorProps {
  onTrafficGenerated: (evaluations: number) => void
}

export function TrafficSimulator({ onTrafficGenerated }: TrafficSimulatorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [trafficIntensity, setTrafficIntensity] = useState([50])
  const [conversionRate, setConversionRate] = useState([15])
  const [userType, setUserType] = useState("mixed")
  const [duration, setDuration] = useState("30")
  const [progress, setProgress] = useState(0)
  const [generatedStats, setGeneratedStats] = useState({
    users: 0,
    evaluations: 0,
    conversions: 0,
  })

  const startSimulation = () => {
    setIsRunning(true)
    setProgress(0)
    setGeneratedStats({ users: 0, evaluations: 0, conversions: 0 })

    const durationMs = Number.parseInt(duration) * 1000
    const interval = 100 // Update every 100ms
    const totalSteps = durationMs / interval

    let currentStep = 0
    const simulationInterval = setInterval(() => {
      currentStep++
      const progressPercent = (currentStep / totalSteps) * 100
      setProgress(progressPercent)

      // Generate traffic based on intensity
      const usersPerStep = (trafficIntensity[0] / 100) * 5 // Max 5 users per step
      const evaluationsPerUser = Math.floor(Math.random() * 3) + 1
      const newUsers = Math.floor(usersPerStep)
      const newEvaluations = newUsers * evaluationsPerUser
      const newConversions = Math.floor(newEvaluations * (conversionRate[0] / 100))

      setGeneratedStats((prev) => ({
        users: prev.users + newUsers,
        evaluations: prev.evaluations + newEvaluations,
        conversions: prev.conversions + newConversions,
      }))

      onTrafficGenerated(newEvaluations)

      if (currentStep >= totalSteps) {
        clearInterval(simulationInterval)
        setIsRunning(false)
        setProgress(100)
      }
    }, interval)
  }

  const stopSimulation = () => {
    setIsRunning(false)
    setProgress(0)
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setProgress(0)
    setGeneratedStats({ users: 0, evaluations: 0, conversions: 0 })
  }

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "new":
        return <Users className="w-4 h-4" />
      case "returning":
        return <Target className="w-4 h-4" />
      case "premium":
        return <Zap className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const presetScenarios = [
    { name: "Light Traffic", intensity: 25, conversion: 10, duration: "60" },
    { name: "Normal Load", intensity: 50, conversion: 15, duration: "30" },
    { name: "Peak Hours", intensity: 80, conversion: 12, duration: "45" },
    { name: "Stress Test", intensity: 100, conversion: 8, duration: "20" },
  ]

  const applyPreset = (preset: (typeof presetScenarios)[0]) => {
    setTrafficIntensity([preset.intensity])
    setConversionRate([preset.conversion])
    setDuration(preset.duration)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Traffic Simulator</h2>
        <p className="text-gray-600 dark:text-gray-400">Generate artificial traffic to test flag performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Configuration</CardTitle>
            <CardDescription>Configure traffic patterns and user behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preset Scenarios */}
            <div className="space-y-3">
              <Label>Quick Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {presetScenarios.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    disabled={isRunning}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Traffic Intensity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Traffic Intensity</Label>
                <Badge variant="outline">{trafficIntensity[0]}%</Badge>
              </div>
              <Slider
                value={trafficIntensity}
                onValueChange={setTrafficIntensity}
                max={100}
                step={5}
                disabled={isRunning}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Higher intensity generates more users and flag evaluations</p>
            </div>

            {/* Conversion Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Target Conversion Rate</Label>
                <Badge variant="outline">{conversionRate[0]}%</Badge>
              </div>
              <Slider
                value={conversionRate}
                onValueChange={setConversionRate}
                max={50}
                step={1}
                disabled={isRunning}
                className="w-full"
              />
              <p className="text-xs text-gray-500">Percentage of evaluations that result in conversions</p>
            </div>

            {/* User Type */}
            <div className="space-y-3">
              <Label>User Type Distribution</Label>
              <Select value={userType} onValueChange={setUserType} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Mixed Users
                    </div>
                  </SelectItem>
                  <SelectItem value="new">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      New Users Only
                    </div>
                  </SelectItem>
                  <SelectItem value="returning">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Returning Users
                    </div>
                  </SelectItem>
                  <SelectItem value="premium">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Premium Users
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label>Duration (seconds)</Label>
              <Select value={duration} onValueChange={setDuration} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Controls */}
            <div className="flex gap-2 pt-4">
              <Button onClick={startSimulation} disabled={isRunning} className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Start Simulation
              </Button>
              <Button variant="outline" onClick={stopSimulation} disabled={!isRunning}>
                <Pause className="w-4 h-4" />
              </Button>
              <Button variant="outline" onClick={resetSimulation} disabled={isRunning}>
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>Real-time traffic generation statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress */}
            {isRunning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Progress</Label>
                  <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Generated Stats */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Users Generated</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{generatedStats.users.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Flag Evaluations</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {generatedStats.evaluations.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Conversions</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{generatedStats.conversions.toLocaleString()}</span>
              </div>
            </div>

            {/* Current Rate */}
            {isRunning && (
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Live Activity</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Generating ~{Math.round((trafficIntensity[0] / 100) * 5)} users/second</p>
                  <p>Target conversion rate: {conversionRate[0]}%</p>
                  <p>User type: {userType}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
