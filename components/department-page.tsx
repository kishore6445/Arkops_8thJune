
"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppMode } from "@/hooks/use-app-mode"
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts"
import { UnifiedWIGSession } from "@/components/unified-wig-session"
import type { BPRMetric } from "@/components/bpr-scorecard"
import { useToast } from "@/hooks/use-toast"
import { PageTransition } from "@/components/page-transition"
import { DepartmentExecutionHero } from "@/components/department-execution-hero"
import { VictoryTargetModal } from "@/components/victory-target-modal"
import { PowerMoveModal, type PowerMoveFormData } from "@/components/power-move-modal"
import { CreateTaskModal } from "@/components/create-task-modal"
import { CreateCommitmentModal } from "@/components/create-commitment-modal"
import { WeeklyReviewSession } from "@/components/weekly-review-session"
import { calculateDepartmentScore } from "@/lib/score-calculations"
import { getCurrentQuarter } from "@/lib/brand-structure"
import type { QuarterOption } from "@/components/quarter-selector"
import { useBrand } from "@/lib/brand-context"

export interface VictoryTarget {
  id: string
  title: string
  target: number
  achieved: number
  unit?: string
  status: "on-track" | "at-risk"
  description?: string
  owner: string
  ownerId?: string
}

export interface PowerMove {
  id: string
  name: string
  frequency: string
  targetPerCycle: number
  progress: number
  owner: string
  linkedVictoryTarget?: string
  activityCompleted?: boolean
  weeklyTarget?: number
  weeklyActual?: number
}

export interface Commitment {
  id: string
  title: string
  owner: string
  dueDay: string
  completed: boolean
  frequency?: string
  linkedPowerMove?: string
  linkedVictoryTarget?: string
}

export interface Task {
  id: string
  task: string
  owner: string
  due: string
  status: "todo" | "in-progress" | "done"
  linkedPowerMove?: string
  linkedVictoryTarget?: string
}

export interface WeeklyReview {
  id: string
  date: string
  wins: string
  misses: string
  blockers: string
  commitments: string
}

export interface DepartmentConfig {
  name: string
  icon: React.ComponentType<{ className?: string }>
  wig: string
  status: "on-track" | "at-risk"
  victoryTargets: VictoryTarget[]
  powerMoves: PowerMove[]
  commitments: Commitment[]
  tasks: Task[]
  weeklyReviews?: WeeklyReview[]
  coreObjective?: {
    title: string
    description: string
  }
  users?: Array<{ name: string; role: string }>
}

interface DepartmentPageProps {
  config: DepartmentConfig
  departmentKey?: string
}

