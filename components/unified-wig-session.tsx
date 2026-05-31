"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CalendarDays, CheckCircle2, AlertCircle, Plus, ArrowRight, Zap, Clock, Users, Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Commitment {
  id: string
  title: string
  owner: string
  score?: number
  completed?: boolean
}

interface UnifiedWIGSessionProps {
  departmentName: string
  previousWeekCommitments?: Commitment[]
  powerMoves?: Array<{ id: string; name: string; weeklyTarget: number; weeklyActual: number }>
}

export function UnifiedWIGSession({
  departmentName,
  previousWeekCommitments = [],
  powerMoves = [],
}: UnifiedWIGSessionProps) {
  const { toast } = useToast()
  const [step, setStep] = useState<"schedule" | "review" | "plan">("schedule")
  const [sessionScheduled, setSessionScheduled] = useState(false)

  // Schedule settings
  const [dayOfWeek, setDayOfWeek] = useState<string>("thursday")
  const [time, setTime] = useState<string>("10:00")
  const [duration, setDuration] = useState<string>("60")
  const [facilitator, setFacilitator] = useState<string>("")

  // Review data
  const [commitmentScores, setCommitmentScores] = useState(
    previousWeekCommitments.map((c) => ({ ...c, score: c.score || 5 })),
  )
  const [wins, setWins] = useState("")
  const [challenges, setChallenges] = useState("")

  // Plan data
  const [nextWeekCommitments, setNextWeekCommitments] = useState<Array<{ id: string; title: string; owner: string }>>(
    [],
  )
  const [newCommitmentTitle, setNewCommitmentTitle] = useState("")

  const handleSchedule = () => {
    toast({
      title: "WIG Session Scheduled",
      description: `${departmentName} will meet every ${dayOfWeek} at ${time}`,
    })
    setSessionScheduled(true)
    setStep("review")
  }

  const updateCommitmentScore = (id: string, score: number) => {
    setCommitmentScores((prev) => prev.map((c) => (c.id === id ? { ...c, score } : c)))
  }

  const addNextWeekCommitment = () => {
    if (!newCommitmentTitle.trim()) return

    setNextWeekCommitments((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        title: newCommitmentTitle,
        owner: "You",
      },
    ])
    setNewCommitmentTitle("")
  }

  const calculateAverageScore = () => {
    if (commitmentScores.length === 0) return 0
    const sum = commitmentScores.reduce((acc, c) => acc + (c.score || 0), 0)
    return (sum / commitmentScores.length).toFixed(1)
  }

  const handleCompleteSession = () => {
    toast({
      title: "WIG Session Complete",
      description: `${departmentName} accountability cycle closed. See you next week!`,
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Weekly WIG Session</h2>
          <p className="text-muted-foreground mt-2">4DX Discipline 4: Cadence of Accountability</p>
        </div>
        {step === "review" && (
          <Card className="w-32">
            <CardContent className="pt-6 pb-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{calculateAverageScore()}</div>
              <p className="text-xs text-muted-foreground mt-1">Team Score</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Progress Tabs */}
      <div className="flex items-center gap-4">
        <div
          className={`flex-1 p-4 rounded-lg border-2 ${step === "schedule" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
        >
          <div className="flex items-center gap-2">
            <CalendarDays className={`h-5 w-5 ${step === "schedule" ? "text-blue-600" : "text-gray-400"}`} />
            <span className={`font-semibold ${step === "schedule" ? "text-blue-900" : "text-gray-600"}`}>
              1. Schedule
            </span>
          </div>
        </div>
        <div
          className={`flex-1 p-4 rounded-lg border-2 ${step === "review" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`h-5 w-5 ${step === "review" ? "text-blue-600" : "text-gray-400"}`} />
            <span className={`font-semibold ${step === "review" ? "text-blue-900" : "text-gray-600"}`}>2. Review</span>
          </div>
        </div>
        <div
          className={`flex-1 p-4 rounded-lg border-2 ${step === "plan" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
        >
          <div className="flex items-center gap-2">
            <Trophy className={`h-5 w-5 ${step === "plan" ? "text-blue-600" : "text-gray-400"}`} />
            <span className={`font-semibold ${step === "plan" ? "text-blue-900" : "text-gray-600"}`}>3. Commit</span>
          </div>
        </div>
      </div>

      {/* Step 1: Schedule */}
      {step === "schedule" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Schedule Weekly WIG Sessions
            </CardTitle>
            <CardDescription>
              Establish a recurring cadence of accountability. Meet every week, same day, same time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day of Week</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger id="day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilitator" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Meeting Facilitator
                </Label>
                <Input
                  id="facilitator"
                  placeholder="Enter facilitator name"
                  value={facilitator}
                  onChange={(e) => setFacilitator(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleSchedule} size="lg" className="w-full gap-2">
              <CalendarDays className="h-5 w-5" />
              Schedule WIG Sessions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review Last Week */}
      {step === "review" && (
        <div className="space-y-6">
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                Power Move Completion (Lead Measures)
              </CardTitle>
              <CardDescription>Did you complete your weekly activity targets?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {powerMoves.map((pm) => {
                const completionRate = Math.round((pm.weeklyActual / pm.weeklyTarget) * 100)
                let status: "green" | "yellow" | "red" = "green"
                if (completionRate >= 70) status = "green"
                else if (completionRate >= 50) status = "yellow"
                else status = "red"

                return (
                  <div key={pm.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{pm.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Target: {pm.weeklyTarget} per week</p>
                    </div>
                    <Badge variant={status === "green" ? "default" : status === "yellow" ? "secondary" : "destructive"}>
                      {pm.weeklyActual}/{pm.weeklyTarget}
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Did You Do What You Said?</CardTitle>
              <CardDescription>Score last week's commitments (1-10)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {commitmentScores.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No commitments from last week</p>
              ) : (
                commitmentScores.map((commitment) => (
                  <div key={commitment.id} className="space-y-2 p-3 rounded-lg border">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium flex-1">{commitment.title}</p>
                      <span className="text-lg font-bold text-blue-600">{commitment.score}</span>
                    </div>
                    <Slider
                      value={[commitment.score || 5]}
                      onValueChange={([value]) => updateCommitmentScore(commitment.id, value)}
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Wins This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What went well?"
                  value={wins}
                  onChange={(e) => setWins(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What needs help?"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep("plan")} size="lg" className="gap-2">
              Next: Make Commitments
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Commit to Next Week */}
      {step === "plan" && (
        <div className="space-y-6">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">What Will You Commit To?</CardTitle>
              <CardDescription>Make specific commitments for next week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newCommitment">New Commitment</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="newCommitment"
                    placeholder="I commit to..."
                    value={newCommitmentTitle}
                    onChange={(e) => setNewCommitmentTitle(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button onClick={addNextWeekCommitment} size="icon" className="shrink-0 h-[60px] w-[60px]">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {nextWeekCommitments.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">This Week's Commitments ({nextWeekCommitments.length})</Label>
                  {nextWeekCommitments.map((commitment, index) => (
                    <div key={commitment.id} className="flex items-start gap-2 p-3 rounded-lg border bg-blue-50">
                      <span className="text-sm font-bold text-blue-600">{index + 1}.</span>
                      <p className="text-sm flex-1">{commitment.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleCompleteSession} size="lg" className="gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Complete WIG Session
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
