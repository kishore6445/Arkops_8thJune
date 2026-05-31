"use client"

import { useEffect, useState } from "react"
import { useBrand } from "@/lib/brand-context"

type DepartmentCode = "M" | "A" | "S" | "T" | "E" | "R" | "Y"

export type DepartmentVictoryTarget = {
  id: string
  brandId: string
  department: DepartmentCode
  title: string
  target: number
  achieved: number
  unit?: string
  owner: string
  ownerId?: string
}

export type DepartmentPowerMove = {
  id: string
  brandId: string
  department: DepartmentCode
  name: string
  frequency: "daily" | "weekly" | "monthly"
  weeklyTarget: number
  owner: string
  ownerId?: string
  linkedVictoryTargetId?: string
  linkedVictoryTargetTitle?: string
}

type UseDepartmentDataResult = {
  victoryTargets: DepartmentVictoryTarget[]
  powerMoves: DepartmentPowerMove[]
  isLoading: boolean
  error: string | null
}

export function useDepartmentData(department: DepartmentCode): UseDepartmentDataResult {
  const { currentBrand } = useBrand()
  const [victoryTargets, setVictoryTargets] = useState<DepartmentVictoryTarget[]>([])
  const [powerMoves, setPowerMoves] = useState<DepartmentPowerMove[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const load = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [vtResponse, pmResponse] = await Promise.all([
          fetch("/api/admin/victory-targets", { cache: "no-store" }),
          fetch("/api/admin/power-moves", { cache: "no-store" }),
        ])

        const vtResult = await vtResponse.json().catch(() => ({}))
        if (!vtResponse.ok) {
          throw new Error(vtResult?.error || "Unable to load victory targets.")
        }

        const pmResult = await pmResponse.json().catch(() => ({}))
        if (!pmResponse.ok) {
          throw new Error(pmResult?.error || "Unable to load power moves.")
        }

        if (!isActive) return

        const filteredTargets = Array.isArray(vtResult.targets)
          ? vtResult.targets.filter((target: DepartmentVictoryTarget) => {
              return target.brandId === currentBrand && target.department === department
            })
          : []

        const filteredPowerMoves = Array.isArray(pmResult.powerMoves)
          ? pmResult.powerMoves.filter((pm: DepartmentPowerMove) => {
              return pm.brandId === currentBrand && pm.department === department
            })
          : []

        setVictoryTargets(filteredTargets)
        setPowerMoves(filteredPowerMoves)
      } catch (err) {
        if (!isActive) return
        setVictoryTargets([])
        setPowerMoves([])
        setError(err instanceof Error ? err.message : "Unable to load department data.")
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [currentBrand, department])

  return { victoryTargets, powerMoves, isLoading, error }
}
