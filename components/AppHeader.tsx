"use client"

import { useLaunchDarklyConnection } from "@/hooks/useLaunchDarklyConnection"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, AlertCircle, Loader2 } from "lucide-react"

export function AppHeader() {
  const { connectionStatus, isConnected, isConnecting, isDisconnected } = useLaunchDarklyConnection()

  const getStatusIcon = () => {
    if (isConnecting) return <Loader2 className="w-4 h-4 animate-spin" />
    if (isConnected) return <Wifi className="w-4 h-4" />
    if (isDisconnected) return <WifiOff className="w-4 h-4" />
    return <AlertCircle className="w-4 h-4" />
  }

  const getStatusColor = () => {
    if (isConnecting) return "bg-yellow-100 text-yellow-700 border-yellow-300"
    if (isConnected) return "bg-green-100 text-green-700 border-green-300"
    if (isDisconnected) return "bg-red-100 text-red-700 border-red-300"
    return "bg-gray-100 text-gray-700 border-gray-300"
  }

  const getStatusText = () => {
    if (isConnecting) return "Connecting"
    if (isConnected) return "Connected"
    if (isDisconnected) return "Disconnected"
    return "Error"
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">LD</span>
            </div>
            <span className="font-semibold">LaunchDarkly Demo</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  )
} 