"use client"

import React, { ReactNode } from "react"
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk"
import Observability from '@launchdarkly/observability'
import SessionReplay from '@launchdarkly/session-replay'
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LaunchDarklyProviderProps {
  children: ReactNode
  clientSideID: string
  context?: {
    kind: string
    key: string
    name?: string
    email?: string
  }
  options?: {
    bootstrap?: 'localStorage'
    sendEvents?: boolean
    evaluationReasons?: boolean
  }
  timeout?: number
}

export function LaunchDarklyProvider({ 
  children, 
  clientSideID, 
  context,
  options 
}: LaunchDarklyProviderProps) {
  const [LDProvider, setLDProvider] = React.useState<React.ComponentType<{ children: ReactNode }> | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const initializeLaunchDarkly = async () => {
      try {
        const provider = await asyncWithLDProvider({
          clientSideID,
          context: context || {
            kind: "user",
            key: "anonymous-user",
            name: "Anonymous User"
          },
          options: {
            // bootstrap: 'localStorage',
            sendEvents: true,
            evaluationReasons: true,
            // Initialize plugins with manual start - they will be controlled by user consent
            plugins: [
              new Observability({ 
                manualStart: true,
                tracingOrigins: true,
                networkRecording: {
                  enabled: true,
                  recordHeadersAndBody: true
                }
              }),
              new SessionReplay({ 
                manualStart: true,
                privacySetting: 'default'
              })
            ],
            ...options
          },
          timeout: 3
        })
        
        setLDProvider(() => provider)
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to initialize LaunchDarkly:", err)
        setError("Failed to initialize LaunchDarkly")
        setIsLoading(false)
      }
    }

    if (clientSideID) {
      initializeLaunchDarkly()
    }
  }, [clientSideID, context, options])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">LaunchDarkly Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !LDProvider) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Initializing LaunchDarkly...</p>
        </div>
      </div>
    )
  }

  return <LDProvider>{children}</LDProvider>
} 