"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle2, AlertCircle, TrendingUp, Target } from "lucide-react"
import { getBPRStatusCircle } from "@/lib/bpr-status"

interface DailyReport {
  id: string
  user: {
    name: string
    initials: string
    department: string
    brand: string
  }
  date: string
  powerMoves: Array<{
    name: string
    completed: number
    target: number
  }>
  wins: string[]
  blockers: string[]
  learnings: string
  tomorrow: string[]
}

interface DailyReportCardProps {
  report: DailyReport
}

export function DailyReportCard({ report }: DailyReportCardProps) {
  const overallCompletion =
    report.powerMoves.reduce((acc, pm) => {
      return acc + pm.completed / pm.target
    }, 0) / report.powerMoves.length

  const percentage = Math.round(overallCompletion * 100)
  const statusCircle = getBPRStatusCircle(percentage)

  return (
    <Card className="p-6 border-2 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-600 text-white font-semibold">{report.user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{report.user.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{report.user.brand}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{report.user.department}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Overall Execution</div>
            <div className="text-2xl font-bold">{percentage}%</div>
          </div>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${
              statusCircle.bgColor
            }`}
          >
            {percentage}%
          </div>
        </div>
      </div>

      {/* Power Moves */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">POWER MOVES COMPLETED</h4>
        <div className="space-y-2">
          {report.powerMoves.map((pm, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span>{pm.name}</span>
              <span className="font-semibold">
                {pm.completed}/{pm.target}
                <span
                  className={`ml-2 ${
                    pm.completed >= pm.target
                      ? "text-emerald-600"
                      : pm.completed / pm.target >= 0.7
                        ? "text-amber-500"
                        : "text-red-500"
                  }`}
                >
                  ({Math.round((pm.completed / pm.target) * 100)}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Wins */}
        {report.wins.length > 0 && (
          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h4 className="text-sm font-semibold">Wins</h4>
            </div>
            <ul className="space-y-1">
              {report.wins.map((win, index) => (
                <li key={index} className="text-sm text-gray-700 pl-4">
                  • {win}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blockers */}
        {report.blockers.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <h4 className="text-sm font-semibold">Blockers</h4>
            </div>
            <ul className="space-y-1">
              {report.blockers.map((blocker, index) => (
                <li key={index} className="text-sm text-gray-700 pl-4">
                  • {blocker}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Learnings */}
      {report.learnings && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <h4 className="text-sm font-semibold">Key Learning</h4>
          </div>
          <p className="text-sm text-gray-700">{report.learnings}</p>
        </div>
      )}

      {/* Tomorrow */}
      {report.tomorrow.length > 0 && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-600" />
            <h4 className="text-sm font-semibold">Tomorrow's Priorities</h4>
          </div>
          <ul className="space-y-1">
            {report.tomorrow.map((item, index) => (
              <li key={index} className="text-sm text-gray-700 pl-4">
                {index + 1}. {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
