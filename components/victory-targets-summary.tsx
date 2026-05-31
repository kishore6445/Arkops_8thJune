"use client"

import { useMemo } from "react"
import { Target } from "lucide-react"
import { getBPRStatus, getBPRColor } from "@/lib/bpr-status"

interface VictoryTarget {
  id: string
  name: string
  current: number
  target: number
  linkedPowerMoves?: string[]
}

interface VictoryTargetsSummaryProps {
  targets: VictoryTarget[]
  onExpand?: () => void
}

export function VictoryTargetsSummary({ targets, onExpand }: VictoryTargetsSummaryProps) {
  const summary = useMemo(() => {
    const total = targets.length
    const onTrack = targets.filter((t) => {
      const progress = (t.current / t.target) * 100
      return progress >= 70
    }).length
    const needsAttention = targets.filter((t) => {
      const progress = (t.current / t.target) * 100
      return progress < 70
    }).length

    const overallProgress = targets.reduce((sum, t) => sum + (t.current / t.target) * 100, 0) / total
    const status = getBPRStatus(overallProgress)
    const color = getBPRColor(status)

    return { total, onTrack, needsAttention, overallProgress, status, color }
  }, [targets])

  return (
    <div className="bg-white rounded-lg border-l-4" style={{ borderColor: summary.color }}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5" />
            <h3 className="font-bold text-base">VICTORY TARGETS</h3>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium">{summary.onTrack} On Track</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium">{summary.needsAttention} Need Attention</span>
            </div>

            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: summary.color }}
            >
              {Math.round(summary.overallProgress)}%
            </div>

            {summary.onExpand && (
              <button onClick={summary.onExpand} className="text-sm text-primary hover:underline">
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
