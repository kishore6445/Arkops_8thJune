"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, CheckCircle2, Clock, ChevronDown, ChevronRight, TrendingUp } from "lucide-react"
import { useState } from "react"
import type { PowerMove } from "@/components/department-page"

interface TeamMember {
  name: string
  role: string
  commitments: Array<{
    id: string
    title: string
    status: "completed" | "in-progress" | "pending"
    dueDay: string
  }>
  weeklyScore?: number
}

interface TeamExecutionStatusProps {
  powerMoves: PowerMove[]
  teamMembers: TeamMember[]
  departmentName: string
}

interface MemberWithPowerMoves extends TeamMember {
  powerMoves: Array<{
    name: string
    target: number
    actual: number
    status: "green" | "yellow" | "red"
    linkedVictoryTarget?: string
  }>
}

export function TeamExecutionStatus({ powerMoves, teamMembers, departmentName }: TeamExecutionStatusProps) {
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set())

  const toggleExpanded = (memberName: string) => {
    setExpandedMembers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(memberName)) {
        newSet.delete(memberName)
      } else {
        newSet.add(memberName)
      }
      return newSet
    })
  }

  // Merge team members with their power moves
  const membersWithPowerMoves: MemberWithPowerMoves[] = teamMembers.map((member) => {
    const memberPowerMoves = powerMoves
      .filter((pm) => pm.owner === member.name)
      .map((pm) => {
        const target = pm.weeklyTarget || 0
        const actual = pm.weeklyActual || 0
        const completionRate = target > 0 ? Math.round((actual / target) * 100) : 0

        let status: "green" | "yellow" | "red" = "green"
        if (completionRate >= 100) status = "green"
        else if (completionRate >= 70) status = "yellow"
        else status = "red"

        return {
          name: pm.name,
          target,
          actual,
          status,
          linkedVictoryTarget: pm.linkedVictoryTarget,
        }
      })

    return {
      ...member,
      powerMoves: memberPowerMoves,
    }
  })

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <CardTitle>Team Execution Status</CardTitle>
        </div>
        <CardDescription>Combined view of activities (Power Moves) and commitments by team member</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {membersWithPowerMoves.map((member, idx) => {
          const isExpanded = expandedMembers.has(member.name)
          const completedCommitments = member.commitments.filter((c) => c.status === "completed").length
          const totalCommitments = member.commitments.length
          const commitmentRate = totalCommitments > 0 ? (completedCommitments / totalCommitments) * 100 : 0

          // Calculate overall Power Move completion
          const totalPowerMoveCompletion =
            member.powerMoves.length > 0
              ? member.powerMoves.reduce((sum, pm) => {
                  const rate = pm.target > 0 ? (pm.actual / pm.target) * 100 : 0
                  return sum + rate
                }, 0) / member.powerMoves.length
              : 0

          // Overall status
          const overallCompletion = (commitmentRate + totalPowerMoveCompletion) / 2
          let overallStatus: "green" | "yellow" | "red" = "green"
          if (overallCompletion >= 85) overallStatus = "green"
          else if (overallCompletion >= 60) overallStatus = "yellow"
          else overallStatus = "red"

          const statusColors = {
            green: "bg-green-500",
            yellow: "bg-yellow-500",
            red: "bg-red-500",
          }

          return (
            <div key={idx} className="border rounded-lg p-4 space-y-3 bg-white">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleExpanded(member.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleExpanded(member.name)
                  }
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-3 rounded-full ${statusColors[overallStatus]}`} />
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-muted-foreground">Power Moves</span>
                    </div>
                    <p className="font-bold text-blue-600">{member.powerMoves.length} active</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Commitments</p>
                    <p className="font-bold tabular-nums">
                      {completedCommitments}/{totalCommitments}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Weekly Score</p>
                    <div className="text-2xl font-bold text-blue-600">
                      {member.weeklyScore ? member.weeklyScore.toFixed(1) : "—"}
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>

              <Progress value={overallCompletion} className="h-2" />

              {isExpanded && (
                <div className="pt-3 border-t space-y-4">
                  {/* Power Moves Section */}
                  {member.powerMoves.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Power Moves (Lead Measures)
                      </p>
                      {member.powerMoves.map((pm, pmIdx) => {
                        const completionRate = pm.target > 0 ? Math.round((pm.actual / pm.target) * 100) : 0

                        return (
                          <div
                            key={pmIdx}
                            className="flex items-center justify-between text-sm py-2 px-3 bg-blue-50 rounded"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${statusColors[pm.status]}`} />
                                <span className="font-medium">{pm.name}</span>
                              </div>
                              {pm.linkedVictoryTarget && (
                                <p className="text-xs text-blue-600 ml-4">→ Drives: {pm.linkedVictoryTarget}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="tabular-nums font-medium">
                                {pm.actual}/{pm.target}
                              </span>
                              <Badge
                                variant={
                                  pm.status === "green"
                                    ? "default"
                                    : pm.status === "yellow"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {completionRate}%
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Commitments Section */}
                  {member.commitments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Weekly Commitments
                      </p>
                      {member.commitments.map((commitment) => (
                        <div
                          key={commitment.id}
                          className="flex items-center justify-between text-sm py-2 px-3 bg-purple-50 rounded"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {commitment.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                            ) : (
                              <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                            )}
                            <span className="text-gray-700 truncate">{commitment.title}</span>
                          </div>
                          <Badge
                            variant={commitment.status === "completed" ? "default" : "secondary"}
                            className="text-xs shrink-0 ml-2"
                          >
                            {commitment.dueDay}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
