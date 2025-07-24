"use client"

import { useLaunchDarklyConnection } from "@/hooks/useLaunchDarklyConnection"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi, WifiOff, AlertCircle, Loader2, Clock, AlertTriangle } from "lucide-react"

export function ConnectionStatus() {
  const {
    connectionStatus,
    lastUpdate,
    errorMessage,
    isConnected,
    isConnecting,
    isDisconnected,
    isInitialized,
    hasFlags
  } = useLaunchDarklyConnection()

  const getStatusIcon = () => {
    if (isConnecting) return <Loader2 className="w-5 h-5 animate-spin text-yellow-600" />
    if (isConnected) return <Wifi className="w-5 h-5 text-green-600" />
    if (isDisconnected) return <WifiOff className="w-5 h-5 text-red-600" />
    return <AlertCircle className="w-5 h-5 text-gray-600" />
  }

  const getStatusColor = () => {
    if (isConnecting) return "bg-yellow-50 border-yellow-200"
    if (isConnected) return "bg-green-50 border-green-200"
    if (isDisconnected) return "bg-red-50 border-red-200"
    return "bg-gray-50 border-gray-200"
  }

  const getStatusText = () => {
    if (isConnecting) return "Connecting to LaunchDarkly..."
    if (isConnected) return "Connected to LaunchDarkly"
    if (isDisconnected) return "Disconnected from LaunchDarkly"
    return "Connection Error"
  }

  return (
    <Card className={getStatusColor()}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <Badge variant="outline" className={
            isConnecting ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
            isConnected ? "bg-green-100 text-green-700 border-green-300" :
            "bg-red-100 text-red-700 border-red-300"
          }>
            {connectionStatus}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Initialized</span>
          <Badge variant="outline" className={isInitialized ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300"}>
            {isInitialized ? "Yes" : "No"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Flags Available</span>
          <Badge variant="outline" className={hasFlags ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-700 border-gray-300"}>
            {hasFlags ? "Yes" : "No"}
          </Badge>
        </div>

        {lastUpdate && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Update</span>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-red-700">{errorMessage}</span>
          </div>
        )}

        <div className="text-xs text-gray-500">
          {getStatusText()}
        </div>
      </CardContent>
    </Card>
  )
} 