"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, CheckCircle2, Clock } from "lucide-react"

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

interface TeamAccountabilityViewProps {
  teamMembers: TeamMember[]
}

export function TeamAccountabilityView({ teamMembers }: TeamAccountabilityViewProps) {
  return (
    <Card className="border-2 border-purple-200 bg-purple-50/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          <CardTitle>Team Accountability</CardTitle>
        </div>
        <CardDescription>Track commitment progress across the entire team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {teamMembers.map((member, idx) => {
          const completedCount = member.commitments.filter((c) => c.status === "completed").length
          const totalCount = member.commitments.length
          const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

          return (
            <div key={idx} className="p-4 rounded-lg border border-purple-200 bg-white space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">
                    {member.weeklyScore ? member.weeklyScore.toFixed(1) : "—"}
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">Commitment Progress</span>
                  <span className="text-purple-600 font-semibold">
                    {completedCount}/{totalCount}
                  </span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>

              <div className="space-y-1.5">
                {member.commitments.slice(0, 3).map((commitment) => (
                  <div key={commitment.id} className="flex items-center justify-between text-sm">
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
                {member.commitments.length > 3 && (
                  <p className="text-xs text-muted-foreground pl-6">
                    +{member.commitments.length - 3} more commitments
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
