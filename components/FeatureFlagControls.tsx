"use client"

import { useState, useCallback, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Settings, Users, Globe, Smartphone } from "lucide-react"

interface FeatureFlagControlsProps {
  onFlagChange: (count: number) => void
  onEvaluationChange: (count: number) => void
}

interface FeatureFlagVariation {
  name: string
  value: boolean | string | number
  percentage?: number
}

interface FeatureFlag {
  id: string
  name: string
  key: string
  enabled: boolean
  type: "boolean" | "string" | "number"
  targeting: "all" | "percentage" | "custom"
  evaluations: number
  variations: FeatureFlagVariation[]
}

const INITIAL_FLAGS: FeatureFlag[] = [
  {
    id: "1",
    name: "New Checkout Flow",
    key: "new-checkout-flow",
    enabled: true,
    type: "boolean",
    targeting: "percentage",
    evaluations: 456,
    variations: [
      { name: "Enabled", value: true, percentage: 50 },
      { name: "Disabled", value: false, percentage: 50 },
    ],
  },
  {
    id: "2",
    name: "Premium Features",
    key: "premium-features",
    enabled: false,
    type: "boolean",
    targeting: "custom",
    evaluations: 234,
    variations: [
      { name: "Enabled", value: true },
      { name: "Disabled", value: false },
    ],
  },
  {
    id: "3",
    name: "Theme Variant",
    key: "theme-variant",
    enabled: true,
    type: "string",
    targeting: "all",
    evaluations: 557,
    variations: [
      { name: "Dark", value: "dark", percentage: 30 },
      { name: "Light", value: "light", percentage: 70 },
    ],
  },
]

const TargetingIcon = memo(({ targeting }: { targeting: string }) => {
  switch (targeting) {
    case "all":
      return <Globe className="w-4 h-4" />
    case "percentage":
      return <Users className="w-4 h-4" />
    case "custom":
      return <Smartphone className="w-4 h-4" />
    default:
      return <Globe className="w-4 h-4" />
  }
})

TargetingIcon.displayName = "TargetingIcon"

const getTargetingLabel = (targeting: string): string => {
  switch (targeting) {
    case "all":
      return "All Users"
    case "percentage":
      return "Percentage Rollout"
    case "custom":
      return "Custom Rules"
    default:
      return "All Users"
  }
}

const FlagCard = memo(({ 
  flag, 
  onToggle, 
  onEvaluationChange 
}: { 
  flag: FeatureFlag
  onToggle: (id: string) => void
  onEvaluationChange: (count: number) => void
}) => {
  const handleToggle = useCallback(() => {
    onToggle(flag.id)
    // Simulate evaluation increase
    setTimeout(() => {
      onEvaluationChange(Math.floor(Math.random() * 100) + 50)
    }, 1000)
  }, [flag.id, onToggle, onEvaluationChange])

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch checked={flag.enabled} onCheckedChange={handleToggle} />
            <div>
              <CardTitle className="text-lg">{flag.name}</CardTitle>
              <CardDescription className="font-mono text-sm">{flag.key}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={flag.enabled ? "default" : "secondary"}>
              {flag.enabled ? "Enabled" : "Disabled"}
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TargetingIcon targeting={flag.targeting} />
              <span>Targeting</span>
            </div>
            <p className="text-sm font-medium">{getTargetingLabel(flag.targeting)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
            <Badge variant="outline" className="text-xs">
              {flag.type}
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Evaluations</p>
            <p className="text-sm font-medium">{flag.evaluations.toLocaleString()}</p>
          </div>
        </div>

        {flag.variations.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Variations</p>
            <div className="flex flex-wrap gap-2">
              {flag.variations.map((variation, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <Badge variant="outline">
                    {variation.name}: {String(variation.value)}
                  </Badge>
                  {variation.percentage && (
                    <span className="text-gray-500">({variation.percentage}%)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

FlagCard.displayName = "FlagCard"

export function FeatureFlagControls({ onFlagChange, onEvaluationChange }: FeatureFlagControlsProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS)
  const [newFlagName, setNewFlagName] = useState("")
  const [newFlagKey, setNewFlagKey] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleToggleFlag = useCallback((id: string) => {
    setFlags((prev) =>
      prev.map((flag) => {
        if (flag.id === id) {
          return { ...flag, enabled: !flag.enabled }
        }
        return flag
      }),
    )
  }, [])

  const handleCreateFlag = useCallback(async () => {
    if (!newFlagName.trim() || !newFlagKey.trim()) return

    setIsCreating(true)
    
    try {
      const newFlag: FeatureFlag = {
        id: Date.now().toString(),
        name: newFlagName.trim(),
        key: newFlagKey.trim(),
        enabled: false,
        type: "boolean",
        targeting: "all",
        evaluations: 0,
        variations: [
          { name: "Enabled", value: true },
          { name: "Disabled", value: false },
        ],
      }

      setFlags((prev) => [...prev, newFlag])
      onFlagChange(flags.length + 1)
      setNewFlagName("")
      setNewFlagKey("")
      setShowCreateDialog(false)
    } catch (error) {
      console.error("Failed to create flag:", error)
      // In a real app, you'd show a toast notification here
    } finally {
      setIsCreating(false)
    }
  }, [newFlagName, newFlagKey, flags.length, onFlagChange])

  const handleDialogChange = useCallback((open: boolean) => {
    setShowCreateDialog(open)
    if (!open) {
      setNewFlagName("")
      setNewFlagKey("")
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Feature Flags</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage and test your feature flags</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Flag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Feature Flag</DialogTitle>
              <DialogDescription>
                Add a new feature flag to test and control feature rollouts.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="flag-name">Flag Name</Label>
                <Input
                  id="flag-name"
                  placeholder="e.g., New Dashboard Layout"
                  value={newFlagName}
                  onChange={(e) => setNewFlagName(e.target.value)}
                  disabled={isCreating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flag-key">Flag Key</Label>
                <Input
                  id="flag-key"
                  placeholder="e.g., new-dashboard-layout"
                  value={newFlagKey}
                  onChange={(e) => setNewFlagKey(e.target.value)}
                  disabled={isCreating}
                />
              </div>
              <Button 
                onClick={handleCreateFlag} 
                className="w-full"
                disabled={isCreating || !newFlagName.trim() || !newFlagKey.trim()}
              >
                {isCreating ? "Creating..." : "Create Flag"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {flags.map((flag) => (
          <FlagCard
            key={flag.id}
            flag={flag}
            onToggle={handleToggleFlag}
            onEvaluationChange={onEvaluationChange}
          />
        ))}
      </div>
    </div>
  )
}
