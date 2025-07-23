import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flag } from "lucide-react"

interface AppHeaderProps {
  onHelpClick: () => void
}

export function AppHeader({ onHelpClick }: AppHeaderProps) {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Flag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                LaunchDarkly Showcase
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Feature Flag Demo & Testing Environment
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Connected
            </Badge>
            <Button variant="outline" onClick={onHelpClick}>
              Help
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 