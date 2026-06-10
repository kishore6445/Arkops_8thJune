"use client"

import { useEffect, useState } from "react"
import type { StreakStats } from "@/lib/power-move-streak"
import { calculateStreakStats, formatDateForDB, getWeekStart } from "@/lib/power-move-streak"

interface StreakData {
  date: string
  completed: boolean
  notes?: string
}

interface UseStreakTrackerResult {
  stats: StreakStats | null
  isLoading: boolean
  error: string | null
  markComplete: (date?: Date) => Promise<void>
}

export function useStreakTracker(
  powerMoveId: string | null,
  targetPerCycle: number,
  frequency: "daily" | "weekly" | "monthly",
): UseStreakTrackerResult {
  const [stats, setStats] = useState<StreakStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trackingData, setTrackingData] = useState<StreakData[]>([])

  // Load streak data
  useEffect(() => {
    if (!powerMoveId) {
      setIsLoading(false)
      return
    }

    const loadStreak = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const weekStart = getWeekStart()
        const params = new URLSearchParams({
          powerMoveId,
          startDate: formatDateForDB(weekStart),
          days: "90", // Load 90 days for streak calculation
        })

        const response = await fetch(`/api/power-move-streak?${params}`, {
          cache: "no-store",
        })

        if (!response.ok) {
          const result = await response.json().catch(() => ({}))
          throw new Error(result.error || "Failed to load streak data")
        }

        const result = await response.json()
        const data: StreakData[] = Array.isArray(result.tracking)
          ? result.tracking.map((item: any) => ({
              date: item.date,
              completed: item.completed || item.status === "completed",
              notes: item.notes,
            }))
          : []

        setTrackingData(data)
        const calculatedStats = calculateStreakStats(data, targetPerCycle, frequency)
        setStats(calculatedStats)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load streak data")
        setStats(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadStreak()
  }, [powerMoveId, targetPerCycle, frequency])

  const markComplete = async (date: Date = new Date()) => {
    if (!powerMoveId) return

    try {
      const dateStr = formatDateForDB(date)
      const response = await fetch("/api/power-move-checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          powerMoveId,
          checkInDate: dateStr,
          status: "completed",
        }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.error || "Failed to mark as complete")
      }

      // Update local state
      const updatedData = [...trackingData]
      const existing = updatedData.find((d) => d.date === dateStr)
      if (existing) {
        existing.completed = true
      } else {
        updatedData.push({ date: dateStr, completed: true })
      }

      setTrackingData(updatedData)
      const calculatedStats = calculateStreakStats(updatedData, targetPerCycle, frequency)
      setStats(calculatedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as complete")
    }
  }

  return { stats, isLoading, error, markComplete }
}
