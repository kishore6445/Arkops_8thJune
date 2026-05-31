"use client"

import { useState } from "react"
import type { PowerMove, VictoryTarget } from "@/components/department-page"
import { TimePeriodSelector } from "@/components/time-period-selector"
import { ExecutionStreak } from "@/components/execution-streak"
import { Button } from "@/components/ui/button"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface WeeklyPowerMoveScoreProps {
  powerMoves: PowerMove[]
  victoryTargets?: VictoryTarget[]
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  currentWeekStart: Date
  onNavigate: (direction: "prev" | "next") => void
}

export function WeeklyPowerMoveScore({
  powerMoves,
  victoryTargets = [],
  selectedPeriod,
  onPeriodChange,
  currentWeekStart,
  onNavigate,
}: WeeklyPowerMoveScoreProps) {
  const [showStreak, setShowStreak] = useState(false)

  const completedThisWeek = powerMoves.reduce((sum, pm) => sum + Math.min(pm.progress, pm.targetPerCycle), 0)
  const totalPowerMoves = powerMoves.reduce((sum, pm) => sum + pm.targetPerCycle, 0)
  const weeklyPercentage = totalPowerMoves > 0 ? Math.round((completedThisWeek / totalPowerMoves) * 100) : 0

  // Mock streak data
  const currentStreak = weeklyPercentage >= 70 ? 4 : 0
  const bestStreak = 6
  const weeklyHistory = [45, 52, 68, 72, 78, 85, 72, weeklyPercentage]

  const getExecutionStatus = (): {
    sentence: string
    status: "below" | "partial" | "standard" | "neutral"
  } => {
    if (totalPowerMoves === 0) {
      return { sentence: "No Power Moves defined.", status: "neutral" }
    } else if (weeklyPercentage < 50) {
      return { sentence: "Execution is below standard.", status: "below" }
    } else if (weeklyPercentage < 70) {
      return { sentence: "Execution is inconsistent.", status: "partial" }
    } else {
      return { sentence: "Execution is holding the standard.", status: "standard" }
    }
  }

  const { sentence, status } = getExecutionStatus()

  const getVerdictStyles = () => {
    switch (status) {
      case "below":
        return {
          bg: "bg-red-50",
          border: "border-l-4 border-red-400",
          text: "text-red-900",
        }
      case "partial":
        return {
          bg: "bg-amber-50",
          border: "border-l-4 border-amber-400",
          text: "text-amber-900",
        }
      case "standard":
        return {
          bg: "bg-emerald-50",
          border: "border-l-4 border-emerald-500",
          text: "text-emerald-900",
        }
      default:
        return {
          bg: "bg-stone-50",
          border: "border-l-4 border-stone-300",
          text: "text-stone-700",
        }
    }
  }

  const verdictStyles = getVerdictStyles()

  return (
    <div className="space-y-4">
      <p className="text-xs text-stone-400 uppercase tracking-widest text-center">
        Weekly execution against the company goal
      </p>

      <div className="flex items-center justify-between">
        <TimePeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
          currentWeekStart={currentWeekStart}
          onNavigate={onNavigate}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowStreak(!showStreak)}
          className="gap-2 text-stone-600 border-stone-300 hover:bg-stone-100"
        >
          <Flame className="h-4 w-4" />
          {currentStreak > 0 ? `${currentStreak} week streak` : "View streak"}
        </Button>
      </div>

      {showStreak && (
        <ExecutionStreak currentStreak={currentStreak} bestStreak={bestStreak} weeklyHistory={weeklyHistory} />
      )}

      <div className={cn("py-10 px-8 rounded-lg", verdictStyles.bg, verdictStyles.border)}>
        <h2 className={cn("text-2xl font-semibold text-center", verdictStyles.text)}>{sentence}</h2>

        {totalPowerMoves > 0 && (
          <p className="text-sm text-center mt-3 text-stone-500">
            {completedThisWeek} of {totalPowerMoves} cycles completed this week.
          </p>
        )}
      </div>
    </div>
  )
}
