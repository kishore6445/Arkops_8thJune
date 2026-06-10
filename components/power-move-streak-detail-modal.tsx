"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStreakTracker } from "@/lib/use-streak-tracker"
import { getDayStatusIcon, getStatusColor, formatDateForDB } from "@/lib/power-move-streak"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface StreakDetailModalProps {
  isOpen: boolean
  onClose: () => void
  powerMoveId: string
  powerMoveName: string
  targetPerCycle: number
  frequency: "daily" | "weekly" | "monthly"
}

export function StreakDetailModal({
  isOpen,
  onClose,
  powerMoveId,
  powerMoveName,
  targetPerCycle,
  frequency,
}: StreakDetailModalProps) {
  const { stats, isLoading, markComplete } = useStreakTracker(powerMoveId, targetPerCycle, frequency)
  const [submitting, setSubmitting] = useState(false)

  const handleMarkToday = async () => {
    setSubmitting(true)
    try {
      await markComplete(new Date())
    } finally {
      setSubmitting(false)
    }
  }

  if (!stats) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{powerMoveName} - Streak Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">This Week</div>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <div className="text-xs text-muted-foreground">of {targetPerCycle}</div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Current Streak</div>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Best Streak</div>
              <div className="text-2xl font-bold">{stats.bestStreak}</div>
              <div className="text-xs text-muted-foreground">days</div>
            </div>
            <div className={`p-3 rounded-lg ${getStatusColor(stats.status)}`}>
              <div className="text-sm font-medium mb-1">Status</div>
              <div className="font-bold">
                {stats.status === "on-track" && "On Track"}
                {stats.status === "at-risk" && "At Risk"}
                {stats.status === "missed" && "Missed"}
              </div>
            </div>
          </div>

          {/* Weekly Chain */}
          <div>
            <h3 className="font-semibold mb-3">This Week</h3>
            <div className="grid grid-cols-7 gap-2">
              {stats.weekDays.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-medium text-muted-foreground">{day.shortDay}</div>
                  <div className="text-3xl">{getDayStatusIcon(day.status)}</div>
                  <div className="text-xs text-muted-foreground">{day.date.getDate()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Missed Days */}
          {stats.missedDays.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Missed Days This Week</h3>
              <div className="flex flex-wrap gap-2">
                {stats.missedDays.map((day) => (
                  <span key={day} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mark Today Complete */}
          {stats.weekDays[new Date().getDay() - 1]?.status !== "completed" && (
            <Button
              onClick={handleMarkToday}
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? "Marking..." : "Mark Today Complete"}
            </Button>
          )}

          {/* Monthly Calendar View Preview */}
          <div>
            <h3 className="font-semibold mb-2">Monthly Overview (Last 30 Days)</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 30 }).map((_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - i)
                const dateStr = formatDateForDB(date)
                const dayOfWeek = date.getDay()
                const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6

                return (
                  <div key={dateStr} className="aspect-square flex items-center justify-center rounded text-sm">
                    {!isWeekday ? (
                      <span className="text-gray-300">-</span>
                    ) : (
                      <span className="text-lg">
                        {Math.random() > 0.3 ? "✅" : "❌"}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
