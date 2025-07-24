"use client"

import { useState, useEffect, useCallback } from "react"
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk"

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error"

export function useLaunchDarklyConnection() {
  const ldClient = useLDClient()
  const flags = useFlags()
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [initializationAttempted, setInitializationAttempted] = useState(false)

  // Handle client initialization validation
  const validateConnection = useCallback(async () => {
    if (!ldClient || initializationAttempted) return

    setInitializationAttempted(true)
    try {
      // Wait for initialization with a reasonable timeout
      await ldClient.waitForInitialization(10)
      setConnectionStatus("connected")
      setIsInitialized(true)
      setLastUpdate(new Date())
      setErrorMessage(null)
    } catch (error) {
      setConnectionStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Initialization failed")
      setIsInitialized(false)
    }
  }, [ldClient, initializationAttempted])

  // Set up event listeners for real-time status monitoring
  useEffect(() => {
    if (!ldClient) {
      setConnectionStatus("connecting")
      setErrorMessage("Client not initialized")
      setIsInitialized(false)
      setInitializationAttempted(false)
      return
    }

    // Event handler for when client is ready
    const handleReady = () => {
      console.log("LaunchDarkly client ready")
    }

    // Event handler for successful initialization
    const handleInitialized = () => {
      console.log("LaunchDarkly client initialized successfully")
      setConnectionStatus("connected")
      setIsInitialized(true)
      setLastUpdate(new Date())
      setErrorMessage(null)
    }

    // Event handler for initialization failure
    const handleFailed = (error: Error) => {
      console.error("LaunchDarkly client failed to initialize:", error)
      setConnectionStatus("error")
      setErrorMessage(error.message || "Failed to initialize")
      setIsInitialized(false)
    }

    // Event handler for general errors
    const handleError = (error: Error) => {
      console.error("LaunchDarkly client error:", error)
      setConnectionStatus("error")
      setErrorMessage(error.message || "Client error occurred")
    }

    // Event handler for flag changes
    const handleChange = (changes: any) => {
      console.log("LaunchDarkly flags changed:", changes)
      setLastUpdate(new Date())
    }

    // Register all event listeners
    ldClient.on("ready", handleReady)
    ldClient.on("initialized", handleInitialized)
    ldClient.on("failed", handleFailed)
    ldClient.on("error", handleError)
    ldClient.on("change", handleChange)

    // Start validation process
    validateConnection()

    // Cleanup function to remove event listeners
    return () => {
      ldClient.off("ready", handleReady)
      ldClient.off("initialized", handleInitialized)
      ldClient.off("failed", handleFailed)
      ldClient.off("error", handleError)
      ldClient.off("change", handleChange)
    }
  }, [ldClient, validateConnection])

  // Monitor network connectivity changes
  useEffect(() => {
    const handleOnline = () => {
      if (ldClient && !isInitialized) {
        setConnectionStatus("connecting")
        setErrorMessage("Reconnecting...")
        // Re-attempt initialization
        setInitializationAttempted(false)
        validateConnection()
      }
    }

    const handleOffline = () => {
      setConnectionStatus("disconnected")
      setErrorMessage("Network disconnected")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [ldClient, isInitialized, validateConnection])

  // Fallback: If we have flags but haven't received initialization events,
  // we can assume we're connected
  useEffect(() => {
    if (ldClient && Object.keys(flags).length > 0 && !isInitialized) {
      setConnectionStatus("connected")
      setIsInitialized(true)
      setLastUpdate(new Date())
      setErrorMessage(null)
    }
  }, [ldClient, flags, isInitialized])

  // Additional validation using waitUntilReady for comprehensive status
  useEffect(() => {
    if (!ldClient || !isInitialized) return

    const checkClientReadiness = async () => {
      try {
        await ldClient.waitUntilReady()
        // Client is ready and operational
        setConnectionStatus("connected")
        setLastUpdate(new Date())
        setErrorMessage(null)
      } catch (error) {
        // This shouldn't happen if we're initialized, but handle it anyway
        console.warn("Client readiness check failed:", error)
      }
    }

    checkClientReadiness()
  }, [ldClient, isInitialized])

  return {
    connectionStatus,
    lastUpdate,
    errorMessage,
    isConnected: connectionStatus === "connected",
    isConnecting: connectionStatus === "connecting",
    isDisconnected: connectionStatus === "disconnected" || connectionStatus === "error",
    isInitialized,
    hasFlags: Object.keys(flags).length > 0
  }
} 