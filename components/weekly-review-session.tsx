"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2, Target, ListTodo, Plus } from "lucide-react"
import { CreateCommitmentModal } from "./create-commitment-modal"
import { CreateTaskModal } from "./create-task-modal"
import type { WeeklyReviewSessionProps } from "./weekly-review-session-props" // Declare the variable before using it

export function WeeklyReviewSession({ departmentName, powerMoves, tasks, commitments }: WeeklyReviewSessionProps) {
  const [currentWeek, setCurrentWeek] = useState(0) // 0 = this week, -1 = last week, 1 = next week
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCommitmentModal, setShowCommitmentModal] = useState(false)
  const [powerMoveProgress, setPowerMoveProgress] = useState<Record<string, number>>({})

  const getWeekDates = (offset: number) => {
    const today = new Date()
    const currentDay = today.getDay()
    const diff = currentDay === 0 ? -6 : 1 - currentDay // Adjust to Monday
    const monday = new Date(today)
    monday.setDate(today.getDate() + diff + offset * 7)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    return {
      start: monday.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      end: sunday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }
  }

  const thisWeek = getWeekDates(currentWeek)
  const lastWeek = getWeekDates(currentWeek - 1)

  const getBPRStatus = (progress: number): "green" | "yellow" | "red" => {
    if (progress >= 70) return "green"
    if (progress >= 50) return "yellow"
    return "red"
  }

  const getStatusColor = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green":
        return "bg-green-500"
      case "yellow":
        return "bg-yellow-500"
      case "red":
        return "bg-red-500"
    }
  }

  const handlePowerMoveComplete = (pmId: string, currentProgress: number, maxTarget: number) => {
    if (currentProgress < maxTarget) {
      setPowerMoveProgress({
        ...powerMoveProgress,
        [pmId]: (powerMoveProgress[pmId] || 0) + 1,
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Date Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Weekly Review Session</h1>
          <p className="text-muted-foreground mt-2">{departmentName} - Accountability & Planning</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(currentWeek - 1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center min-w-[200px]">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4" />
              Week of {thisWeek.start}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {thisWeek.start} - {thisWeek.end}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(currentWeek + 1)}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Power Moves Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
            Power Moves (Lead Measures)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Power Move</th>
                  <th className="text-left p-4 font-bold">Frequency</th>
                  <th className="text-center p-4 font-bold bg-muted/50">
                    Last Week
                    <div className="text-xs font-normal text-muted-foreground mt-1">
                      {lastWeek.start} - {lastWeek.end}
                    </div>
                  </th>
                  <th className="text-center p-4 font-bold bg-blue-50">
                    This Week
                    <div className="text-xs font-normal text-muted-foreground mt-1">
                      {thisWeek.start} - {thisWeek.end}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {powerMoves.map((pm) => {
                  const lastWeekProgress = pm.weeklyActual || 0
                  const lastWeekTarget = pm.weeklyTarget || pm.targetPerCycle
                  const lastWeekPercent = Math.round((lastWeekProgress / lastWeekTarget) * 100)
                  const lastWeekStatus = getBPRStatus(lastWeekPercent)

                  const thisWeekProgress = powerMoveProgress[pm.id] || 0
                  const thisWeekPercent = Math.round((thisWeekProgress / lastWeekTarget) * 100)
                  const thisWeekStatus = getBPRStatus(thisWeekPercent)

                  return (
                    <tr key={pm.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold">{pm.name}</div>
                        <div className="text-sm text-muted-foreground">{pm.owner}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{pm.frequency}</Badge>
                      </td>
                      <td className="p-4 text-center bg-muted/20">
                        <div className="flex items-center justify-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getStatusColor(lastWeekStatus)}`} />
                          <span className="font-bold text-lg">
                            {lastWeekProgress}/{lastWeekTarget}
                          </span>
                          <span className="text-sm text-muted-foreground">({lastWeekPercent}%)</span>
                        </div>
                      </td>
                      <td className="p-4 text-center bg-blue-50/50">
                        <div className="flex items-center justify-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getStatusColor(thisWeekStatus)}`} />
                          <span className="font-bold text-lg">
                            {thisWeekProgress}/{lastWeekTarget}
                          </span>
                          <span className="text-sm text-muted-foreground">({thisWeekPercent}%)</span>
                          <Button
                            size="lg"
                            onClick={() => handlePowerMoveComplete(pm.id, thisWeekProgress, lastWeekTarget)}
                            disabled={thisWeekProgress >= lastWeekTarget}
                            className={`ml-2 ${thisWeekProgress >= lastWeekTarget ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            {thisWeekProgress >= lastWeekTarget ? "Done" : "Complete"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Comparison Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-green-500" />
            Tasks (One-Time Actions)
          </CardTitle>
          <Button onClick={() => setShowTaskModal(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Task</th>
                  <th className="text-left p-4 font-bold">Owner</th>
                  <th className="text-center p-4 font-bold bg-muted/50">Last Week Status</th>
                  <th className="text-center p-4 font-bold bg-blue-50">This Week Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  return (
                    <tr key={task.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold">{task.task}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{task.owner}</span>
                      </td>
                      <td className="p-4 text-center bg-muted/20">
                        <Badge variant={task.status === "done" ? "default" : "secondary"}>
                          {task.status === "done" ? "Completed" : "Pending"}
                        </Badge>
                      </td>
                      <td className="p-4 text-center bg-blue-50/50">
                        <Badge variant="outline">Not Started</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Commitments Comparison Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Commitments (Team Promises)
          </CardTitle>
          <Button onClick={() => setShowCommitmentModal(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Commitment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-4 font-bold">Commitment</th>
                  <th className="text-left p-4 font-bold">Owner</th>
                  <th className="text-center p-4 font-bold bg-muted/50">Last Week</th>
                  <th className="text-center p-4 font-bold bg-blue-50">This Week</th>
                </tr>
              </thead>
              <tbody>
                {commitments.map((commitment) => {
                  return (
                    <tr key={commitment.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold">{commitment.title}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{commitment.owner}</span>
                      </td>
                      <td className="p-4 text-center bg-muted/20">
                        <Checkbox checked={commitment.completed} disabled />
                      </td>
                      <td className="p-4 text-center bg-blue-50/50">
                        <Checkbox checked={false} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" size="lg">
          Save Draft
        </Button>
        <Button size="lg" className="gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Complete Review
        </Button>
      </div>

      <CreateTaskModal open={showTaskModal} onOpenChange={setShowTaskModal} />
      <CreateCommitmentModal open={showCommitmentModal} onOpenChange={setShowCommitmentModal} />
    </div>
  )
}
