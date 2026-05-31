"use client"

import { Card } from "@/components/ui/card"
import { useBrand } from "@/lib/brand-context"
import type { VictoryTarget, PowerMove } from "@/components/department-page"
import { calculateDepartmentScore } from "@/lib/score-calculations"
import { useMemo } from "react"

interface UnifiedStatusHeaderProps {
  departmentName: string
  victoryTargets: VictoryTarget[]
  powerMoves: PowerMove[]
  calculatedScore?: ReturnType<typeof calculateDepartmentScore>
}

export function UnifiedStatusHeader({
  departmentName,
  victoryTargets,
  powerMoves,
  calculatedScore,
}: UnifiedStatusHeaderProps) {
  const { brandConfig, isReady } = useBrand()

  const companyWIG = brandConfig?.companyWIG
  const score = useMemo(() => {
    if (calculatedScore) return calculatedScore
    return calculateDepartmentScore(victoryTargets, powerMoves)
  }, [calculatedScore, victoryTargets, powerMoves])

  const powerMoveStats = useMemo(() => {
    const completed = powerMoves.filter((pm) => pm.progress >= pm.targetPerCycle).length
    const total = powerMoves.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completed, total, percentage }
  }, [powerMoves])

  if (!isReady || !companyWIG || !score) {
    return (
      <Card className="shadow-sm">
        <div className="p-8 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-muted rounded w-3/4"></div>
        </div>
      </Card>
    )
  }

  const greenTargets = score.greenCount
  const totalTargets = score.totalTargets

  const getExecutionStatus = () => {
    if (powerMoveStats.total === 0) return "neutral"
    if (powerMoveStats.percentage >= 70) return "complete"
    if (powerMoveStats.percentage >= 30) return "partial"
    return "incomplete"
  }

  const executionStatus = getExecutionStatus()

  const statusStyles = {
    complete: {
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      ring: "ring-emerald-500",
      text: "text-emerald-700",
    },
    partial: {
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      ring: "ring-amber-500",
      text: "text-amber-700",
    },
    incomplete: {
      badge: "bg-rose-100 text-rose-800 border-rose-200",
      ring: "ring-rose-500",
      text: "text-rose-700",
    },
    neutral: {
      badge: "bg-stone-100 text-stone-800 border-stone-200",
      ring: "ring-stone-400",
      text: "text-stone-600",
    },
  }

  const currentStyle = statusStyles[executionStatus]

  return (
    <Card className="shadow-sm border border-stone-200 bg-white" role="region" aria-label="Department Context">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">Company Goal</p>
            <p className="text-sm text-stone-600 mb-4">{companyWIG.goal}</p>

            <h1 className="text-2xl font-semibold text-stone-900">{departmentName}</h1>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">Execution Score</p>
              <div className="flex items-baseline gap-2 justify-end">
                <span className={`text-4xl font-bold ${currentStyle.text}`}>{powerMoveStats.completed}</span>
                <span className="text-lg text-stone-400">of {powerMoveStats.total}</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">Power Moves Complete</p>
            </div>

            {powerMoveStats.total > 0 && (
              <span className={`text-xs px-3 py-1 rounded-full border ${currentStyle.badge}`}>
                {executionStatus === "complete" && "On Standard"}
                {executionStatus === "partial" && "Partial Execution"}
                {executionStatus === "incomplete" && "Below Standard"}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-8 text-sm text-stone-600">
          <div>
            <span className="text-stone-500">Victory Targets: </span>
            <span className="font-medium text-stone-700">
              {greenTargets} of {totalTargets} on track
            </span>
          </div>
          <div>
            <span className="text-stone-500">Power Moves: </span>
            <span className="font-medium text-stone-700">{powerMoves.length} active</span>
          </div>
          {powerMoveStats.total > 0 && (
            <div>
              <span className="text-stone-500">Completion: </span>
              <span className={`font-medium ${currentStyle.text}`}>{powerMoveStats.percentage}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
