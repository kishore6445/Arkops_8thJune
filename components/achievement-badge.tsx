import type React from "react"
import { Award, Flame, Star, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface Achievement {
  id: string
  type: "perfect-week" | "streak-4" | "milestone" | "custom"
  title: string
  description: string
  earnedDate: string
  icon?: React.ReactNode
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: "sm" | "md" | "lg"
}

export function AchievementBadge({ achievement, size = "md" }: AchievementBadgeProps) {
  const getIcon = () => {
    switch (achievement.type) {
      case "perfect-week":
        return <Star className="h-5 w-5" />
      case "streak-4":
        return <Flame className="h-5 w-5" />
      case "milestone":
        return <Trophy className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  const getColor = () => {
    switch (achievement.type) {
      case "perfect-week":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "streak-4":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "milestone":
        return "bg-purple-100 text-purple-800 border-purple-300"
      default:
        return "bg-blue-100 text-blue-800 border-blue-300"
    }
  }

  if (size === "sm") {
    return (
      <Badge className={`gap-1 ${getColor()}`} aria-label={achievement.title}>
        {getIcon()}
        <span className="text-xs">{achievement.title}</span>
      </Badge>
    )
  }

  return (
    <Card className={`border-2 ${getColor()} hover:shadow-md transition-shadow`}>
      <CardContent className="pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${getColor()}`}>{getIcon()}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{achievement.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
            <p className="text-xs text-muted-foreground mt-1">Earned {achievement.earnedDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
