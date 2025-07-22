import { useState, useEffect, useCallback } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const updateMobileState = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
    } catch (err) {
      setError("Failed to detect mobile state")
      console.error("Mobile detection error:", err)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const handleResize = () => {
      updateMobileState()
    }

    try {
      mediaQuery.addEventListener("change", handleResize)
      updateMobileState()
      
      return () => {
        mediaQuery.removeEventListener("change", handleResize)
      }
    } catch (err) {
      setError("Failed to set up mobile detection")
      console.error("Mobile detection setup error:", err)
    }
  }, [updateMobileState])

  return {
    isMobile: !!isMobile,
    error,
    isLoading: isMobile === undefined
  }
}
