"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ChevronDown, ChevronRight } from "lucide-react"
import { AnimatedProgress } from "@/components/animated-progress"
import { useState } from "react"
import type { PowerMove } from "@/components/department-page"

interface TeamPowerMoveExecutionProps {
  powerMoves: PowerMove[]
  departmentName: string
}

interface PowerMoveTeamStatus {
  name: string
  teamTarget: number
  teamActual: number
  linkedVictoryTarget?: string
  individuals: {
    name: string
    target: number
    actual: number
    status: "green" | "yellow" | "red"
  }[]
  status: "green" | "yellow" | "red"
}

export function TeamPowerMoveExecution({ powerMoves, departmentName }: TeamPowerMoveExecutionProps) {
  const [expandedPowerMoves, setExpandedPowerMoves] = useState<Set<string>>(new Set())

  const toggleExpanded = (powerMoveName: string) => {
    setExpandedPowerMoves((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(powerMoveName)) {
        newSet.delete(powerMoveName)
      } else {
        newSet.add(powerMoveName)
      }
      return newSet
    })
  }

  const teamPowerMoveStatus: PowerMoveTeamStatus[] = powerMoves.reduce((acc, pm) => {
    const existing = acc.find((item) => item.name === pm.name)

    const target = pm.weeklyTarget || 0
    const actual = pm.weeklyActual || 0
    const completionRate = target > 0 ? Math.round((actual / target) * 100) : 0

    let status: "green" | "yellow" | "red" = "green"
    if (completionRate >= 100) status = "green"
    else if (completionRate >= 70) status = "yellow"
    else status = "red"

    if (existing) {
      existing.teamTarget += target
      existing.teamActual += actual
      existing.individuals.push({
        name: pm.owner,
        target,
        actual,
        status,
      })
    } else {
      acc.push({
        name: pm.name,
        teamTarget: target,
        teamActual: actual,
        linkedVictoryTarget: pm.linkedVictoryTarget,
        individuals: [
          {
            name: pm.owner,
            target,
            actual,
            status,
          },
        ],
        status: "green", // Will be calculated after all individuals are added
      })
    }

    return acc
  }, [] as PowerMoveTeamStatus[])

  // Calculate team status based on completion rate
  teamPowerMoveStatus.forEach((pm) => {
    const completionRate = pm.teamTarget > 0 ? Math.round((pm.teamActual / pm.teamTarget) * 100) : 0
    if (completionRate >= 100) pm.status = "green"
    else if (completionRate >= 70) pm.status = "yellow"
    else pm.status = "red"
  })

  if (teamPowerMoveStatus.length === 0) {
    return null
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <CardTitle>Team Power Move Execution</CardTitle>
        </div>
        <CardDescription>Aggregated lead measure completion across the team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {teamPowerMoveStatus.map((pm) => {
          const isExpanded = expandedPowerMoves.has(pm.name)
          const completionRate = pm.teamTarget > 0 ? Math.round((pm.teamActual / pm.teamTarget) * 100) : 0

          const statusColors = {
            green: "bg-green-500",
            yellow: "bg-yellow-500",
            red: "bg-red-500",
          }

          return (
            <div key={pm.name} className="border rounded-lg p-4 space-y-3">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded(pm.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleExpanded(pm.name)
                  }
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${statusColors[pm.status]}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{pm.name}</p>
                    {pm.linkedVictoryTarget && (
                      <p className="text-xs text-blue-600">→ Drives: {pm.linkedVictoryTarget}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Team Progress</p>
                    <p className="font-bold tabular-nums">
                      {pm.teamActual}/{pm.teamTarget}
                    </p>
                  </div>
                  <Badge
                    variant={pm.status === "green" ? "default" : pm.status === "yellow" ? "secondary" : "destructive"}
                  >
                    {completionRate}%
                  </Badge>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>

              <AnimatedProgress value={completionRate} className="h-2" />

              {isExpanded && (
                <div className="pt-3 border-t space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Individual Breakdown
                  </p>
                  {pm.individuals.map((individual, idx) => {
                    const indivCompletionRate =
                      individual.target > 0 ? Math.round((individual.actual / individual.target) * 100) : 0

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm py-2 px-3 bg-muted/30 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${statusColors[individual.status]}`} />
                          <span>{individual.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="tabular-nums font-medium">
                            {individual.actual}/{individual.target}
                          </span>
                          <span
                            className={`text-xs font-semibold tabular-nums ${
                              individual.status === "green"
                                ? "text-green-600"
                                : individual.status === "yellow"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {indivCompletionRate}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
