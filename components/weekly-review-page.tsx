"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { CalendarDays, CheckCircle2, XCircle, AlertCircle, Plus, Lightbulb, ArrowRight, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Commitment {
  id: string
  title: string
  owner: string
  score?: number
  wasPlanned?: boolean // Track if this was planned last week
}

interface WeeklyReviewPageProps {
  departmentName: string
  previousWeekCommitments?: Commitment[]
  previousWeekPlannedCommitments?: string[] // What was planned last week
}

export function WeeklyReviewPage({
  departmentName,
  previousWeekCommitments = [],
  previousWeekPlannedCommitments = [], // Add planned commitments from last week
}: WeeklyReviewPageProps) {
  const { toast } = useToast()
  const [previousWeekData, setPreviousWeekData] = useState({
    commitments: previousWeekCommitments.map((c) => ({ ...c, score: c.score || 5 })),
    wins: "",
    misses: "",
    blockers: "",
    moms: "", // Added MOMs field for important moments/meetings
    plannedCommitments: previousWeekPlannedCommitments, // Store what was planned
  })

  const [nextWeekData, setNextWeekData] = useState({
    commitments: [] as Array<{ id: string; title: string; owner: string }>,
    newCommitmentTitle: "",
    weeklyPlan: "", // Overall plan for the week
  })

  const [powerMoveCompletion, setPowerMoveCompletion] = useState([
    { id: "1", name: "Client Discovery Calls", weeklyTarget: 10, weeklyActual: 0 },
    { id: "2", name: "Follow-up Meetings", weeklyTarget: 5, weeklyActual: 0 },
    { id: "3", name: "Proposals Sent", weeklyTarget: 4, weeklyActual: 0 },
  ])

  const updateCommitmentScore = (id: string, score: number) => {
    setPreviousWeekData((prev) => ({
      ...prev,
      commitments: prev.commitments.map((c) => (c.id === id ? { ...c, score } : c)),
    }))
  }

  const addNextWeekCommitment = () => {
    if (!nextWeekData.newCommitmentTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a commitment title",
        variant: "destructive",
      })
      return
    }

    setNextWeekData((prev) => ({
      ...prev,
      commitments: [
        ...prev.commitments,
        {
          id: `new-${Date.now()}`,
          title: prev.newCommitmentTitle,
          owner: "You",
        },
      ],
      newCommitmentTitle: "",
    }))

    toast({
      title: "Commitment added",
      description: "Next week commitment has been added successfully",
    })
  }

  const calculateAverageScore = () => {
    if (previousWeekData.commitments.length === 0) return 0
    const sum = previousWeekData.commitments.reduce((acc, c) => acc + (c.score || 0), 0)
    return (sum / previousWeekData.commitments.length).toFixed(1)
  }

  const handleSaveReview = () => {
    toast({
      title: "Weekly Review Saved",
      description: `${departmentName} review has been saved successfully`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Review</h2>
          <p className="text-muted-foreground mt-1">Reflect on what happened, plan what's next</p>
        </div>
        <Card className="w-32">
          <CardContent className="pt-6 pb-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{calculateAverageScore()}</div>
            <p className="text-xs text-muted-foreground mt-1">Avg Score</p>
          </CardContent>
        </Card>
      </div>

      {previousWeekData.plannedCommitments.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-600" />
              Plan vs Action
            </CardTitle>
            <CardDescription>What you planned last week vs what you actually did</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* What Was Planned */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-blue-900">What You Planned</Label>
                <div className="space-y-2 bg-white rounded-lg p-4 border border-blue-200">
                  {previousWeekData.plannedCommitments.map((plan, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 font-medium min-w-[1.5rem]">{index + 1}.</span>
                      <span className="text-gray-700">{plan}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What Actually Happened */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-green-900">What You Did</Label>
                <div className="space-y-2 bg-white rounded-lg p-4 border border-green-200">
                  {previousWeekData.commitments.map((commitment, index) => (
                    <div key={commitment.id} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 font-medium min-w-[1.5rem]">{index + 1}.</span>
                      <div className="flex-1 flex items-center justify-between gap-2">
                        <span className="text-gray-700">{commitment.title}</span>
                        <Badge
                          variant={commitment.score && commitment.score >= 7 ? "default" : "secondary"}
                          className="shrink-0"
                        >
                          {commitment.score}/10
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {previousWeekData.commitments.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No commitments tracked</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Previous Week Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Reflection (Previous Week)</h3>
            <Badge variant="outline">Dec 18-24, 2026</Badge>
          </div>

          {/* Power Move completion review */}
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                Power Move Completion (Lead Measures)
              </CardTitle>
              <CardDescription>Did you complete your weekly activity targets?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {powerMoveCompletion.map((pm) => {
                const completionRate = Math.round((pm.weeklyActual / pm.weeklyTarget) * 100)
                let status: "green" | "yellow" | "red" = "green"
                if (completionRate >= 100) status = "green"
                else if (completionRate >= 70) status = "yellow"
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
              <CardTitle className="text-base">Score Commitments (1-10)</CardTitle>
              <CardDescription>Rate how well each commitment was completed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previousWeekData.commitments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No commitments from last week</p>
              ) : (
                previousWeekData.commitments.map((commitment) => (
                  <div key={commitment.id} className="space-y-2 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 flex-1">{commitment.title}</p>
                      <span className="text-lg font-bold text-blue-600 min-w-[2rem] text-right">
                        {commitment.score}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Owner: {commitment.owner}</p>
                    <Slider
                      value={[commitment.score || 5]}
                      onValueChange={([value]) => updateCommitmentScore(commitment.id, value)}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Poor (1)</span>
                      <span>Excellent (10)</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reflection & Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="moms" className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4 text-purple-600" />
                  Key Moments & Meetings (MOMs)
                </Label>
                <Textarea
                  id="moms"
                  placeholder="Important meetings, decisions, or breakthrough moments from this week..."
                  value={previousWeekData.moms}
                  onChange={(e) => setPreviousWeekData((prev) => ({ ...prev, moms: e.target.value }))}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Document key meetings, decisions, or significant moments
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wins" className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Wins This Week
                </Label>
                <Textarea
                  id="wins"
                  placeholder="What went well this week?"
                  value={previousWeekData.wins}
                  onChange={(e) => setPreviousWeekData((prev) => ({ ...prev, wins: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="misses" className="flex items-center gap-2 text-sm font-medium">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Misses This Week
                </Label>
                <Textarea
                  id="misses"
                  placeholder="What didn't go as planned?"
                  value={previousWeekData.misses}
                  onChange={(e) => setPreviousWeekData((prev) => ({ ...prev, misses: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blockers" className="flex items-center gap-2 text-sm font-medium">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  Blockers
                </Label>
                <Textarea
                  id="blockers"
                  placeholder="What's preventing progress?"
                  value={previousWeekData.blockers}
                  onChange={(e) => setPreviousWeekData((prev) => ({ ...prev, blockers: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Week Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Plan (Next Week)</h3>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Dec 25-31, 2026</Badge>
          </div>

          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">Weekly Plan</CardTitle>
              <CardDescription>What's your overall strategy and focus for next week?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                id="weeklyPlan"
                placeholder="Describe your weekly plan, key priorities, and strategic focus areas..."
                value={nextWeekData.weeklyPlan}
                onChange={(e) => setNextWeekData((prev) => ({ ...prev, weeklyPlan: e.target.value }))}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                This will be compared to what actually happens (Plan vs Action)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Specific Commitments</CardTitle>
              <CardDescription>What will you commit to accomplishing next week?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Commitment */}
              <div className="space-y-2">
                <Label htmlFor="newCommitment">New Commitment</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="newCommitment"
                    placeholder="Enter commitment for next week..."
                    value={nextWeekData.newCommitmentTitle}
                    onChange={(e) => setNextWeekData((prev) => ({ ...prev, newCommitmentTitle: e.target.value }))}
                    className="min-h-[60px]"
                  />
                  <Button onClick={addNextWeekCommitment} size="icon" className="shrink-0 h-[60px] w-[60px]">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* List of Next Week Commitments */}
              {nextWeekData.commitments.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Planned Commitments ({nextWeekData.commitments.length})</Label>
                  {nextWeekData.commitments.map((commitment, index) => (
                    <div
                      key={commitment.id}
                      className="flex items-start gap-2 p-3 rounded-lg border border-gray-200 bg-blue-50"
                    >
                      <span className="text-sm font-bold text-blue-600 min-w-[1.5rem]">{index + 1}.</span>
                      <p className="text-sm text-gray-900 flex-1">{commitment.title}</p>
                    </div>
                  ))}
                </div>
              )}

              {nextWeekData.commitments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No commitments planned yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Add commitments above to plan your week</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSaveReview} className="gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Save Weekly Review
        </Button>
      </div>
    </div>
  )
}
