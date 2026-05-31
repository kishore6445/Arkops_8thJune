"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, TrendingUp, Award, Target, MessageSquare } from "lucide-react"
import { getBPRStatusCircle } from "@/lib/bpr-status"

export function PerformanceManagement() {
  const [selectedMonth, setSelectedMonth] = useState("January 2026")
  const [selectedTeamMember, setSelectedTeamMember] = useState("Sarah M.")
  const [viewMode, setViewMode] = useState<"team" | "individual">("team")

  // Mock data - will be replaced with real data from database
  const performanceData = {
    "Sarah M.": {
      powerMoveCompletion: 85,
      victoryTargetProgress: 78,
      dailyReportStreak: 21,
      commitmentCompletion: 90,
      keyWins: [
        "Launched new client onboarding system",
        "Improved sales process efficiency by 30%",
        "Mentored 2 junior team members",
      ],
      commonBlockers: ["Resource constraints (mentioned 4x)", "Cross-team dependencies (mentioned 3x)"],
      ratings: {
        execution: 5,
        collaboration: 4,
        initiative: 5,
        communication: 4,
      },
      managerFeedback: {
        strengths:
          "Exceptional execution and proactive problem-solving. Sarah consistently delivers ahead of schedule.",
        improvements: "Consider delegating more routine tasks to focus on strategic initiatives.",
        actionItems: ["Lead Q1 strategy session", "Develop training program for new hires"],
      },
    },
    "John D.": {
      powerMoveCompletion: 67,
      victoryTargetProgress: 72,
      dailyReportStreak: 18,
      commitmentCompletion: 75,
      keyWins: ["Closed 3 enterprise deals", "Built strong client relationships"],
      commonBlockers: ["Proposal approval delays (mentioned 5x)"],
      ratings: {
        execution: 4,
        collaboration: 5,
        initiative: 3,
        communication: 5,
      },
      managerFeedback: {
        strengths: "Strong relationship builder with excellent communication skills.",
        improvements: "Focus on increasing proactive follow-ups to improve win rate.",
        actionItems: ["Complete sales methodology training", "Shadow top performer for 2 weeks"],
      },
    },
  }

  const currentData = performanceData[selectedTeamMember as keyof typeof performanceData]
  const powerMoveStatus = getBPRStatusCircle(currentData.powerMoveCompletion)
  const victoryStatus = getBPRStatusCircle(currentData.victoryTargetProgress)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Management</h1>
          <p className="text-muted-foreground mt-1">Monthly reviews and continuous feedback</p>
        </div>
      </div>

      {/* Month Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold">{selectedMonth}</div>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "team" | "individual")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="team">Team View (Manager)</TabsTrigger>
          <TabsTrigger value="individual">My Performance</TabsTrigger>
        </TabsList>

        {/* Team View (Manager) */}
        <TabsContent value="team" className="space-y-6">
          {/* Team Member Selector */}
          <Card className="p-4">
            <Label>Select Team Member</Label>
            <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sarah M.">Sarah M. - Marketing</SelectItem>
                <SelectItem value="John D.">John D. - Sales</SelectItem>
                <SelectItem value="Mike R.">Mike R. - Accounts</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Performance Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Target className="h-4 w-4" />
                Power Moves
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{currentData.powerMoveCompletion}%</div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${powerMoveStatus.bgColor}`}>
                  <span className="text-white font-bold text-sm">{powerMoveStatus.status}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Award className="h-4 w-4" />
                Victory Targets
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{currentData.victoryTargetProgress}%</div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${victoryStatus.bgColor}`}>
                  <span className="text-white font-bold text-sm">{victoryStatus.status}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <TrendingUp className="h-4 w-4" />
                Report Streak
              </div>
              <div className="text-3xl font-bold">{currentData.dailyReportStreak}</div>
              <div className="text-sm text-muted-foreground">days</div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MessageSquare className="h-4 w-4" />
                Commitments
              </div>
              <div className="text-3xl font-bold">{currentData.commitmentCompletion}%</div>
              <div className="text-sm text-muted-foreground">completed</div>
            </Card>
          </div>

          {/* Insights from Daily Reports */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Insights from Daily Reports</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="text-emerald-600">✓</span> Key Wins This Month
                </h4>
                <ul className="space-y-2">
                  {currentData.keyWins.map((win, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground pl-6">
                      • {win}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="text-amber-600">!</span> Recurring Blockers
                </h4>
                <ul className="space-y-2">
                  {currentData.commonBlockers.map((blocker, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground pl-6">
                      • {blocker}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Performance Ratings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Ratings</h3>

            <div className="space-y-4">
              {Object.entries(currentData.ratings).map(([category, rating]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="capitalize">{category}</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`h-6 w-6 rounded-full ${star <= rating ? "bg-emerald-600" : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Manager Feedback */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Feedback</h3>

            <div className="space-y-4">
              <div>
                <Label>Strengths</Label>
                <Textarea className="mt-2" defaultValue={currentData.managerFeedback.strengths} rows={3} />
              </div>

              <div>
                <Label>Areas for Improvement</Label>
                <Textarea className="mt-2" defaultValue={currentData.managerFeedback.improvements} rows={3} />
              </div>

              <div>
                <Label>Action Items for Next Month</Label>
                <div className="mt-2 space-y-2">
                  {currentData.managerFeedback.actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" defaultChecked={false} />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    + Add Action Item
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>Save Feedback</Button>
                <Button variant="outline">Schedule 1:1</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Individual View */}
        <TabsContent value="individual" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">My Performance - {selectedMonth}</h3>

            {/* Same metrics as above but for logged-in user */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{currentData.powerMoveCompletion}%</div>
                <div className="text-sm text-muted-foreground">Power Moves</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{currentData.victoryTargetProgress}%</div>
                <div className="text-sm text-muted-foreground">Victory Targets</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{currentData.dailyReportStreak}</div>
                <div className="text-sm text-muted-foreground">Report Streak</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{currentData.commitmentCompletion}%</div>
                <div className="text-sm text-muted-foreground">Commitments</div>
              </div>
            </div>

            {/* Manager Feedback (Read-only for team member) */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">Feedback from Manager</h4>

              <div>
                <Label className="text-emerald-600">Strengths</Label>
                <p className="text-sm text-muted-foreground mt-1">{currentData.managerFeedback.strengths}</p>
              </div>

              <div>
                <Label className="text-amber-600">Growth Areas</Label>
                <p className="text-sm text-muted-foreground mt-1">{currentData.managerFeedback.improvements}</p>
              </div>

              <div>
                <Label>My Action Items</Label>
                <ul className="mt-2 space-y-2">
                  {currentData.managerFeedback.actionItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Response from Team Member */}
              <div className="pt-4 border-t">
                <Label>My Response (Optional)</Label>
                <Textarea className="mt-2" placeholder="Share your thoughts on this feedback..." rows={3} />
                <Button className="mt-2" size="sm">
                  Submit Response
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
