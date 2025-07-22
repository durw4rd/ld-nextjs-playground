import { Suspense } from "react"
import { Metadata } from "next"
import { HomePageClient } from "@/components/home-page-client"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "LaunchDarkly Showcase",
  description: "Interactive demo and testing environment for LaunchDarkly feature flags",
  generator: 'v0.dev'
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <HomePageClient />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
