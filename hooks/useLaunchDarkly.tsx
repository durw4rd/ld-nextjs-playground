"use client"

import { useFlags, useLDClient } from "launchdarkly-react-client-sdk"
import { useCallback } from "react"

export function useLaunchDarkly() {
  const flags = useFlags()
  const ldClient = useLDClient()

  const identifyUser = useCallback((user: { key: string; name?: string; email?: string }) => {
    if (ldClient) {
      ldClient.identify({
        kind: "user",
        key: user.key,
        name: user.name,
        email: user.email
      })
    }
  }, [ldClient])

  const trackEvent = useCallback((eventName: string, data?: Record<string, any>) => {
    if (ldClient) {
      ldClient.track(eventName, data)
    }
  }, [ldClient])

  return {
    flags,
    ldClient,
    identifyUser,
    trackEvent
  }
} 