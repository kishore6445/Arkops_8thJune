"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface PowerMoveActivityTrackerProps {
  powerMoveId: string
  powerMoveName: string
  activityCompleted?: boolean
  weeklyTarget?: number
  weeklyActual?: number
  onToggle?: (completed: boolean) => void
}

export function PowerMoveActivityTracker({
  powerMoveId,
  powerMoveName,
  activityCompleted = false,
  weeklyTarget,
  weeklyActual = 0,
  onToggle,
}: PowerMoveActivityTrackerProps) {
  const targetCount = weeklyTarget && weeklyTarget > 0 ? weeklyTarget : 1
  const [currentCount, setCurrentCount] = useState(weeklyActual)
  const isCompleted = currentCount >= targetCount || activityCompleted
  const { toast } = useToast()

  useEffect(() => {
    setCurrentCount(weeklyActual)
  }, [weeklyActual])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCompleted) return
    const nextCount = Math.min(currentCount + 1, targetCount)
    setCurrentCount(nextCount)
    const completed = nextCount >= targetCount

    // TODO: Save to backend
    console.log("[v0] Updating Power Move activity:", powerMoveId, nextCount)

    toast({
      title: completed ? "Lead Measure Completed!" : "Progress Updated",
      description: completed
        ? `Great work executing ${powerMoveName}`
        : `${powerMoveName}: ${nextCount}/${targetCount}`,
    })

    onToggle?.(completed)
  }

  return (
    <div className="space-y-2">
      {weeklyTarget && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">This Week's Activity</span>
          <Badge variant={currentCount >= targetCount ? "default" : "secondary"} className="text-xs">
            {currentCount}/{targetCount}
          </Badge>
        </div>
      )}
      <Button
        variant={isCompleted ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        className={cn("w-full gap-2", isCompleted && "bg-green-600 hover:bg-green-700")}
        disabled={isCompleted}
      >
        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        {isCompleted ? "Activity Done This Week" : `Mark 1 Complete (${currentCount}/${targetCount})`}
      </Button>
    </div>
  )
}
