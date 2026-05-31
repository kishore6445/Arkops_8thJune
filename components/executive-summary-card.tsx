"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react"
import type { VictoryTarget, PowerMove } from "@/components/department-page"

interface ExecutiveSummaryCardProps {
  departmentName: string
  victoryTargets: VictoryTarget[]
  powerMoves: PowerMove[]
  status: "on-track" | "at-risk"
}

export function ExecutiveSummaryCard({
  departmentName,
  victoryTargets,
  powerMoves,
  status,
}: ExecutiveSummaryCardProps) {
  const greenTargets = victoryTargets.filter((vt) => {
    const progress = ((vt.achieved ?? 0) / (vt.target ?? 1)) * 100
    return progress >= 70
  }).length

  const redTargets = victoryTargets.filter((vt) => {
    const progress = ((vt.achieved ?? 0) / (vt.target ?? 1)) * 100
    return progress < 50
  }).length

  const totalTargets = victoryTargets.length

  // Calculate Lead Measure completion rate
  const completedPowerMoves = powerMoves.filter((pm) => {
    const actual = pm.weeklyActual || 0
    const target = pm.weeklyTarget || 1
    return actual >= target
  }).length
  const leadMeasureCompletion = powerMoves.length > 0 ? Math.round((completedPowerMoves / powerMoves.length) * 100) : 0

  // Determine overall status
  const isOnTrack = greenTargets >= Math.ceil(totalTargets * 0.7) && redTargets === 0
  const borderColor = isOnTrack ? "#16a34a" : "#dc2626"
  const bgColor = isOnTrack ? "bg-green-50/30" : "bg-red-50/30"

  return (
    <Card className={`${bgColor} shadow-lg`} style={{ borderLeft: `6px solid ${borderColor}` }}>
      <CardContent className="py-4 px-6">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Department Status */}
          <div className="flex items-center gap-3">
            {isOnTrack ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <h3 className={`text-base font-bold ${isOnTrack ? "text-green-900" : "text-red-900"}`}>
                {isOnTrack ? "ON TRACK" : "ACTION NEEDED"}
              </h3>
            </div>
          </div>

          {/* Right: Compact Metrics */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold">
                {greenTargets}/{totalTargets}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Targets</div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold">{leadMeasureCompletion}%</span>
                {leadMeasureCompletion >= 80 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="text-xs text-muted-foreground font-medium">Execution</div>
            </div>

            <Badge
              variant={isOnTrack ? "default" : "destructive"}
              className={`h-7 px-3 text-xs font-bold ${isOnTrack ? "bg-green-600" : "bg-red-600"}`}
            >
              {isOnTrack ? "WINNING" : "AT RISK"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
