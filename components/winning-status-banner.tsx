"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, TrendingUp, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Department {
  name: string
  progress: number
  atRisk: boolean
}

interface WinningStatusBannerProps {
  departments: Department[]
  overallProgress: number
  wigDeadline: Date
}

export function WinningStatusBanner({ departments, overallProgress, wigDeadline }: WinningStatusBannerProps) {
  const atRiskCount = departments.filter((d) => d.atRisk).length
  const onTrackCount = departments.length - atRiskCount
  const isWinning = overallProgress >= 50 && atRiskCount <= 2
  const daysUntilDeadline = Math.ceil((wigDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <Card
      className={cn(
        "border-2 transition-all duration-500",
        isWinning
          ? "bg-gradient-to-r from-green-500/10 via-green-400/5 to-green-500/10 border-green-500/30 shadow-lg shadow-green-500/20"
          : "bg-gradient-to-r from-amber-500/10 via-red-400/5 to-red-500/10 border-red-500/30 shadow-lg shadow-red-500/20 animate-pulse",
      )}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Status Message */}
          <div className="flex items-center gap-3 flex-1 min-w-[250px]">
            {isWinning ? (
              <div className="p-3 rounded-full bg-green-500/20">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            ) : (
              <div className="p-3 rounded-full bg-red-500/20">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 animate-pulse" />
              </div>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                {isWinning ? (
                  <span className="text-green-700">YOU'RE WINNING!</span>
                ) : (
                  <span className="text-red-700">URGENT ACTION NEEDED</span>
                )}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                {isWinning
                  ? `Company WIG at ${overallProgress}% completion. Keep up the momentum!`
                  : `${atRiskCount} department${atRiskCount > 1 ? "s" : ""} need immediate attention.`}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex gap-3 sm:gap-4 flex-wrap">
            <div className="flex flex-col items-center p-3 bg-background/60 rounded-lg min-w-[80px]">
              <div className="flex items-center gap-1 text-green-600 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-2xl font-bold tabular-nums">{onTrackCount}</span>
              </div>
              <span className="text-xs text-muted-foreground">On Track</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-background/60 rounded-lg min-w-[80px]">
              <div className="flex items-center gap-1 text-red-600 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-2xl font-bold tabular-nums">{atRiskCount}</span>
              </div>
              <span className="text-xs text-muted-foreground">At Risk</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-background/60 rounded-lg min-w-[80px]">
              <div className="flex items-center gap-1 text-primary mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-2xl font-bold tabular-nums">{overallProgress}%</span>
              </div>
              <span className="text-xs text-muted-foreground">Progress</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-background/60 rounded-lg min-w-[80px]">
              <div className="flex items-center gap-1 text-amber-600 mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-2xl font-bold tabular-nums">{daysUntilDeadline}</span>
              </div>
              <span className="text-xs text-muted-foreground">Days Left</span>
            </div>
          </div>
        </div>

        {/* At Risk Departments List */}
        {atRiskCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-semibold mb-2">Departments needing attention:</p>
            <div className="flex gap-2 flex-wrap">
              {departments
                .filter((d) => d.atRisk)
                .map((dept) => (
                  <Badge key={dept.name} variant="destructive" className="text-xs">
                    {dept.name} ({dept.progress}%)
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
