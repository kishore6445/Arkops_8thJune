"use client"

import { Flame, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExecutionStreakProps {
  currentStreak: number
  bestStreak: number
  weeklyHistory: number[] // Last 8 weeks percentages
  className?: string
}

export function ExecutionStreak({ currentStreak, bestStreak, weeklyHistory, className }: ExecutionStreakProps) {
  const hasStreak = currentStreak > 0
  const isNewBest = currentStreak >= bestStreak && currentStreak > 0

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between p-4 rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center",
              hasStreak ? "bg-amber-100 text-amber-600" : "bg-stone-100 text-stone-500",
            )}
          >
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Execution Streak</p>
            <p className="text-xl font-bold text-stone-900 tabular-nums">
              {currentStreak} {currentStreak === 1 ? "week" : "weeks"}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-stone-500">Personal Best</p>
          <div className="flex items-center gap-1">
            {isNewBest && <TrendingUp className="h-3 w-3 text-emerald-500" />}
            <p
              className={cn("text-base font-semibold tabular-nums", isNewBest ? "text-emerald-600" : "text-stone-700")}
            >
              {bestStreak} weeks
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-stone-50/50 rounded-lg border border-stone-100">
        <p className="text-xs font-medium text-stone-500 mb-2">Last 8 Weeks</p>
        <div className="flex items-end justify-between gap-1 h-12">
          {weeklyHistory.map((percentage, index) => {
            const height = Math.max(percentage, 8)
            const isCurrentWeek = index === weeklyHistory.length - 1
            const isGreen = percentage >= 70
            const isAmber = percentage >= 50 && percentage < 70

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className={cn(
                    "w-full rounded-sm transition-all",
                    isGreen ? "bg-emerald-400" : isAmber ? "bg-amber-400" : "bg-rose-300",
                    isCurrentWeek && "ring-1 ring-offset-1 ring-stone-400",
                  )}
                  style={{ height: `${height}%` }}
                  title={`Week ${index + 1}: ${percentage}%`}
                />
                <span className="text-[9px] text-stone-400 tabular-nums">{percentage}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
