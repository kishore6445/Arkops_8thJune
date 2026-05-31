"use client"

import { useEffect, useState } from "react"
import { useBrand } from "@/lib/brand-context"

type DepartmentAccessCode = "M" | "A" | "S" | "T" | "E" | "R" | "Y"

type DepartmentUser = {
  id: string
  name: string
  role: string
  email?: string
}

type AdminUser = DepartmentUser & {
  departments?: Array<{ code: DepartmentAccessCode; permission: string }>
}

type BrandAssignment = {
  userId: string
  brandId: string
}

const DEPARTMENT_CODE_MAP: Record<string, DepartmentAccessCode> = {
  marketing: "M",
  accounts: "A",
  sales: "S",
  team: "T",
  "team-tools": "T",
  execution: "E",
  rnd: "R",
  leadership: "Y",
}

function normalizeSlug(value: string | undefined) {
  return value?.trim().toLowerCase() || ""
}

export function useDepartmentUsers(departmentKey: string) {
  const { currentBrand } = useBrand()
  const [users, setUsers] = useState<DepartmentUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const departmentCode = DEPARTMENT_CODE_MAP[departmentKey]
    const brandSlug = normalizeSlug(currentBrand)

    if (!departmentKey || !departmentCode || !brandSlug) {
      setUsers([])
      setError(null)
      setIsLoading(false)
      return
    }

    let isActive = true

    const loadDepartmentUsers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [usersResponse, assignmentsResponse] = await Promise.all([
          fetch("/api/admin/users", { cache: "no-store" }),
          fetch("/api/admin/brand-assignments", { cache: "no-store" }),
        ])

        const usersResult = await usersResponse.json().catch(() => ({}))
        const assignmentsResult = await assignmentsResponse.json().catch(() => ({}))

        if (!usersResponse.ok) {
          throw new Error(usersResult?.error || "Unable to load users")
        }

        if (!assignmentsResponse.ok) {
          throw new Error(assignmentsResult?.error || "Unable to load brand assignments")
        }

        const allUsers = Array.isArray(usersResult.users) ? (usersResult.users as AdminUser[]) : []
        const allAssignments = Array.isArray(assignmentsResult.assignments)
          ? (assignmentsResult.assignments as BrandAssignment[])
          : []

        const assignedUserIds = new Set(
          allAssignments
            .filter((assignment) => normalizeSlug(assignment.brandId) === brandSlug)
            .map((assignment) => assignment.userId),
        )

        const departmentUsers = allUsers
          .filter((user) =>
            user.departments?.some((department) => department.code === departmentCode),
          )
          .filter((user) => assignedUserIds.has(user.id))
          .map((user) => ({
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
          }))

        if (isActive) {
          setUsers(departmentUsers)
        }
      } catch (err) {
        if (isActive) {
          setUsers([])
          setError(err instanceof Error ? err.message : "Unable to load department users")
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadDepartmentUsers()

    return () => {
      isActive = false
    }
  }, [currentBrand, departmentKey])

  return { users, isLoading, error }
}