export function DepartmentPage({ config, departmentKey }: DepartmentPageProps) {
  const { currentBrand } = useBrand()
  const { toast } = useToast()
  const { mode } = useAppMode()

  const safeConfig = {
    ...config,
    commitments: config.commitments ?? [],
    tasks: config.tasks ?? [],
    powerMoves: config.powerMoves ?? [],
    victoryTargets: config.victoryTargets ?? [],
    weeklyReviews: config.weeklyReviews ?? [],
  }

  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [showPowerMoveModal, setShowPowerMoveModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCommitmentModal, setShowCommitmentModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [addAnotherVictory, setAddAnotherVictory] = useState(false)
  const [showUnifiedWIGSession, setShowUnifiedWIGSession] = useState(false)
  const [showWeeklyReview, setShowWeeklyReview] = useState(false)
  const [filterByMe, setFilterByMe] = useState(false)
  const [isTrackingLoading, setIsTrackingLoading] = useState(true)

  const currentUser = "Sarah M." // TODO: Replace with auth context
  // const [powerMoves, setPowerMoves] = useState<PowerMove[]>(safeConfig.powerMoves)
  const [powerMoves, setPowerMoves] = useState<PowerMove[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("this-week")
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterOption>(getCurrentQuarter())

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const monday = new Date(today)

    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    monday.setHours(0, 0, 0, 0)

    return monday
  })

  // useEffect(() => {
  //   setPowerMoves(safeConfig.powerMoves)
  //     // setIsTrackingLoading(true)
  // }, [safeConfig.powerMoves])

  useEffect(() => {
  setPowerMoves((prev) => {
    if (!prev || prev.length === 0) {
      return safeConfig.powerMoves
    }

    const prevIds = prev.map((pm) => pm.id).join(",")
    const incomingIds = safeConfig.powerMoves.map((pm) => pm.id).join(",")

    if (prevIds !== incomingIds) {
      return safeConfig.powerMoves
    }

    return prev
  })
}, [safeConfig.powerMoves])

  const powerMoveIds = useMemo(
    () => powerMoves.map((pm) => pm.id).filter(Boolean).join(","),
    [powerMoves],
  )

  const refreshPowerMoveTracking = async () => {
    // if (!powerMoveIds) return
    if (!powerMoveIds) {
  setIsTrackingLoading(false)
  return
}

    try {
      const response = await fetch(
        `/api/power-move-tracking?period=${encodeURIComponent(
          selectedPeriod,
        )}&powerMoveIds=${encodeURIComponent(powerMoveIds)}`,
        { cache: "no-store" },
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok || !Array.isArray(result.tracking)) return

      const trackingMap = new Map(
        result.tracking.map((row: any) => [row.power_move_id, row]),
      )

      setPowerMoves((prev) =>
        prev.map((pm) => {
          const tracked = trackingMap.get(pm.id)

          if (!tracked) return pm

          const actual = tracked.actual ?? 0
          const target = tracked.target ?? pm.targetPerCycle ?? pm.weeklyTarget ?? 1

          return {
            ...pm,
            progress: actual,
            weeklyActual: actual,
            targetPerCycle: target,
            weeklyTarget: target,
            activityCompleted: actual >= target,
          }
        }),
      )
    } catch (error) {
      console.error("Unable to refresh power move tracking", error)
    } finally{
      setIsTrackingLoading(false)
    }
  }

  useEffect(() => {
    // Always attempt a refresh — the function handles empty `powerMoveIds`
    // and will clear the `isTrackingLoading` flag when there's nothing to load.
    refreshPowerMoveTracking()
  }, [selectedPeriod, powerMoveIds])

  const handleNavigate = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart)

    if (selectedPeriod === "this-month" || selectedPeriod === "last-month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    } else if (selectedPeriod === "last-4-weeks") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 28 : -28))
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    }

    setCurrentWeekStart(newDate)
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)

    const today = new Date()
    const monday = new Date(today)
    const dayOfWeek = today.getDay()

    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    monday.setHours(0, 0, 0, 0)

    if (period === "last-week") {
      monday.setDate(monday.getDate() - 7)
    } else if (period === "this-month") {
      monday.setDate(1)
    } else if (period === "last-month") {
      const lastMonth = new Date(today)
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      lastMonth.setDate(1)
      setCurrentWeekStart(lastMonth)
      return
    } else if (period === "last-4-weeks") {
      monday.setDate(monday.getDate() - 28)
    }

    setCurrentWeekStart(monday)
  }

  const calculatedDepartmentScore = useMemo(
    () => calculateDepartmentScore(safeConfig.victoryTargets, powerMoves),
    [safeConfig.victoryTargets, powerMoves],
  )

  const updatedVictoryTargets = calculatedDepartmentScore.updatedTargets ?? []

  const filteredVictoryTargets = filterByMe
    ? updatedVictoryTargets.filter((vt) => vt.owner === currentUser)
    : updatedVictoryTargets

  const safeCommitments = safeConfig.commitments
  const safeTasks = safeConfig.tasks
  const safeVictoryTargets = safeConfig.victoryTargets

  const filteredPowerMoves = filterByMe
    ? powerMoves.filter((pm) => pm.owner === currentUser)
    : powerMoves

  const teamMembers = (config.users ?? []).map((user) => ({
    name: user.name,
    role: user.role,
  }))

  const departmentCodeMap: Record<string, "M" | "A" | "S" | "T" | "E" | "R" | "Y"> = {
    marketing: "M",
    accounts: "A",
    sales: "S",
    team: "T",
    execution: "E",
    rnd: "R",
    leadership: "Y",
  }

  const departmentCode = departmentKey ? departmentCodeMap[departmentKey] : undefined

  const handleSavePowerMove = async (data: PowerMoveFormData) => {
    if (!departmentCode) {
      throw new Error("Unable to determine department for this Power Move.")
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/power-moves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: currentBrand,
          department: departmentCode,
          name: data.title,
          frequency: data.frequency,
          weeklyTarget: data.targetPerCycle,
          owner: data.owner,
          ownerId: data.ownerId,
          linkedVictoryTargetId: data.linkedVictoryTargets[0] ?? undefined,
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.error || "Unable to create power move.")
      }

      const linkedTargetTitle =
        safeVictoryTargets.find((vt) => vt.id === data.linkedVictoryTargets[0])?.title || ""

      setPowerMoves((prev) => [
        {
          id: result?.id || `temp-${Date.now()}`,
          name: data.title,
          frequency: data.frequency,
          targetPerCycle: data.targetPerCycle,
          progress: 0,
          owner: data.owner,
          linkedVictoryTarget: linkedTargetTitle,
          weeklyTarget: data.targetPerCycle,
          weeklyActual: 0,
          activityCompleted: false,
        },
        ...prev,
      ])
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const bprMetrics: BPRMetric[] = updatedVictoryTargets.map((vt) => {
    const progress = Math.round((vt.achieved / vt.target) * 100)

    let status: "green" | "yellow" | "red" = "green"

    if (progress < 40) status = "red"
    else if (progress < 70) status = "yellow"

    

    return {
      label: vt.title,
      target: vt.target,
      actual: vt.achieved,
      unit: vt.unit || "",
      status,
    }
  })

  if (isTrackingLoading) {
  return <div>Loading department data...</div>
}

  return (
    <PageTransition>
      {showUnifiedWIGSession && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setShowUnifiedWIGSession(false)}
              className="mb-4"
            >
              Close
            </Button>

            <UnifiedWIGSession
              departmentName={config.name}
              previousWeekCommitments={safeCommitments}
              powerMoves={filteredPowerMoves}
            />
          </div>
        </div>
      )}

      {showWeeklyReview && (
        <div className="fixed inset-0 bg-background z-50 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setShowWeeklyReview(false)}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>

            <WeeklyReviewSession
              departmentName={config.name}
              powerMoves={filteredPowerMoves}
              tasks={safeTasks}
              commitments={safeCommitments}
            />
          </div>
        </div>
      )}

      <KeyboardShortcuts onQuickAdd={() => setShowVictoryModal(true)} />

      <DepartmentExecutionHero
        departmentName={config.name}
        victoryTargets={filteredVictoryTargets}
        powerMoves={powerMoves}
        calculatedScore={calculatedDepartmentScore}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        currentWeekStart={currentWeekStart}
        onNavigate={handleNavigate}
        onWeeklyReview={() => setShowWeeklyReview(true)}
        onAddPowerMove={() => setShowPowerMoveModal(true)}
        onAddTask={() => setShowTaskModal(true)}
        onAddCommitment={() => setShowCommitmentModal(true)}
        selectedQuarter={selectedQuarter}
        onQuarterChange={setSelectedQuarter}
        coreObjective={config.coreObjective}
        teamMembers={teamMembers}
      />

      <div className="max-w-7xl mx-auto px-4 py-2 text-xs font-semibold text-stone-500 border-t border-stone-200 mt-8">
        <p>
          <span className="font-semibold text-stone-600">Company Goal (Context):</span>{" "}
          Warrior Systems: 30 clients | Story Marketing: 10 clients{" "}
          <span className="text-stone-400 mx-2">•</span>{" "}
          {config.name} contributes via execution discipline
        </p>
      </div>

      <VictoryTargetModal
        open={showVictoryModal}
        onOpenChange={setShowVictoryModal}
        onSuccess={() => setShowVictoryModal(false)}
        addAnother={addAnotherVictory}
        setAddAnother={setAddAnotherVictory}
      />

      <PowerMoveModal
        open={showPowerMoveModal}
        onOpenChange={setShowPowerMoveModal}
        onSave={handleSavePowerMove}
        victoryTargets={updatedVictoryTargets}
      />

      <CreateTaskModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        onSave={() => setShowTaskModal(false)}
        teamMembers={teamMembers}
      />

      <CreateCommitmentModal
        open={showCommitmentModal}
        onOpenChange={setShowCommitmentModal}
        onSave={() => setShowCommitmentModal(false)}
        powerMoves={filteredPowerMoves}
        victoryTargets={filteredVictoryTargets}
        teamMembers={teamMembers}
      />
    </PageTransition>
  )
}