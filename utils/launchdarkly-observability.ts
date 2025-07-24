import { LDObserve } from '@launchdarkly/observability'
import { LDRecord } from '@launchdarkly/session-replay'

/**
 * Utility functions for controlling LaunchDarkly observability and session replay plugins
 */

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