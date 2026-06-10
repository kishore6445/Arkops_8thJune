"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getDayStatusIcon, formatDateForDB, getWeekStart, getWeekDates, getStatusColor } from "@/lib/power-move-streak"

interface PowerMove {
  id: string
  name: string
  frequency: string
  owner: string
  department: string
  targetPerCycle: number
}

interface AdminPowerMoveTrackingProps {
  powerMoves?: PowerMove[]
  isLoading?: boolean
}

export function AdminPowerMoveTracking({ powerMoves = [], isLoading = false }: AdminPowerMoveTrackingProps) {
  const [trackingData, setTrackingData] = useState<Map<string, any>>(new Map())
  const weekDates = getWeekDates()
  const weekStart = getWeekStart()

  useEffect(() => {
    const loadTracking = async () => {
      if (powerMoves.length === 0) return

      try {
        const results = new Map()

        for (const pm of powerMoves) {
          const params = new URLSearchParams({
            powerMoveId: pm.id,
            startDate: formatDateForDB(weekStart),
            days: "7",
          })

          try {
            const response = await fetch(`/api/power-move-streak?${params}`, {
              cache: "no-store",
            })

            if (response.ok) {
              const data = await response.json()
              results.set(pm.id, data.tracking || [])
            }
          } catch {
            results.set(pm.id, [])
          }
        }

        setTrackingData(results)
      } catch (error) {
        console.error("Failed to load tracking data:", error)
      }
    }

    loadTracking()
  }, [powerMoves, weekStart])

  const getStatus = (pmId: string, week: any[]) => {
    const completed = week.filter((d) => d.completed).length
    const target = 5 // Assuming 5 business days

    if (completed >= target) return "on-track"
    if (completed >= target * 0.5) return "at-risk"
    return "missed"
  }

  const getStreakInfo = (pmId: string, week: any[]) => {
    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0

    for (const day of week) {
      if (day.completed) {
        tempStreak++
        bestStreak = Math.max(bestStreak, tempStreak)
        currentStreak = tempStreak
      } else {
        tempStreak = 0
      }
    }

    return { currentStreak, bestStreak }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading tracking data...</div>
  }

  if (powerMoves.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No power moves to display</div>
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-200">Power Move</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Dept</TableHead>
              <TableHead className="text-center">Mon</TableHead>
              <TableHead className="text-center">Tue</TableHead>
              <TableHead className="text-center">Wed</TableHead>
              <TableHead className="text-center">Thu</TableHead>
              <TableHead className="text-center">Fri</TableHead>
              <TableHead className="text-center">This Week</TableHead>
              <TableHead className="text-center">Streak</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {powerMoves.map((pm) => {
              const week = trackingData.get(pm.id) || []
              const weekDayTracking = weekDates.slice(0, 5).map((date, idx) => {
                const dateStr = formatDateForDB(date)
                return week.find((d) => d.date === dateStr) || { date: dateStr, completed: false }
              })

              const thisWeek = weekDayTracking.filter((d) => d.completed).length
              const status = getStatus(pm.id, weekDayTracking)
              const { currentStreak, bestStreak } = getStreakInfo(pm.id, week)

              return (
                <TableRow key={pm.id}>
                  <TableCell className="font-medium">{pm.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{pm.owner}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {pm.department}
                    </Badge>
                  </TableCell>
                  {weekDayTracking.map((day, idx) => (
                    <TableCell key={idx} className="text-center text-lg">
                      {getDayStatusIcon(day.completed ? "completed" : "missed")}
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-semibold">
                    {thisWeek}/{pm.targetPerCycle}
                  </TableCell>
                  <TableCell className="text-center">
                    {currentStreak}d
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`text-xs ${getStatusColor(status as any)}`}>
                      {status === "on-track"
                        ? "On Track"
                        : status === "at-risk"
                          ? "At Risk"
                          : "Missed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
