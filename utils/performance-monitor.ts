/**
 * Performance monitoring utilities for tracking Core Web Vitals and other metrics
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  
  // Additional metrics
  firstContentfulPaint: number
  firstPaint: number
  pageLoadTime: number
  domContentLoaded: number
  
  // Custom metrics
  customOperationTime?: number
  timestamp: number
}

export interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number }
  fid: { good: number; needsImprovement: number }
  cls: { good: number; needsImprovement: number }
}

// Default thresholds based on Google's Core Web Vitals
export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 }
}

export class PerformanceMonitor {
  private observer: PerformanceObserver | null = null
  private metrics: PerformanceMetrics
  private thresholds: PerformanceThresholds
  private onMetricsUpdate?: (metrics: PerformanceMetrics) => void

  constructor(thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS) {
    this.thresholds = thresholds
    this.metrics = this.getInitialMetrics()
  }

  private getInitialMetrics(): PerformanceMetrics {
    return {
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      firstContentfulPaint: 0,
      firstPaint: 0,
      pageLoadTime: 0,
      domContentLoaded: 0,
      timestamp: Date.now()
    }
  }

  /**
   * Start monitoring performance metrics
   */
  start(onUpdate?: (metrics: PerformanceMetrics) => void): void {
    this.onMetricsUpdate = onUpdate
    
    try {
      // Observe largest contentful paint
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          this.metrics.largestContentfulPaint = lastEntry.startTime
          this.updateMetrics()
        }
      })
      
      this.observer.observe({ entryTypes: ['largest-contentful-paint'] })
      
      // Observe layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any
          this.metrics.cumulativeLayoutShift += layoutShiftEntry.value
        }
        this.updateMetrics()
      })
      
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
      
      // Observe first input delay
      const firstInputObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const firstInputEntry = entry as any
          this.metrics.firstInputDelay = firstInputEntry.processingStart - firstInputEntry.startTime
        }
        this.updateMetrics()
      })
      
      firstInputObserver.observe({ entryTypes: ['first-input'] })
      
      // Get paint timing
      this.getPaintTiming()
      
      // Get navigation timing
      this.getNavigationTiming()
      
      console.log('🚀 Performance monitoring started')
    } catch (error) {
      console.warn('Failed to start performance monitoring:', error)
    }
  }

  /**
   * Stop monitoring performance metrics
   */
  stop(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    console.log('🛑 Performance monitoring stopped')
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get performance score based on thresholds
   */
  getPerformanceScore(): { score: number; grade: string; details: any } {
    const { lcp, fid, cls } = this.thresholds
    
    let score = 100
    const details: any = {}
    
    // LCP scoring
    if (this.metrics.largestContentfulPaint > lcp.needsImprovement) {
      score -= 30
      details.lcp = 'Poor'
    } else if (this.metrics.largestContentfulPaint > lcp.good) {
      score -= 15
      details.lcp = 'Needs Improvement'
    } else {
      details.lcp = 'Good'
    }
    
    // FID scoring
    if (this.metrics.firstInputDelay > fid.needsImprovement) {
      score -= 30
      details.fid = 'Poor'
    } else if (this.metrics.firstInputDelay > fid.good) {
      score -= 15
      details.fid = 'Needs Improvement'
    } else {
      details.fid = 'Good'
    }
    
    // CLS scoring
    if (this.metrics.cumulativeLayoutShift > cls.needsImprovement) {
      score -= 30
      details.cls = 'Poor'
    } else if (this.metrics.cumulativeLayoutShift > cls.good) {
      score -= 15
      details.cls = 'Needs Improvement'
    } else {
      details.cls = 'Good'
    }
    
    // Determine grade
    let grade = 'A'
    if (score < 50) grade = 'F'
    else if (score < 60) grade = 'D'
    else if (score < 70) grade = 'C'
    else if (score < 80) grade = 'B'
    else if (score < 90) grade = 'A-'
    
    return { score: Math.max(0, score), grade, details }
  }

  /**
   * Measure a custom operation
   */
  measureOperation(operationName: string, operation: () => any): any {
    const start = performance.now()
    const result = operation()
    const end = performance.now()
    const duration = end - start
    
    this.metrics.customOperationTime = duration
    this.updateMetrics()
    
    console.log(`⏱️ ${operationName} took ${duration.toFixed(2)}ms`)
    return result
  }

  /**
   * Get paint timing metrics
   */
  private getPaintTiming(): void {
    const paintEntries = performance.getEntriesByType('paint')
    paintEntries.forEach(entry => {
      if (entry.name === 'first-paint') {
        this.metrics.firstPaint = entry.startTime
      }
      if (entry.name === 'first-contentful-paint') {
        this.metrics.firstContentfulPaint = entry.startTime
      }
    })
  }

  /**
   * Get navigation timing metrics
   */
  private getNavigationTiming(): void {
    if (performance.timing) {
      this.metrics.pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      this.metrics.domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
    }
  }

  /**
   * Update metrics and notify callback
   */
  private updateMetrics(): void {
    this.metrics.timestamp = Date.now()
    if (this.onMetricsUpdate) {
      this.onMetricsUpdate({ ...this.metrics })
    }
  }

  /**
   * Generate a comprehensive performance report
   */
  generateReport(): string {
    const score = this.getPerformanceScore()
    const metrics = this.getMetrics()
    
    return `
🚀 Performance Report
====================

📊 Core Web Vitals:
  • Largest Contentful Paint: ${metrics.largestContentfulPaint.toFixed(0)}ms (${score.details.lcp})
  • First Input Delay: ${metrics.firstInputDelay.toFixed(0)}ms (${score.details.fid})
  • Cumulative Layout Shift: ${metrics.cumulativeLayoutShift.toFixed(3)} (${score.details.cls})

📈 Additional Metrics:
  • First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(0)}ms
  • First Paint: ${metrics.firstPaint.toFixed(0)}ms
  • Page Load Time: ${metrics.pageLoadTime}ms
  • DOM Content Loaded: ${metrics.domContentLoaded}ms

🎯 Performance Score: ${score.score}/100 (${score.grade})
    `.trim()
  }
}

// Export a singleton instance
export const performanceMonitor = new PerformanceMonitor() 