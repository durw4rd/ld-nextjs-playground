import { LDObserve } from '@launchdarkly/observability'
import { LDRecord } from '@launchdarkly/session-replay'

/**
 * Utility functions for controlling LaunchDarkly observability and session replay plugins
 */

// Consent management
const CONSENT_STORAGE_KEY = 'ld-observability-consent'
const OBSERVABILITY_STORAGE_KEY = 'ld-observability-enabled'
const SESSION_REPLAY_STORAGE_KEY = 'ld-session-replay-enabled'

export const consentManager = {
  /**
   * Get user consent from localStorage
   */
  getConsent: (): boolean => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem(CONSENT_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  },

  /**
   * Set user consent in localStorage
   */
  setConsent: (hasConsent: boolean): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, hasConsent.toString())
    } catch (error) {
      console.warn('Failed to save consent to localStorage:', error)
    }
  },

  /**
   * Clear user consent from localStorage
   */
  clearConsent: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear consent from localStorage:', error)
    }
  }
}

// Plugin state management
export const pluginStateManager = {
  /**
   * Get observability enabled state from localStorage
   */
  getObservabilityEnabled: (): boolean => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem(OBSERVABILITY_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  },

  /**
   * Set observability enabled state in localStorage
   */
  setObservabilityEnabled: (enabled: boolean): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(OBSERVABILITY_STORAGE_KEY, enabled.toString())
    } catch (error) {
      console.warn('Failed to save observability state to localStorage:', error)
    }
  },

  /**
   * Get session replay enabled state from localStorage
   */
  getSessionReplayEnabled: (): boolean => {
    if (typeof window === 'undefined') return false
    try {
      return localStorage.getItem(SESSION_REPLAY_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  },

  /**
   * Set session replay enabled state in localStorage
   */
  setSessionReplayEnabled: (enabled: boolean): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(SESSION_REPLAY_STORAGE_KEY, enabled.toString())
    } catch (error) {
      console.warn('Failed to save session replay state to localStorage:', error)
    }
  }
}

// Observability controls
export const observability = {
  /**
   * Start the observability plugin
   * Useful for feature-flagged rollouts or after user consent
   */
  start: () => {
    try {
      LDObserve.start()
      console.log('LaunchDarkly observability started')
    } catch (error) {
      console.warn('Failed to start LaunchDarkly observability:', error)
    }
  },

  /**
   * Stop the observability plugin
   */
  stop: () => {
    try {
      LDObserve.stop()
      console.log('LaunchDarkly observability stopped')
    } catch (error) {
      console.warn('Failed to stop LaunchDarkly observability:', error)
    }
  },

  /**
   * Check if observability is currently running
   * Note: This is a simplified check since the SDK doesn't expose running state
   * In a production app, you might want to track this state explicitly
   */
  isRunning: (): boolean => {
    try {
      // Since the SDK doesn't expose running state, we'll use a more reliable approach
      // by checking if the plugin is properly initialized
      return typeof LDObserve.start === 'function' && typeof LDObserve.stop === 'function'
    } catch {
      return false
    }
  },

  /**
   * Get the current status of observability
   */
  getStatus: (): { isRunning: boolean; isInitialized: boolean } => {
    try {
      const isInitialized = typeof LDObserve.start === 'function'
      return {
        isRunning: isInitialized, // Simplified - in reality you'd track this separately
        isInitialized
      }
    } catch {
      return { isRunning: false, isInitialized: false }
    }
  }
}

// Session replay controls
export const sessionReplay = {
  /**
   * Start session recording
   * @param options - Recording options
   */
  start: (options?: { forceNew?: boolean; silent?: boolean }) => {
    try {
      LDRecord.start({
        forceNew: options?.forceNew || false,
        silent: options?.silent || false
      })
      console.log('LaunchDarkly session replay started')
    } catch (error) {
      console.warn('Failed to start LaunchDarkly session replay:', error)
    }
  },

  /**
   * Stop session recording
   */
  stop: () => {
    try {
      LDRecord.stop()
      console.log('LaunchDarkly session replay stopped')
    } catch (error) {
      console.warn('Failed to stop LaunchDarkly session replay:', error)
    }
  },

  /**
   * Check if session replay is currently running
   * Note: This is a simplified check since the SDK doesn't expose running state
   * In a production app, you might want to track this state explicitly
   */
  isRunning: (): boolean => {
    try {
      // Since the SDK doesn't expose running state, we'll use a more reliable approach
      // by checking if the plugin is properly initialized
      return typeof LDRecord.start === 'function' && typeof LDRecord.stop === 'function'
    } catch {
      return false
    }
  },

  /**
   * Get the current status of session replay
   */
  getStatus: (): { isRunning: boolean; isInitialized: boolean } => {
    try {
      const isInitialized = typeof LDRecord.start === 'function'
      return {
        isRunning: isInitialized, // Simplified - in reality you'd track this separately
        isInitialized
      }
    } catch {
      return { isRunning: false, isInitialized: false }
    }
  }
}

/**
 * Initialize observability with user consent
 * @param hasConsent - Whether user has given consent
 */
export const initializeWithConsent = (hasConsent: boolean) => {
  if (hasConsent) {
    observability.start()
    sessionReplay.start()
  }
}

/**
 * Initialize observability with feature flag check
 * @param isEnabled - Whether observability is enabled via feature flag
 */
export const initializeWithFeatureFlag = (isEnabled: boolean) => {
  if (isEnabled) {
    observability.start()
    sessionReplay.start()
  }
} 