"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, TrendingUp, Plus, ArrowRight } from "lucide-react"
import type { PowerMove } from "./department-page"
import { getBPRStatus, getProgressPercentage } from "@/lib/bpr-status"
import { MicroCelebration } from "@/components/micro-celebration"
import { cn } from "@/lib/utils"

interface PowerMovesTableProps {
  powerMoves: PowerMove[]
  title?: string
  description?: string
  onAddPowerMove?: () => void
  isComplete?: boolean
}

export function PowerMovesTable({
  powerMoves: initialPowerMoves,
  title,
  description,
  onAddPowerMove,
  isComplete = false,
}: PowerMovesTableProps) {
  const [powerMoves, setPowerMoves] = useState(initialPowerMoves)
  const [celebration, setCelebration] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  })
  const [completionCount, setCompletionCount] = useState(0)

  useEffect(() => {
    setPowerMoves(initialPowerMoves)
    setCompletionCount(initialPowerMoves.filter((pm) => pm.progress >= pm.targetPerCycle).length)
  }, [initialPowerMoves])

  const incrementProgress = (id: string) => {
    setPowerMoves((prev) =>
      prev.map((pm) => {
        const targetPerCycle = Math.max(pm.targetPerCycle || 0, 1)
        if (pm.id === id && pm.progress < targetPerCycle) {
          const newProgress = pm.progress + 1
          const isNowComplete = newProgress >= targetPerCycle

          setCompletionCount((c) => c + 1)

          if (isNowComplete) {
            setCelebration({
              show: true,
              message: `${pm.name} Complete!`,
            })
          } else if (newProgress === Math.floor(targetPerCycle / 2)) {
            setCelebration({
              show: true,
              message: `Halfway there! ${newProgress}/${targetPerCycle}`,
            })
          } else if ((completionCount + 1) % 5 === 0) {
            setCelebration({
              show: true,
              message: `That's #${completionCount + 1} today!`,
            })
          }

          return { ...pm, progress: newProgress }
        }
        return pm
      }),
    )
  }

  const [showCompleted, setShowCompleted] = useState(false)
  
  const activePowerMoves = powerMoves.filter((pm) => pm.progress < pm.targetPerCycle)
  const completedPowerMoves = powerMoves.filter((pm) => pm.progress >= pm.targetPerCycle)
  
  const totalProgress = powerMoves.reduce((sum, pm) => sum + pm.progress, 0)
  const totalTarget = powerMoves.reduce((sum, pm) => sum + pm.targetPerCycle, 0)
  const allComplete = totalProgress >= totalTarget && totalTarget > 0

  return (
    <>
      <MicroCelebration
        show={celebration.show}
        message={celebration.message}
        onComplete={() => setCelebration({ show: false, message: "" })}
      />

      <div className="border rounded-lg overflow-hidden bg-white">
        {/* SECTION HEADER - Clear hierarchy */}
        <div className="px-4 py-4 border-b bg-stone-50 space-y-1">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-stone-600" />
            <h3 className="text-lg font-bold text-stone-900">{title || "Power Moves"}</h3>
            {powerMoves.length > 0 && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-stone-100 text-stone-600">
                {totalProgress} of {totalTarget} This Week
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500 ml-8">{description || "Lead measures that drive Victory Targets"}</p>
          {onAddPowerMove && (
            <Button onClick={onAddPowerMove} variant="ghost" size="sm" className="h-7 gap-1 text-stone-600 -ml-2 mt-2">
              <Plus className="h-4 w-4" />
              Add Power Move
            </Button>
          )}
        </div>

        {allComplete && powerMoves.length > 0 && (
          <div className="px-4 py-2 bg-stone-50 border-b">
            <p className="text-xs text-stone-500 italic">These Power Moves created this result.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePowerMoves.map((pm) => {
            const targetPerCycle = Math.max(pm.targetPerCycle || 0, 1)
            const progress = getProgressPercentage(pm.progress, targetPerCycle)
            const status = getBPRStatus(pm.progress, targetPerCycle)
            const isRowComplete = pm.progress >= targetPerCycle
            const completionLabel = isRowComplete ? "COMPLETED" : "IN PROGRESS"

            return (
              <div
                key={pm.id}
                className={cn(
                  "border-l-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:shadow-md transition-all",
                  status === "green" && "border-l-emerald-500 bg-emerald-50/30",
                  status === "yellow" && "border-l-amber-400 bg-amber-50/30",
                  status === "red" && "border-l-rose-400 bg-rose-50/30",
                )}
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-stone-800 truncate">{pm.name}</p>
                      <p className="text-xs text-stone-500 mt-1">{pm.owner}</p>
                    </div>
                    {pm.linkedVictoryTarget && (
                      <div className="flex-shrink-0 text-stone-300" title="Drives Victory Target">
                        <Target className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs font-bold px-2 py-1 bg-stone-100 text-stone-700 border border-stone-300">
                    {pm.frequency}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-600">Progress</span>
                    <span className="text-lg font-bold text-stone-800">{pm.progress}/{pm.targetPerCycle}</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full transition-all",
                        status === "green" ? "bg-emerald-600" : status === "yellow" ? "bg-amber-500" : "bg-rose-500"
                      )}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-stone-500 mt-2">{progress}%</p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Badge
                    className={cn(
                      "text-xs px-2 py-1 font-bold",
                      isRowComplete
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : "bg-stone-100 text-stone-700 border-stone-300",
                    )}
                  >
                    {completionLabel}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => incrementProgress(pm.id)}
                    disabled={isRowComplete}
                    className={cn(
                      "text-sm font-semibold transition-all",
                      isRowComplete
                        ? "bg-stone-100 text-stone-400 border-stone-200"
                        : "hover:bg-stone-100 border-stone-300 text-stone-700",
                    )}
                    aria-label={`Mark one ${pm.name} complete`}
                  >
                    {isRowComplete ? "✓" : "+1"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Completed Power Moves - Collapsible */}
        {completedPowerMoves.length > 0 && (
          <div className="border-t bg-stone-50">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-colors flex items-center justify-between"
            >
              <span>Show {completedPowerMoves.length} Completed Power Move{completedPowerMoves.length !== 1 ? 's' : ''}</span>
              <span className="text-stone-400">{showCompleted ? '▼' : '▶'}</span>
            </button>
            {showCompleted && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {completedPowerMoves.map((pm) => {
                  const targetPerCycle = Math.max(pm.targetPerCycle || 0, 1)
                  const progress = getProgressPercentage(pm.progress, targetPerCycle)

                  return (
                    <div
                      key={pm.id}
                      className="border-l-4 border-l-emerald-500 rounded-xl border border-stone-200 bg-emerald-50/20 p-4 shadow-sm"
                    >
                      <div className="mb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-stone-700 line-through truncate">{pm.name}</p>
                            <p className="text-xs text-stone-500 mt-1">{pm.owner}</p>
                          </div>
                          {pm.linkedVictoryTarget && (
                            <div className="flex-shrink-0 text-stone-300" title="Drives Victory Target">
                              <Target className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs font-bold px-2 py-1 bg-stone-100 text-stone-700 border border-stone-300">
                          {pm.frequency}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-600">{pm.progress}/{pm.targetPerCycle}</span>
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                          ✓
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {powerMoves.length === 0 && (
          <div className="text-center py-12 bg-white">
            <TrendingUp className="h-10 w-10 mx-auto text-stone-300 mb-3" />
            <p className="text-sm font-medium text-stone-500">Execution visibility is incomplete.</p>
            <p className="text-xs text-stone-400 mt-1">Add Power Moves to track lead measures.</p>
          </div>
        )}
      </div>
    </>
  )
}
