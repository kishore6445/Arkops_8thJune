"use client"

import { useEffect, useState } from "react"
import { useBrand } from "@/lib/brand-context"

type DepartmentCode = "M" | "A" | "S" | "T" | "E" | "R" | "Y"

type DepartmentVictoryTarget = {
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

type UseDepartmentVictoryTargetsResult = {
  victoryTargets: DepartmentVictoryTarget[]
  isLoading: boolean
  error: string | null
}

export function useDepartmentVictoryTargets(department: DepartmentCode): UseDepartmentVictoryTargetsResult {
  const { currentBrand } = useBrand()
  const [victoryTargets, setVictoryTargets] = useState<DepartmentVictoryTarget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    const load = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/victory-targets", { cache: "force-cache" })
        const result = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(result?.error || "Unable to load victory targets.")
        }

        if (!isActive) return

        const filtered = Array.isArray(result.targets)
          ? result.targets.filter((vt: DepartmentVictoryTarget) => {
              return vt.brandId === currentBrand && vt.department === department
            })
          : []

        setVictoryTargets(filtered)
      } catch (err) {
        if (!isActive) return
        setVictoryTargets([])
        setError(err instanceof Error ? err.message : "Unable to load victory targets.")
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [currentBrand, department])

  return { victoryTargets, isLoading, error }
}
