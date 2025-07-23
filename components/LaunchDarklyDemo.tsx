"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk"
import { User, Flag, Zap, Eye } from "lucide-react"

export function LaunchDarklyDemo() {
  const flags = useFlags()
  const ldClient = useLDClient()
  const [userKey, setUserKey] = useState("anonymous-user")
  const [userName, setUserName] = useState("Anonymous User")
  const [userEmail, setUserEmail] = useState("")

  const handleIdentifyUser = () => {
    if (ldClient) {
      ldClient.identify({
        kind: "user",
        key: userKey,
        name: userName,
        email: userEmail || undefined
      })
      ldClient.track("user_identified", { userKey, userName })
    }
  }

  const handleTrackEvent = (eventName: string) => {
    if (ldClient) {
      ldClient.track(eventName, { timestamp: new Date().toISOString() })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">LaunchDarkly Demo</h2>
        <p className="text-gray-600 dark:text-gray-400">Real feature flags powered by LaunchDarkly</p>
      </div>

      {/* User Identification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Identification
          </CardTitle>
          <CardDescription>
            Identify users to see different flag variations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-key">User Key</Label>
              <Input
                id="user-key"
                value={userKey}
                onChange={(e) => setUserKey(e.target.value)}
                placeholder="user-123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
          </div>
          <Button onClick={handleIdentifyUser} className="w-full">
            Identify User
          </Button>
        </CardContent>
      </Card>

      {/* Feature Flags Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Active Feature Flags
          </CardTitle>
          <CardDescription>
            Current flag values for the identified user
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(flags).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Flag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No feature flags found</p>
              <p className="text-sm">Create flags in your LaunchDarkly dashboard</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(flags).map(([flagKey, flagValue]) => (
                <div key={flagKey} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={flagValue ? "default" : "secondary"}>
                      {flagValue ? "ON" : "OFF"}
                    </Badge>
                    <div>
                      <p className="font-medium">{flagKey}</p>
                      <p className="text-sm text-gray-500">
                        Value: {typeof flagValue === "object" ? JSON.stringify(flagValue) : String(flagValue)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTrackEvent(`flag_viewed_${flagKey}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Event Tracking
          </CardTitle>
          <CardDescription>
            Track custom events to measure feature flag impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => handleTrackEvent("button_clicked")}
              className="h-20 flex flex-col gap-2"
            >
              <Zap className="w-5 h-5" />
              <span className="text-sm">Button Click</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTrackEvent("page_viewed")}
              className="h-20 flex flex-col gap-2"
            >
              <Eye className="w-5 h-5" />
              <span className="text-sm">Page View</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTrackEvent("feature_used")}
              className="h-20 flex flex-col gap-2"
            >
              <Flag className="w-5 h-5" />
              <span className="text-sm">Feature Used</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTrackEvent("conversion")}
              className="h-20 flex flex-col gap-2"
            >
              <User className="w-5 h-5" />
              <span className="text-sm">Conversion</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 