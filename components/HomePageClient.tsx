"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeatureFlagControls } from "@/components/FeatureFlagControls"
import { MetricsDashboard } from "@/components/MetricsDashboard"
import { TrafficSimulator } from "@/components/TrafficSimulator"
import { ObservabilityPanel } from "@/components/ObservabilityPanel"
import { OnboardingModal } from "@/components/OnboardingModal"
import { LaunchDarklyDemo } from "@/components/LaunchDarklyDemo"
import { AppHeader } from "@/components/AppHeader"
import { StatsOverview } from "@/components/StatsOverview"
import { Flag, BarChart3, Activity, Users, Zap } from "lucide-react"

export function HomePageClient() {
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [activeFlags, setActiveFlags] = useState(3)
  const [totalEvaluations, setTotalEvaluations] = useState(1247)
  const [conversionRate, setConversionRate] = useState(12.4)

  const handleHelpClick = () => setShowOnboarding(true)
  const handleOnboardingClose = () => setShowOnboarding(false)
  const handleFlagChange = (count: number) => setActiveFlags(count)
  const handleEvaluationChange = (count: number) => setTotalEvaluations(count)
  const handleConversionRateChange = (rate: number) => setConversionRate(rate)
  const handleTrafficGenerated = (evaluations: number) => 
    setTotalEvaluations((prev) => prev + evaluations)

  return (
    <>
      <OnboardingModal open={showOnboarding} onClose={handleOnboardingClose} />
      
      <AppHeader onHelpClick={handleHelpClick} />
      
      <div className="container mx-auto px-4 py-6">
        <StatsOverview 
          activeFlags={activeFlags}
          totalEvaluations={totalEvaluations}
          conversionRate={conversionRate}
        />

        <Tabs defaultValue="launchdarkly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="launchdarkly" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              LaunchDarkly
            </TabsTrigger>
            <TabsTrigger value="flags" className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Feature Flags
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="traffic" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Traffic Simulator
            </TabsTrigger>
            <TabsTrigger value="observability" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Observability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="launchdarkly" className="space-y-6">
            <LaunchDarklyDemo />
          </TabsContent>

          <TabsContent value="flags" className="space-y-6">
            <FeatureFlagControls
              onFlagChange={handleFlagChange}
              onEvaluationChange={handleEvaluationChange}
            />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <MetricsDashboard 
              conversionRate={conversionRate} 
              onConversionRateChange={handleConversionRateChange} 
            />
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <TrafficSimulator onTrafficGenerated={handleTrafficGenerated} />
          </TabsContent>

          <TabsContent value="observability" className="space-y-6">
            <ObservabilityPanel />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
} 