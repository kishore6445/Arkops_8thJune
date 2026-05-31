"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react"
import { AnimatedProgress } from "@/components/animated-progress"
import type { PowerMove, VictoryTarget } from "@/components/department-page"

interface LeadMeasureIntelligenceProps {
  powerMoves: PowerMove[]
  victoryTargets: VictoryTarget[]
}

export function LeadMeasureIntelligence({ powerMoves, victoryTargets }: LeadMeasureIntelligenceProps) {
  const correlationData = powerMoves.map((pm) => {
    const linkedTarget = victoryTargets.find((vt) => vt.name === pm.linkedVictoryTarget)
    const completionRate = Math.round(((pm.weeklyActual || 0) / (pm.weeklyTarget || 1)) * 100)
    const targetProgress = linkedTarget
      ? Math.round(((linkedTarget.achieved ?? 0) / (linkedTarget.target ?? 1)) * 100)
      : 0

    const correlationStrength =
      Math.abs(completionRate - targetProgress) < 20
        ? "high"
        : Math.abs(completionRate - targetProgress) < 40
          ? "medium"
          : "low"

    const impact =
      completionRate >= 100 && targetProgress >= 70
        ? "positive"
        : completionRate < 70 && targetProgress < 70
          ? "negative"
          : "neutral"

    return {
      powerMove: pm.name,
      linkedTarget: pm.linkedVictoryTarget,
      completionRate,
      targetProgress,
      correlationStrength,
      impact,
      weeklyActual: pm.weeklyActual || 0,
      weeklyTarget: pm.weeklyTarget || 0,
    }
  })

  const atRiskMoves = correlationData.filter((c) => c.completionRate < 70)

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Power Move → Victory Target Correlation
          </CardTitle>
          <CardDescription>Historical analysis showing which activities drive your targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {correlationData.map((data, idx) => (
              <div key={idx} className="space-y-3 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-base">{data.powerMove}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Drives: <span className="font-medium text-foreground">{data.linkedTarget}</span>
                    </p>
                  </div>
                  <Badge
                    variant={
                      data.correlationStrength === "high"
                        ? "default"
                        : data.correlationStrength === "medium"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      data.correlationStrength === "high"
                        ? "bg-green-100 text-green-800"
                        : data.correlationStrength === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                    }
                  >
                    {data.correlationStrength.toUpperCase()} IMPACT
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Power Move Completion</p>
                    <div className="flex items-center gap-2">
                      <AnimatedProgress value={data.completionRate} className="h-2 flex-1" />
                      <span className="text-sm font-bold tabular-nums w-12">{data.completionRate}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Victory Target Progress</p>
                    <div className="flex items-center gap-2">
                      <AnimatedProgress value={data.targetProgress} className="h-2 flex-1" />
                      <span className="text-sm font-bold tabular-nums w-12">{data.targetProgress}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {data.impact === "positive" ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-700">
                        When you complete {data.weeklyTarget} weekly, target improves by ~
                        {Math.round(data.targetProgress / 10)}%
                      </span>
                    </>
                  ) : data.impact === "negative" ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-red-700">
                        Low completion ({data.completionRate}%) correlates with target lag
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Monitoring correlation pattern...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {atRiskMoves.length > 0 && (
        <Card className="shadow-lg border-2 border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-red-900">
              <AlertTriangle className="h-6 w-6" />
              Special Attention Required
            </CardTitle>
            <CardDescription>Power Moves that need immediate focus (Mulally BPR Protocol)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atRiskMoves.map((move, idx) => (
                <div key={idx} className="p-4 rounded-lg border-2 border-red-300 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base">{move.powerMove}</h4>
                    <Badge variant="destructive">{move.completionRate}% COMPLETE</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[120px]">Who's Helping:</span>
                      <span className="text-muted-foreground">Assign team member or cross-functional support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[120px]">What's the Plan:</span>
                      <span className="text-muted-foreground">Define specific action items to get back on track</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[120px]">When Resolved:</span>
                      <span className="text-muted-foreground">Target date for returning to green status</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
