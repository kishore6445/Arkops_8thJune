"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Target, ChevronDown, ChevronUp } from "lucide-react"
import { AnimatedNumber } from "@/components/animated-number"
import { cn } from "@/lib/utils"
import type { VictoryTarget } from "@/components/department-page"
import { getBPRStatus, getProgressPercentage } from "@/lib/bpr-status"
import { QuarterSelector, type QuarterOption } from "@/components/quarter-selector"
import { getCurrentQuarter } from "@/lib/brand-structure"

interface VictoryTargetsScorecardProps {
  victoryTargets: VictoryTarget[]
  departmentName?: string
  wig?: string
  className?: string
  onAddTarget?: () => void
  selectedQuarter?: QuarterOption
  onQuarterChange?: (quarter: QuarterOption) => void
}

export function VictoryTargetsScoreboard({
  victoryTargets,
  departmentName,
  wig,
  className,
  onAddTarget,
  selectedQuarter: externalQuarter,
  onQuarterChange: externalOnQuarterChange,
}: VictoryTargetsScorecardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [internalQuarter, setInternalQuarter] = useState<QuarterOption>(getCurrentQuarter())

  const selectedQuarter = externalQuarter ?? internalQuarter
  const handleQuarterChange = externalOnQuarterChange ?? setInternalQuarter

  const getQuarterlyData = (vt: VictoryTarget) => {
    if (selectedQuarter === "annual") {
      return { target: vt.target ?? 1, achieved: vt.achieved ?? 0 }
    }
    const quarterData = (vt as any).quarters?.find((q: any) => q.quarter === selectedQuarter)
    if (quarterData) {
      return { target: quarterData.target, achieved: quarterData.achieved }
    }
    // Fallback: divide annual by 4
    return { target: Math.ceil((vt.target ?? 1) / 4), achieved: Math.ceil((vt.achieved ?? 0) / 4) }
  }

  const greenCount = victoryTargets.filter((vt) => {
    const { target, achieved } = getQuarterlyData(vt)
    const progress = getProgressPercentage(achieved, target)
    return progress >= 70
  }).length

  const overallStatus = getBPRStatus(greenCount, victoryTargets.length)

  const displayTargets = victoryTargets.slice(0, 2)

  const getQuarterLabel = () => {
    if (selectedQuarter === "annual") return "Full Year"
    return selectedQuarter
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* SECTION HEADER - Clear hierarchy with description */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-stone-600" />
          <h2 className="text-lg font-bold text-stone-900">Department Victory Targets</h2>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-stone-100 text-stone-600">
            {greenCount}/{victoryTargets.length} On Track
          </span>
        </div>
        <p className="text-sm text-stone-500 ml-7">Lag measures that define quarterly success (4DX)</p>
      </div>

      {/* VICTORY TARGETS GRID - Cards with clear status and progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {victoryTargets.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-lg border">
            <Target className="h-12 w-12 mx-auto text-stone-300 mb-4" />
            <p className="text-base font-medium text-stone-500">No Victory Targets Yet</p>
            <p className="text-sm text-stone-400 mt-1">Add up to 2 lag measures (4DX limit)</p>
          </div>
        ) : (
          victoryTargets.map((vt) => {
            const { target, achieved } = getQuarterlyData(vt)
            const status = getBPRStatus(achieved, target)
            const progress = getProgressPercentage(achieved, target)

            const statusConfig = {
              green: { bg: 'bg-emerald-50', border: 'border-l-emerald-500', badge: 'On Track', badgeBg: 'bg-emerald-100 text-emerald-700' },
              yellow: { bg: 'bg-amber-50', border: 'border-l-amber-500', badge: 'At Risk', badgeBg: 'bg-amber-100 text-amber-700' },
              red: { bg: 'bg-rose-50', border: 'border-l-rose-500', badge: 'Behind', badgeBg: 'bg-rose-100 text-rose-700' },
            }

            const config = statusConfig[status]

            return (
              <Card
                key={vt.id}
                className={cn('border-l-4 overflow-hidden', config.bg, config.border)}
              >
                <div className="p-5 space-y-4">
                  {/* Header: Title + Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-stone-900">
                        {(vt as any).title || (vt as any).name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">{vt.owner}</p>
                    </div>
                    <span className={cn('text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap', config.badgeBg)}>
                      {config.badge}
                    </span>
                  </div>

                  {/* Metric: Achieved / Target */}
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-bold text-stone-900 tabular-nums">
                        <AnimatedNumber value={achieved} />
                      </span>
                      <span className="text-lg text-stone-400">/</span>
                      <span className="text-lg text-stone-500 font-medium tabular-nums">{target}</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {selectedQuarter === "annual" ? "Annual Target" : `${selectedQuarter} Target`}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          status === "green" && "bg-emerald-500",
                          status === "yellow" && "bg-amber-400",
                          status === "red" && "bg-rose-400",
                        )}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-stone-500 text-right">{progress}% Complete</p>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
