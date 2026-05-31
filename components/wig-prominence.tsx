"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedProgress } from "@/components/animated-progress"
import { AnimatedNumber } from "@/components/animated-number"
import { Target, Calendar, TrendingUp } from "lucide-react"

interface WIGProminenceProps {
  wig: string
  totalProgress: number
  deadline: Date
  departmentName: string
  status: "on-track" | "at-risk"
}

export function WIGProminence({ wig, totalProgress, deadline, departmentName, status }: WIGProminenceProps) {
  const [daysRemaining, setDaysRemaining] = useState(0)

  useEffect(() => {
    const today = new Date()
    const timeDiff = deadline.getTime() - today.getTime()
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24))
    setDaysRemaining(days)
  }, [deadline])

  const isUrgent = daysRemaining <= 30

  return (
    <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50/30 mb-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32" />

      <div className="relative p-8">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 rounded-2xl bg-blue-600/10 shrink-0">
              <Target className="h-8 w-8 text-blue-600" strokeWidth={2} />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-blue-900 uppercase tracking-wider">
                  {departmentName} Wildly Important Goal
                </h2>
                <Badge variant={status === "on-track" ? "default" : "destructive"} className="text-xs">
                  {status === "on-track" ? "On Track" : "At Risk"}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-tight">{wig}</p>
            </div>
          </div>

          <div
            className={`text-center p-4 rounded-xl ${isUrgent ? "bg-red-100 border-2 border-red-300" : "bg-blue-100 border-2 border-blue-300"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className={`h-4 w-4 ${isUrgent ? "text-red-600" : "text-blue-600"}`} />
              <span className={`text-xs font-medium ${isUrgent ? "text-red-900" : "text-blue-900"}`}>
                {isUrgent ? "URGENT" : "DEADLINE"}
              </span>
            </div>
            <div className={`text-4xl font-bold tabular-nums ${isUrgent ? "text-red-600" : "text-blue-600"}`}>
              <AnimatedNumber value={daysRemaining} />
            </div>
            <p className={`text-xs ${isUrgent ? "text-red-700" : "text-blue-700"} mt-1`}>days remaining</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Overall WIG Progress</span>
            </div>
            <span className="text-3xl font-bold text-blue-600 tabular-nums">
              <AnimatedNumber value={totalProgress} />%
            </span>
          </div>
          <AnimatedProgress value={totalProgress} className="h-4" />
        </div>
      </div>
    </Card>
  )
}
