"use client"

import { useState } from "react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DailyReportForm } from "@/components/daily-report-form"
import { DailyReportCard } from "@/components/daily-report-card"
import { Plus, Calendar } from "lucide-react"
import { useBrand } from "@/lib/brand-context"

export default function DailyReportPage() {
  const { selectedBrand } = useBrand()
  const [showForm, setShowForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Mock data - replace with actual data fetching
  const mockReports = [
    {
      id: "1",
      user: {
        name: "Sarah Mitchell",
        initials: "SM",
        department: "Marketing",
        brand: "Warrior Systems",
      },
      date: selectedDate,
      powerMoves: [
        { name: "Client Discovery Calls", completed: 5, target: 5 },
        { name: "Story Scripts Written", completed: 2, target: 3 },
      ],
      wins: [
        "Closed 2 new client contracts worth $50K",
        "Completed marketing campaign strategy for Q1",
        "Team collaboration session was highly productive",
      ],
      blockers: ["Waiting on legal approval for new contract template"],
      learnings:
        "Discovered that shorter discovery calls (20 min) are more effective than 45 min sessions. Clients appreciate the focused approach.",
      tomorrow: [
        "Follow up with 3 pending proposals",
        "Review and approve team content calendar",
        "Schedule Q1 planning meeting with leadership",
      ],
    },
    {
      id: "2",
      user: {
        name: "John Doe",
        initials: "JD",
        department: "Sales",
        brand: "Story Marketing",
      },
      date: selectedDate,
      powerMoves: [
        { name: "Demo Presentations", completed: 4, target: 5 },
        { name: "Follow-up Calls", completed: 10, target: 10 },
      ],
      wins: ["Successfully demoed to Fortune 500 prospect", "Achieved 100% follow-up completion rate"],
      blockers: ["Technical issue with demo environment", "Prospect delayed decision to next quarter"],
      learnings: "Live demos with real data convert 40% better than generic presentations.",
      tomorrow: [
        "Fix demo environment issues",
        "Prepare proposal for Fortune 500 prospect",
        "Team pipeline review meeting",
      ],
    },
  ]

  const handleSubmitReport = (report: any) => {
    console.log("[v0] Submitted report:", report)
    setShowForm(false)
    // TODO: Save to database
  }

  return (
    <PageTransition>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <Breadcrumbs />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Reports</h1>
            <p className="text-gray-600">Track daily execution and team accountability</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border-2 rounded-lg"
            />
            <Button onClick={() => setShowForm(!showForm)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              {showForm ? "Cancel" : "Submit Report"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="my-report">My Report</TabsTrigger>
            <TabsTrigger value="team">My Team</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {showForm && (
              <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Submit Your Daily Report</h2>
                <DailyReportForm onSubmit={handleSubmitReport} />
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Reports for{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <span className="text-muted-foreground">{mockReports.length} reports submitted</span>
              </div>

              {mockReports.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reports Yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to submit a daily report for today!</p>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Report
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {mockReports.map((report) => (
                    <DailyReportCard key={report.id} report={report} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-report">
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Your daily report will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Your team's reports will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
