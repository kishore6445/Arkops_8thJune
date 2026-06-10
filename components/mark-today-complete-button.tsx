"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useStreakTracker } from "@/lib/use-streak-tracker"
import { formatDateForDB } from "@/lib/power-move-streak"

interface MarkTodayCompleteProps {
  powerMoveId: string
  powerMoveName: string
  targetPerCycle: number
  frequency: "daily" | "weekly" | "monthly"
  size?: "sm" | "default" | "lg"
  onSuccess?: () => void
}

export function MarkTodayComplete({
  powerMoveId,
  powerMoveName,
  targetPerCycle,
  frequency,
  size = "default",
  onSuccess,
}: MarkTodayCompleteProps) {
  const { stats, markComplete } = useStreakTracker(powerMoveId, targetPerCycle, frequency)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date()
  const todayStr = formatDateForDB(today)
  
  // Check if today is already marked complete
  const todayStatus = stats?.weekDays.find((day) => formatDateForDB(day.date) === todayStr)?.status

  const handleMarkComplete = async () => {
    setIsSubmitting(true)
    try {
      await markComplete(today)
      onSuccess?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (todayStatus === "completed") {
    return (
      <Button disabled size={size} variant="outline" className="gap-2">
        <Check className="h-4 w-4" />
        Completed Today
      </Button>
    )
  }

  return (
    <Button
      onClick={handleMarkComplete}
      disabled={isSubmitting}
      size={size}
      className="gap-2"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Marking...
        </>
      ) : (
        <>
          <Check className="h-4 w-4" />
          Mark Today Complete
        </>
      )}
    </Button>
  )
}
