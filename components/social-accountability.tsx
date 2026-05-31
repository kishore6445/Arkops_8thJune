"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface TeamMemberPerformance {
  id: string
  name: string
  role: string
  avatar?: string
  weeklyCompletion: number
  previousWeekCompletion: number
  trend: "up" | "down" | "same"
}

interface SocialAccountabilityProps {
  teamMembers: TeamMemberPerformance[]
  currentUserId?: string
}

export function SocialAccountability({ teamMembers, currentUserId }: SocialAccountabilityProps) {
  // Sort by completion rate descending
  const sortedMembers = [...teamMembers].sort((a, b) => b.weeklyCompletion - a.weeklyCompletion)
  const topPerformers = sortedMembers.slice(0, 5)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getTrendIcon = (trend: "up" | "down" | "same") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-emerald-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 70) return "bg-emerald-500"
    if (percentage >= 50) return "bg-amber-400"
    return "bg-red-400"
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="bg-muted/30 px-4 py-3 border-b">
        <h3 className="font-semibold text-sm">Top Executors This Week</h3>
        <p className="text-xs text-muted-foreground">Who's setting the pace</p>
      </div>

      <div className="divide-y">
        {topPerformers.map((member, index) => {
          const isCurrentUser = member.id === currentUserId
          const isTopThree = index < 3

          return (
            <div
              key={member.id}
              className={`flex items-center gap-3 p-3 transition-colors ${
                isCurrentUser ? "bg-primary/5" : "hover:bg-muted/30"
              }`}
            >
              {/* Rank */}
              <div className="w-6 text-center">
                {isTopThree ? (
                  <span className="text-lg font-black text-primary">{index + 1}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">{index + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              {/* Name and role */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {member.name}
                  {isCurrentUser && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      You
                    </Badge>
                  )}
                </p>
                <p className="text-xs text-muted-foreground truncate">{member.role}</p>
              </div>

              {/* Completion rate */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">{getTrendIcon(member.trend)}</div>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getStatusColor(member.weeklyCompletion)}`}
                >
                  {member.weeklyCompletion}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-muted/10 px-4 py-2 text-center">
        <p className="text-xs text-muted-foreground">Social accountability increases follow-through by 65%</p>
      </div>
    </div>
  )
}
