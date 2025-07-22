"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flag, BarChart3, Users, ChevronRight, ChevronLeft } from "lucide-react"

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to LaunchDarkly Showcase",
      description:
        "This interactive demo helps you explore LaunchDarkly's feature flag capabilities with both server-side and client-side SDKs.",
      icon: <Flag className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Perfect for internal training, customer demos, and hands-on learning. You'll be able to create flags,
            simulate traffic, and observe real-time metrics.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Feature Flags</Badge>
            <Badge variant="secondary">Real-time Metrics</Badge>
            <Badge variant="secondary">Traffic Simulation</Badge>
            <Badge variant="secondary">Observability</Badge>
          </div>
        </div>
      ),
    },
    {
      title: "Feature Flag Controls",
      description: "Create, toggle, and manage feature flags with targeting rules and real-time evaluation.",
      icon: <Flag className="w-8 h-8 text-green-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Use the Feature Flags tab to:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Create new feature flags with custom targeting</li>
            <li>Toggle flags on/off and see immediate impact</li>
            <li>Test server-side and client-side SDK integration</li>
            <li>Simulate different user contexts and targeting scenarios</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Metrics & Analytics",
      description: "Monitor flag performance, conversion rates, and user engagement in real-time.",
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">The Metrics dashboard provides:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Real-time flag evaluation metrics</li>
            <li>Conversion tracking and funnel analysis</li>
            <li>Performance impact visualization</li>
            <li>A/B test result comparison</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Traffic Simulation",
      description: "Generate artificial traffic and events to test flag behavior under load.",
      icon: <Users className="w-8 h-8 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Use the Traffic Simulator to:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Generate realistic user traffic patterns</li>
            <li>Simulate conversion events and user actions</li>
            <li>Test flag performance under different loads</li>
            <li>Create demo scenarios for presentations</li>
          </ul>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {currentStepData.icon}
            <div>
              <DialogTitle className="text-xl">{currentStepData.title}</DialogTitle>
              <DialogDescription className="text-base">{currentStepData.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">{currentStepData.content}</div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-blue-600" : "bg-gray-300"}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
