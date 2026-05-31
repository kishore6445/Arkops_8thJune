"use client"

import { AlertCircle, CheckCircle2, Clock, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Commitment, VictoryTarget } from "@/components/department-page"

interface TodaysFocusProps {
  commitments: Commitment[]
  victoryTargets: VictoryTarget[]
}

export function TodaysFocus({ commitments, victoryTargets }: TodaysFocusProps) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
  const todaysCommitments = commitments.filter((c) => !c.completed && (c.dueDay === today || c.dueDay === "Today"))
  const atRiskTargets = victoryTargets.filter((vt) => {
    const progress = (vt.achieved / vt.target) * 100
    return progress < 50
  })

  if (todaysCommitments.length === 0 && atRiskTargets.length === 0) {
    return (
      <Card className="mb-6 border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-green-900 mb-1">All Systems Go!</h3>
            <p className="text-base text-green-700 font-medium">
              No overdue commitments. All Victory Targets on track. Keep up the momentum!
            </p>
          </div>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white font-bold"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Zap className="h-4 w-4 mr-2" />
            Execute
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="mb-6 border-2 border-red-500 bg-gradient-to-r from-red-50 to-orange-50 p-6 shadow-lg">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg animate-pulse">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-red-900">Action Required Today</h3>
            <p className="text-sm text-red-700 font-medium">
              {todaysCommitments.length} commitment(s) + {atRiskTargets.length} at-risk target(s)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {todaysCommitments.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <Clock className="h-5 w-5 text-red-600" />
              <h4 className="text-base font-bold text-red-900">Due Today ({todaysCommitments.length})</h4>
            </div>
            <ul className="space-y-2">
              {todaysCommitments.map((commitment) => (
                <li
                  key={commitment.id}
                  className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow"
                >
                  <div className="mt-1 h-3 w-3 rounded-full bg-red-600 flex-shrink-0 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900 mb-1">{commitment.title}</p>
                    <p className="text-sm text-gray-600">Owner: {commitment.owner}</p>
                  </div>
                  <Badge variant="destructive" className="text-xs font-bold flex-shrink-0">
                    {commitment.dueDay}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        {atRiskTargets.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h4 className="text-base font-bold text-red-900">At-Risk Victory Targets ({atRiskTargets.length})</h4>
            </div>
            <ul className="space-y-2">
              {atRiskTargets.map((target) => {
                const progress = Math.round((target.achieved / target.target) * 100)
                const gap = target.target - target.achieved
                return (
                  <li
                    key={target.id}
                    className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border-l-4 border-red-500 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 mb-1">{target.title}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          <span className="font-bold text-gray-900">{target.achieved}</span> / {target.target}
                        </span>
                        <span className="text-red-600 font-bold">Gap: {gap}</span>
                        <span className="text-gray-600">{progress}%</span>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-xs font-bold flex-shrink-0">
                      At Risk
                    </Badge>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}
