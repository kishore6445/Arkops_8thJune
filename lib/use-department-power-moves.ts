"use client"

import { useEffect, useState } from "react"
import { useBrand } from "@/lib/brand-context"

type DepartmentCode = "M" | "A" | "S" | "T" | "E" | "R" | "Y"

type DepartmentPowerMove = {
  id: string
  brandId: string
  department: DepartmentCode
  name: string
  frequency: "daily" | "weekly" | "monthly"
  weeklyTarget: number
  weeklyActual?: number
  currentTarget?: number
  currentActual?: number
  currentPeriod?: "today" | "this-week" | "this-month"
  owner: string
  ownerId?: string
  linkedVictoryTargetTitle?: string
}

type UseDepartmentPowerMovesResult = {
  powerMoves: DepartmentPowerMove[]
  isLoading: boolean
  error: string | null
}

export function useDepartmentPowerMoves(department: DepartmentCode): UseDepartmentPowerMovesResult {
  const { currentBrand } = useBrand()
  const [powerMoves, setPowerMoves] = useState<DepartmentPowerMove[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const load = async () => {
      setIsLoading(true)
      setError(null)

      try {
      const response = await fetch("/api/admin/power-moves", { cache: "force-cache" })
      //debugger;
      console.log('response:', response);
        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(result?.error || "Unable to load power moves.")
        }

        if (!isActive) return

        const filtered = Array.isArray(result.powerMoves)
          ? result.powerMoves.filter((pm: DepartmentPowerMove) => {
              return pm.brandId === currentBrand && pm.department === department
            })
          : []

        if (!filtered.length) {
          setPowerMoves([])
          return
        }

        try {
          const ids = filtered.map((pm) => pm.id).filter(Boolean)

          const [weeklyResponse, dailyResponse, monthlyResponse] = await Promise.all([
            fetch(
              `/api/power-move-tracking?period=this-week&powerMoveIds=${encodeURIComponent(ids.join(","))}`,
              { cache: "force-cache" },
            ),
            fetch(
              `/api/power-move-tracking?period=today&powerMoveIds=${encodeURIComponent(ids.join(","))}`,
              { cache: "force-cache" },
            ),
            fetch(
              `/api/power-move-tracking?period=this-month&powerMoveIds=${encodeURIComponent(ids.join(","))}`,
              { cache: "force-cache" },
            ),
          ])

          const weeklyResult = await weeklyResponse.json().catch(() => ({}))
          const dailyResult = await dailyResponse.json().catch(() => ({}))
          const monthlyResult = await monthlyResponse.json().catch(() => ({}))

          const weeklyMap = new Map<string, { actual: number; target: number }>(
            Array.isArray(weeklyResult.tracking) ? weeklyResult.tracking.map((row: any) => [row.power_move_id, row]) : [],
          )
          const dailyMap = new Map<string, { actual: number; target: number }>(
            Array.isArray(dailyResult.tracking) ? dailyResult.tracking.map((row: any) => [row.power_move_id, row]) : [],
          )
          const monthlyMap = new Map<string, { actual: number; target: number }>(
            Array.isArray(monthlyResult.tracking)
              ? monthlyResult.tracking.map((row: any) => [row.power_move_id, row])
              : [],
          )

          const merged = filtered.map((pm) => {
            const tracked =
              pm.frequency === "daily"
                ? dailyMap.get(pm.id)
                : pm.frequency === "monthly"
                  ? monthlyMap.get(pm.id)
                  : weeklyMap.get(pm.id)
            if (!tracked) return pm
            return {
              ...pm,
              weeklyActual: tracked.actual,
              weeklyTarget: tracked.target ?? pm.weeklyTarget,
              currentActual: tracked.actual,
              currentTarget: tracked.target ?? pm.weeklyTarget,
              currentPeriod:
                pm.frequency === "daily" ? "today" : pm.frequency === "monthly" ? "this-month" : "this-week",
            }
          })

          setPowerMoves(merged)
        } catch {
          setPowerMoves(filtered)
        }
      } catch (err) {
        if (!isActive) return
        setPowerMoves([])
        setError(err instanceof Error ? err.message : "Unable to load power moves.")
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [currentBrand, department])

  return { powerMoves, isLoading, error }
}
