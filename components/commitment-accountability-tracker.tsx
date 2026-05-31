"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Commitment {
  id: string
  title: string
  owner: string
  week: string
  completed: boolean
  completedOn?: string
}

interface CommitmentAccountabilityTrackerProps {
  teamMembers: Array<{
    name: string
    commitments: Commitment[]
  }>
}

export function CommitmentAccountabilityTracker({ teamMembers }: CommitmentAccountabilityTrackerProps) {
  const { toast } = useToast()
  const [commitments, setCommitments] = useState<Commitment[]>(teamMembers.flatMap((member) => member.commitments))

  const handleToggleCommitment = (id: string) => {
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              completed: !c.completed,
              completedOn: !c.completed ? new Date().toLocaleDateString() : undefined,
            }
          : c,
      ),
    )

    const commitment = commitments.find((c) => c.id === id)
    if (commitment) {
      toast({
        title: !commitment.completed ? "Commitment Completed" : "Commitment Reopened",
        description: `${commitment.title} has been ${!commitment.completed ? "completed" : "reopened"}`,
      })
    }
  }

  const calculateCompletionRate = (memberName: string) => {
    const memberCommitments = commitments.filter((c) => c.owner === memberName)
    if (memberCommitments.length === 0) return 0
    const completed = memberCommitments.filter((c) => c.completed).length
    return Math.round((completed / memberCommitments.length) * 100)
  }

  const getStatusColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusIcon = (rate: number) => {
    if (rate >= 90) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (rate >= 70) return <Clock className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Commitment Accountability Tracker
        </CardTitle>
        <CardDescription>Track weekly commitments and completion rates - "Did you do what you said?"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {teamMembers.map((member) => {
          const completionRate = calculateCompletionRate(member.name)
          const memberCommitments = commitments.filter((c) => c.owner === member.name)

          return (
            <div key={member.name} className="space-y-3 p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {memberCommitments.filter((c) => c.completed).length} of {memberCommitments.length} completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(completionRate)}
                  <span className={`text-2xl font-bold ${getStatusColor(completionRate)}`}>{completionRate}%</span>
                </div>
              </div>

              <Progress value={completionRate} className="h-2" />

              <div className="space-y-2 pt-2">
                {memberCommitments.map((commitment) => (
                  <div
                    key={commitment.id}
                    className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleToggleCommitment(commitment.id)}
                  >
                    <Checkbox
                      checked={commitment.completed}
                      onCheckedChange={() => handleToggleCommitment(commitment.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${commitment.completed ? "line-through text-muted-foreground" : ""}`}>
                        {commitment.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {commitment.week}
                        </Badge>
                        {commitment.completed && commitment.completedOn && (
                          <span className="text-xs text-green-600">Completed {commitment.completedOn}</span>
                        )}
                      </div>
                    </div>
                    {commitment.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
