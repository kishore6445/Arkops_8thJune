"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBrand } from "@/lib/brand-context"

export function CompanyWIGBanner() {
  const { brandConfig, isReady } = useBrand()

  if (!isReady) {
    return (
      <Card
        className="border-l-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 shadow-2xl"
        aria-label="Loading company goal information"
        role="status"
      >
        <div className="p-8 animate-pulse">
          <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </div>
      </Card>
    )
  }

  const companyWIG = brandConfig?.companyWIG

  if (!companyWIG) {
    console.error("[v0] CompanyWIGBanner: No companyWIG found in brandConfig", brandConfig)
    return null
  }

  const progress = Math.round((companyWIG.yearAchieved / companyWIG.yearTarget) * 100)
  const gap = companyWIG.yearTarget - companyWIG.yearAchieved

  const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3) as 1 | 2 | 3 | 4
  const currentQuarterKey = `q${currentQuarter}` as keyof typeof companyWIG.quarters
  const currentQData = companyWIG.quarters[currentQuarterKey]

  const qProgress = Math.round((currentQData.achieved / currentQData.target) * 100)

  let status: "green" | "yellow" | "red" = "green"
  if (progress < 40 || qProgress < 40) status = "red"
  else if (progress < 70 || qProgress < 70) status = "yellow"

  const statusColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  }

  const statusText = {
    green: "On Track",
    yellow: "Needs Focus",
    red: "At Risk",
  }

  const getStatusBgClass = () => {
    if (status === "green") return "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
    if (status === "yellow") return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
    return "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
  }

  const getBorderColor = () => {
    if (status === "green") return "#86efac"
    if (status === "yellow") return "#fde047"
    return "#fca5a5"
  }

  return (
    <Card
      className={`shadow-2xl ring-2 ring-black/5 ${getStatusBgClass()}`}
      style={{ borderLeft: `12px solid ${getBorderColor()}` }}
      role="region"
      aria-label="Company Wildly Achievable Revenue Goal"
    >
      <div className="p-8">
        {/* Single row: Logo + Goal + Progress */}
        <div className="flex items-center justify-between gap-8">
          {/* Left: Brand Identity + Goal */}
          <div className="flex items-center gap-6 flex-1 min-w-0">
            <div className="text-6xl shrink-0" aria-hidden="true">
              {brandConfig.logo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-black text-foreground truncate tracking-tight">{brandConfig.name}</h2>
                <Badge
                  variant={status === "green" ? "default" : status === "yellow" ? "secondary" : "destructive"}
                  className="text-sm font-bold px-3 py-1 shrink-0"
                  aria-label={`Goal status: ${statusText[status]}`}
                >
                  {status === "green" ? "ON TRACK" : status === "yellow" ? "FOCUS" : "AT RISK"}
                </Badge>
              </div>
              <p className="text-base font-bold text-foreground truncate">
                <span className="text-primary">WAR GOAL:</span> {companyWIG.goal}
              </p>
            </div>
          </div>

          {/* Right: Compact Stats */}
          <div className="flex items-center gap-8 shrink-0">
            {/* Annual Progress */}
            <div className="text-center" role="group" aria-label="Annual progress">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tabular-nums" aria-label={`${companyWIG.yearAchieved} achieved`}>
                  {companyWIG.yearAchieved}
                </span>
                <span
                  className="text-lg text-muted-foreground font-semibold"
                  aria-label={`of ${companyWIG.yearTarget} target`}
                >
                  /{companyWIG.yearTarget}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-bold mt-1">2026 Goal</p>
              <span className="sr-only">{progress}% complete for the year</span>
            </div>

            {/* Current Quarter */}
            <div className="text-center" role="group" aria-label={`Quarter ${currentQuarter} progress`}>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tabular-nums" aria-label={`${currentQData.achieved} achieved`}>
                  {currentQData.achieved}
                </span>
                <span
                  className="text-lg text-muted-foreground font-semibold"
                  aria-label={`of ${currentQData.target} target`}
                >
                  /{currentQData.target}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-bold mt-1">Q{currentQuarter} Current</p>
              <span className="sr-only">
                {qProgress}% complete for quarter {currentQuarter}
              </span>
            </div>

            {/* Status Indicator */}
            <div
              className={`h-6 w-6 rounded-full ${statusColors[status]} shrink-0 ring-4 ring-white shadow-lg`}
              role="status"
              aria-label={`Overall status: ${statusText[status]}`}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
