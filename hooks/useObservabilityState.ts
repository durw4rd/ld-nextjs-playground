import { useState, useEffect, useCallback } from 'react'
import { observability, sessionReplay, consentManager, pluginStateManager } from '@/utils/launchdarkly-observability'

interface PluginState {
  isEnabled: boolean
  isLoading: boolean
  error: string | null
}

interface ObservabilityState {
  userConsent: boolean
  observability: PluginState
  sessionReplay: PluginState
}

export function useObservabilityState() {
  const [state, setState] = useState<ObservabilityState>({
    userConsent: false,
    observability: { isEnabled: false, isLoading: false, error: null },
    sessionReplay: { isEnabled: false, isLoading: false, error: null }
  })

  // Initialize state from localStorage
  useEffect(() => {
    const savedConsent = consentManager.getConsent()
    const savedObservabilityEnabled = pluginStateManager.getObservabilityEnabled()
    const savedSessionReplayEnabled = pluginStateManager.getSessionReplayEnabled()

    setState(prev => ({
      ...prev,
      userConsent: savedConsent,
      observability: { ...prev.observability, isEnabled: savedObservabilityEnabled },
      sessionReplay: { ...prev.sessionReplay, isEnabled: savedSessionReplayEnabled }
    }))

    // Start plugins if consent is given and they were previously enabled
    if (savedConsent) {
      if (savedObservabilityEnabled) {
        observability.start()
      }
      if (savedSessionReplayEnabled) {
        sessionReplay.start()
      }
    }
  }, [])

  const setUserConsent = useCallback(async (consent: boolean) => {
    setState(prev => ({
      ...prev,
      userConsent: consent,
      observability: { ...prev.observability, isLoading: true, error: null },
      sessionReplay: { ...prev.sessionReplay, isLoading: true, error: null }
    }))

    try {
      consentManager.setConsent(consent)

      if (consent) {
        // When consent is first given, enable both plugins by default
        await Promise.all([
          observability.start(),
          sessionReplay.start()
        ])

        pluginStateManager.setObservabilityEnabled(true)
        pluginStateManager.setSessionReplayEnabled(true)

        setState(prev => ({
          ...prev,
          userConsent: consent,
          observability: { isEnabled: true, isLoading: false, error: null },
          sessionReplay: { isEnabled: true, isLoading: false, error: null }
        }))
      } else {
        // When consent is revoked, stop all plugins and clear their states
        await Promise.all([
          observability.stop(),
          sessionReplay.stop()
        ])

        pluginStateManager.setObservabilityEnabled(false)
        pluginStateManager.setSessionReplayEnabled(false)

        setState(prev => ({
          ...prev,
          userConsent: consent,
          observability: { isEnabled: false, isLoading: false, error: null },
          sessionReplay: { isEnabled: false, isLoading: false, error: null }
        }))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({
        ...prev,
        userConsent: consent,
        observability: { ...prev.observability, isLoading: false, error: errorMessage },
        sessionReplay: { ...prev.sessionReplay, isLoading: false, error: errorMessage }
      }))
    }
  }, [])

  const toggleObservability = useCallback(async (enabled: boolean) => {
    if (!state.userConsent) {
      setState(prev => ({
        ...prev,
        observability: { ...prev.observability, error: 'Cannot toggle observability without user consent' }
      }))
      return
    }

    setState(prev => ({
      ...prev,
      observability: { ...prev.observability, isLoading: true, error: null }
    }))

    try {
      if (enabled) {
        await observability.start()
      } else {
        await observability.stop()
      }

      pluginStateManager.setObservabilityEnabled(enabled)

      setState(prev => ({
        ...prev,
        observability: { isEnabled: enabled, isLoading: false, error: null }
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle observability'
      setState(prev => ({
        ...prev,
        observability: { ...prev.observability, isLoading: false, error: errorMessage }
      }))
    }
  }, [state.userConsent])

  const toggleSessionReplay = useCallback(async (enabled: boolean) => {
    if (!state.userConsent) {
      setState(prev => ({
        ...prev,
        sessionReplay: { ...prev.sessionReplay, error: 'Cannot toggle session replay without user consent' }
      }))
      return
    }

    setState(prev => ({
      ...prev,
      sessionReplay: { ...prev.sessionReplay, isLoading: true, error: null }
    }))

    try {
      if (enabled) {
        await sessionReplay.start({ forceNew: true })
      } else {
        await sessionReplay.stop()
      }

      pluginStateManager.setSessionReplayEnabled(enabled)

      setState(prev => ({
        ...prev,
        sessionReplay: { isEnabled: enabled, isLoading: false, error: null }
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle session replay'
      setState(prev => ({
        ...prev,
        sessionReplay: { ...prev.sessionReplay, isLoading: false, error: errorMessage }
      }))
    }
  }, [state.userConsent])

  const startNewSession = useCallback(async () => {
    if (!state.userConsent) {
      setState(prev => ({
        ...prev,
        sessionReplay: { ...prev.sessionReplay, error: 'Cannot start session replay without user consent' }
      }))
      return
    }

    setState(prev => ({
      ...prev,
      sessionReplay: { ...prev.sessionReplay, isLoading: true, error: null }
    }))

    try {
      await sessionReplay.start({ forceNew: true })
      pluginStateManager.setSessionReplayEnabled(true)

      setState(prev => ({
        ...prev,
        sessionReplay: { isEnabled: true, isLoading: false, error: null }
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start new session'
      setState(prev => ({
        ...prev,
        sessionReplay: { ...prev.sessionReplay, isLoading: false, error: errorMessage }
      }))
    }
  }, [state.userConsent])

  const stopSessionReplay = useCallback(async () => {
    if (!state.userConsent) {
      setState(prev => ({
        ...prev,
        sessionReplay: { ...prev.sessionReplay, error: 'Cannot stop session replay without user consent' }
      }))
      return
    }

    setState(prev => ({
      ...prev,
      sessionReplay: { ...prev.sessionReplay, isLoading: true, error: null }
    }))

    try {
      await sessionReplay.stop()
      pluginStateManager.setSessionReplayEnabled(false)

      setState(prev => ({
        ...prev,
        sessionReplay: { isEnabled: false, isLoading: false, error: null }
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop session replay'
      setState(prev => ({
        ...prev,
        sessionReplay: { ...prev.sessionReplay, isLoading: false, error: errorMessage }
      }))
    }
  }, [state.userConsent])

  return {
    state,
    setUserConsent,
    toggleObservability,
    toggleSessionReplay,
    startNewSession,
    stopSessionReplay
  }
} 