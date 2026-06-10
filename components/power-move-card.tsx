"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AnimatedProgress } from "@/components/animated-progress"
import { ChevronDown, Eye } from "lucide-react"
import { useState, Suspense } from "react"
import { useStreakTracker } from "@/lib/use-streak-tracker"
import { getDayStatusIcon, getStatusColor } from "@/lib/power-move-streak"

interface PowerMove {
  id: string
  name: string
  description: string
  frequency: string
  targetPerCycle: number
  progress: number
  owner: string
  department?: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
  linkedVictoryTarget?: string
  linkToTool?: string
}

interface PowerMoveCardProps {
  move: PowerMove
  onViewStreak?: (moveId: string) => void
  onMarkComplete?: (moveId: string) => void
}

const DEPARTMENT_COLORS: Record<string, { bg: string; text: string }> = {
  M: { bg: "bg-blue-100", text: "text-blue-700" },
  A: { bg: "bg-purple-100", text: "text-purple-700" },
  S: { bg: "bg-orange-100", text: "text-orange-700" },
  T: { bg: "bg-green-100", text: "text-green-700" },
  E: { bg: "bg-red-100", text: "text-red-700" },
  R: { bg: "bg-indigo-100", text: "text-indigo-700" },
  Y: { bg: "bg-amber-100", text: "text-amber-700" },
}

const DEPARTMENT_NAMES: Record<string, string> = {
  M: "Marketing",
  A: "Accounts",
  S: "Sales",
  T: "Team Tools",
  E: "Execution",
  R: "R&D",
  Y: "Leadership",
}

function StreakDisplay({ move, onViewStreak, onMarkComplete }: { move: PowerMove; onViewStreak?: (moveId: string) => void; onMarkComplete?: (moveId: string) => void }) {
  const { stats, isLoading } = useStreakTracker(move.id, move.targetPerCycle, move.frequency as any)

  if (isLoading || !stats) {
    return null
  }

  const missedDaysText = stats.missedDays?.join(", ") || "None"

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* This Week Progress */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">This Week</div>
          <div className="text-lg font-bold">{stats.thisWeek}/{move.targetPerCycle}</div>
          <div className="text-xs text-muted-foreground">completed</div>
        </div>

        {/* Current Streak */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Streak</div>
          <div className="text-lg font-bold">{stats.currentStreak}d <span className="text-lg">🔥</span></div>
        </div>

        {/* Best Streak */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Best Streak</div>
          <div className="text-lg font-bold">{stats.bestStreak}d <span className="text-lg">🏆</span></div>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</div>
          <Badge
            className={`text-xs font-semibold ${
              stats.status === "on-track"
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                : stats.status === "at-risk"
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                  : "bg-red-100 text-red-700 hover:bg-red-100"
            }`}
          >
            {stats.status === "on-track" && "On Track"}
            {stats.status === "at-risk" && "At Risk"}
            {stats.status === "missed" && "Missed"}
          </Badge>
        </div>
      </div>

      {/* Weekly Chain */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Weekly Chain (Mon-Fri)</div>
        <div className="flex items-center gap-2">
          {stats.weekDays.slice(0, 5).map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs font-semibold text-muted-foreground">{day.shortDay}</span>
              <span className="text-2xl">{getDayStatusIcon(day.status)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Missed Days */}
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Missed Days</div>
        <div className="text-sm font-semibold text-red-600">{missedDaysText}</div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => onViewStreak?.(move.id)}
          className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
        >
          <Eye className="h-3 w-3" />
          View Streak Details
        </button>
      </div>
    </div>
  )
}

export function PowerMoveCard({ move, onViewStreak, onMarkComplete }: PowerMoveCardProps) {
  const [expanded, setExpanded] = useState(false)
  const progressPercentage = (move.progress / move.targetPerCycle) * 100
  const deptCode = move.department || "M"
  const deptColors = DEPARTMENT_COLORS[deptCode]

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Department Avatar */}
              <Avatar className={`h-10 w-10 shrink-0 ${deptColors.bg}`}>
                <AvatarFallback className={`font-semibold ${deptColors.text}`}>{deptCode}</AvatarFallback>
              </Avatar>

              {/* Title and Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base leading-tight">{move.name}</h3>
                  <Badge variant="outline" className="text-xs px-2 py-0 bg-blue-50 text-blue-700 border-blue-200">
                    Primary
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{move.frequency} • {move.targetPerCycle} times per week • Owner: {move.owner}</p>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onViewStreak?.(move.id)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                View Streak
              </button>
              <button
                onClick={() => onMarkComplete?.(move.id)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded transition-colors whitespace-nowrap"
              >
                Mark Today Complete
              </button>
              <button
                onClick={() => setExpanded(!expanded)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">This Week Progress</span>
              <span className="text-sm font-bold">{move.progress}/{move.targetPerCycle} • {Math.round(progressPercentage)}%</span>
            </div>
            <AnimatedProgress value={progressPercentage} className="h-2 bg-gray-100" />
          </div>

          {/* Expanded Streak Details */}
          {expanded && (
            <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded" />}>
              <div className="pt-4 border-t">
                <StreakDisplay move={move} onViewStreak={onViewStreak} onMarkComplete={onMarkComplete} />
              </div>
            </Suspense>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
