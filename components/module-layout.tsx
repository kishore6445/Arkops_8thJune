"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { QuickCommitmentModal } from "@/components/quick-commitment-modal"

interface ModuleLayoutProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  wig: string
  scoreboard: Array<{
    week: string
    metric: string
    target: string
    actual: string
    status: "success" | "warning" | "danger"
  }>
  commitments: Array<{
    id: string
    title: string
    owner: string
    day: string
    completed: boolean
  }>
  onAddCommitment?: () => void
}

export function ModuleLayout({ title, description, icon: Icon, wig, scoreboard, commitments }: ModuleLayoutProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Add Commitment
        </Button>
      </div>

      {/* WIG Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wide">
            <TrendingUp className="h-3.5 w-3.5" />
            Department WIG
          </div>
          <CardTitle className="text-xl font-semibold leading-snug">{wig}</CardTitle>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="scoreboard" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="scoreboard">WIG & Scoreboard</TabsTrigger>
          <TabsTrigger value="power-moves">Power Moves</TabsTrigger>
          <TabsTrigger value="weekly-review">Weekly Review</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="scoreboard" className="space-y-6 mt-6">
          {/* Scoreboard Table */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Scoreboard</CardTitle>
              <CardDescription>Track progress against lead measures each week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Week</th>
                      <th className="text-left py-3 px-4 font-semibold">Metric</th>
                      <th className="text-right py-3 px-4 font-semibold">Target</th>
                      <th className="text-right py-3 px-4 font-semibold">Actual</th>
                      <th className="text-center py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreboard.map((row, index) => (
                      <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{row.week}</td>
                        <td className="py-3 px-4">{row.metric}</td>
                        <td className="py-3 px-4 text-right tabular-nums">{row.target}</td>
                        <td className="py-3 px-4 text-right tabular-nums font-semibold">{row.actual}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            variant={
                              row.status === "success"
                                ? "default"
                                : row.status === "warning"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={
                              row.status === "success"
                                ? "bg-[oklch(var(--success))] text-white hover:bg-[oklch(var(--success))]/90"
                                : ""
                            }
                          >
                            {row.status === "success" ? "On Track" : row.status === "warning" ? "At Risk" : "Behind"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Commitments */}
          <Card>
            <CardHeader>
              <CardTitle>Commitments This Week</CardTitle>
              <CardDescription>Team commitments for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commitments.map((commitment) => (
                  <div
                    key={commitment.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50"
                  >
                    <Checkbox id={commitment.id} defaultChecked={commitment.completed} className="mt-1" />
                    <div className="flex-1 space-y-1">
                      <label htmlFor={commitment.id} className="text-sm font-medium leading-none cursor-pointer">
                        {commitment.title}
                      </label>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{commitment.owner}</span>
                        <span>•</span>
                        <span>Due: {commitment.day}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="power-moves" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Measures (Power Moves)</CardTitle>
              <CardDescription>High-leverage activities that drive the lag measure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lead measures are the predictive activities that influence your WIG. Configure your department's power
                moves here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly-review" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Review Session</CardTitle>
              <CardDescription>Review progress and make new commitments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Weekly review sessions help teams stay accountable and adjust their approach based on what's working.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>Detailed insights and performance trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View historical data, trends, and generate reports for leadership reviews.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <QuickCommitmentModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
