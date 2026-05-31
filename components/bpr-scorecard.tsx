"use client"

import { Card } from "@/components/ui/card"
import { AnimatedNumber } from "@/components/animated-number"
import { cn } from "@/lib/utils"
import { getBPRStatusConfig, getProgressPercentage, getBPRStatus } from "@/lib/bpr-status"

export interface BPRMetric {
  label: string
  target: number
  actual: number
  unit?: string
  status: "green" | "yellow" | "red"
}

interface BPRScorecardProps {
  title: string
  metrics: BPRMetric[]
  className?: string
}

export function BPRScorecard({ title, metrics, className }: BPRScorecardProps) {
  const totalProgress = metrics.reduce((acc, m) => acc + getProgressPercentage(m.actual, m.target), 0) / metrics.length
  const overallStatus = getBPRStatus(totalProgress, 100)
  const overallStatusConfig = getBPRStatusConfig(overallStatus)

  return (
    <Card className={cn("border-2 shadow-lg", className)}>
      <div
        className={cn(
          "px-8 py-6 flex items-center justify-between border-b-4",
          overallStatus === "green" && "bg-green-50 border-green-600",
          overallStatus === "yellow" && "bg-yellow-50 border-yellow-500",
          overallStatus === "red" && "bg-red-50 border-red-600",
        )}
      >
        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Overall Status</p>
            <p className="text-6xl font-black tabular-nums">{Math.round(totalProgress)}%</p>
          </div>
          <div
            className={cn(
              "h-24 w-24 rounded-full flex items-center justify-center shadow-2xl ring-8 ring-white",
              overallStatus === "green" && "bg-gradient-to-br from-green-500 to-green-700",
              overallStatus === "yellow" && "bg-gradient-to-br from-yellow-400 to-yellow-600",
              overallStatus === "red" && "bg-gradient-to-br from-red-500 to-red-700",
            )}
            aria-label={`Overall status: ${overallStatusConfig.label}`}
          >
            <span className="text-white text-4xl font-black">{overallStatusConfig.label.charAt(0)}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {metrics.map((metric, index) => {
            const gap = metric.target - metric.actual
            const progress = getProgressPercentage(metric.actual, metric.target)
            const statusConfig = getBPRStatusConfig(metric.status)

            return (
              <div
                key={index}
                className={cn(
                  "relative flex items-center justify-between p-6 rounded-xl transition-all duration-300 hover:shadow-md",
                  statusConfig.bgClass,
                  metric.status === "red" && "animate-pulse",
                )}
                style={{ borderLeft: `12px solid ${statusConfig.borderColor}` }}
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground mb-2">{metric.label}</p>

                  <div className="flex items-center gap-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-7xl font-black tabular-nums tracking-tight">
                        <AnimatedNumber value={metric.actual} />
                      </span>
                      <span className="text-3xl font-bold text-muted-foreground">
                        /{metric.target}
                        {metric.unit}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "h-20 w-20 rounded-full flex items-center justify-center shadow-xl border-4 border-white",
                        metric.status === "green" && "bg-gradient-to-br from-green-500 to-green-700",
                        metric.status === "yellow" && "bg-gradient-to-br from-yellow-400 to-yellow-600",
                        metric.status === "red" && "bg-gradient-to-br from-red-500 to-red-700",
                      )}
                    >
                      <span className="text-white text-2xl font-black">{progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-4 border-t-2 border-border">
          <div className="flex items-center justify-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600" />
              <span>Green: On Track</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <span>Yellow: Caution</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600" />
              <span>Red: Needs Help</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
