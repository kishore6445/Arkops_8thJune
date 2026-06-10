"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, CheckCircle2, XCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakDetailModalProps {
  isOpen: boolean
  onClose: () => void
  powerMoveId: string
  powerMoveName: string
  targetPerCycle: number
  frequency: "daily" | "weekly" | "monthly"
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return (d + 6) % 7 // Mon=0 … Sun=6
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type DayStatus = "completed" | "missed" | "today-missed" | "not-due" | "future" | "empty"

export function StreakDetailModal({
  isOpen,
  onClose,
  powerMoveId,
  powerMoveName,
  targetPerCycle,
  frequency,
}: StreakDetailModalProps) {
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [notes, setNotes] = useState("")

  // Stats — kept as mock matching existing component behaviour
  const thisWeek = 3
  const currentStreak = 3
  const bestStreak = 12
  const status = "On Track"

  // Dates that map to specific statuses (mock, same as before)
  const completedDates = new Set([10, 11, 12])
  const missedDates = new Set([13])
  const todayCircleDate = 14 // red-circled date (today in demo)

  function getDayStatus(day: number): DayStatus {
    const d = new Date(calYear, calMonth, day)
    const dow = d.getDay() // 0=Sun 6=Sat
    const isWeekend = dow === 0 || dow === 6
    if (isWeekend) return "not-due"
    if (completedDates.has(day)) return "completed"
    if (missedDates.has(day)) return "missed"
    if (day === todayCircleDate) return "today-missed"
    if (d > today) return "future"
    return "not-due"
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDow = getFirstDayOfMonth(calYear, calMonth)

  // Build cells: leading empties + real days
  const calCells: Array<{ day: number | null; status: DayStatus }> = []
  for (let i = 0; i < firstDow; i++) calCells.push({ day: null, status: "empty" })
  for (let d = 1; d <= daysInMonth; d++) calCells.push({ day: d, status: getDayStatus(d) })

  const historyRows = [
    { label: "Jun 10, 2026 (Mon)", status: "completed" as const },
    { label: "Jun 11, 2026 (Tue)", status: "completed" as const },
    { label: "Jun 12, 2026 (Wed)", status: "completed" as const },
    { label: "Jun 13, 2026 (Thu)", status: "missed" as const },
    { label: "Jun 14, 2026 (Fri)", status: "not-completed" as const },
  ]

  function goNextMonth() {
    const d = new Date(calYear, calMonth + 1, 1)
    setCalYear(d.getFullYear())
    setCalMonth(d.getMonth())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden rounded-xl border border-gray-200 shadow-2xl w-full"
        style={{ maxWidth: "820px", width: "90vw" }}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900 leading-snug">{powerMoveName}</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {frequency}&nbsp;&bull;&nbsp;{targetPerCycle} times per week&nbsp;&bull;&nbsp;Owner: Kishore
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="mx-6 mb-4 rounded-xl border border-gray-200 grid grid-cols-4 divide-x divide-gray-200">
          {/* This Week */}
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">This Week</p>
            <p className="text-[26px] font-bold text-gray-900 leading-none">
              {thisWeek}&nbsp;<span className="text-[16px] font-normal text-gray-400">/ {targetPerCycle}</span>
            </p>
            <p className="text-[12px] text-gray-500 mt-1">completed</p>
          </div>

          {/* Current Streak */}
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Current Streak</p>
            <p className="text-[26px] font-bold text-gray-900 leading-none">
              {currentStreak}&nbsp;<span className="text-[18px]">🔥</span>
            </p>
            <p className="text-[12px] text-gray-500 mt-1">days</p>
          </div>

          {/* Best Streak */}
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Best Streak</p>
            <p className="text-[26px] font-bold text-gray-900 leading-none">
              {bestStreak}&nbsp;<span className="text-[18px]">🏆</span>
            </p>
            <p className="text-[12px] text-gray-500 mt-1">days</p>
          </div>

          {/* Status */}
          <div className="px-5 py-4">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Status</p>
            <span className="inline-block px-4 py-1.5 rounded-lg border border-emerald-400 text-emerald-600 text-[13px] font-semibold bg-white mt-1">
              {status}
            </span>
          </div>
        </div>

        {/* ── Body: Calendar + History ── */}
        <div className="px-6 pb-6 flex gap-6 items-start">

          {/* Left: Calendar */}
          <div className="flex-1 min-w-0">
            {/* Month nav */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[15px] font-bold text-gray-900">
                {MONTH_NAMES[calMonth]} {calYear}
              </span>
              <button
                onClick={goNextMonth}
                className="p-0.5 rounded hover:bg-gray-100 text-gray-400 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {/* Day-of-week headers */}
              {WEEKDAY_HEADERS.map((h) => (
                <div key={h} className="text-center text-[12px] font-semibold text-gray-500 pb-2">
                  {h}
                </div>
              ))}

              {/* Day cells */}
              {calCells.map((cell, idx) => {
                if (cell.day === null) {
                  return <div key={`e-${idx}`} className="h-10" />
                }

                if (cell.status === "completed") {
                  return (
                    <div key={cell.day} className="flex items-center justify-center h-10">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                        <CheckCircle2 className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
                      </span>
                    </div>
                  )
                }

                if (cell.status === "today-missed") {
                  // Red-circled number (like "14" in image)
                  return (
                    <div key={cell.day} className="flex items-center justify-center h-10">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-400 text-[13px] font-semibold text-gray-700">
                        {cell.day}
                      </span>
                    </div>
                  )
                }

                if (cell.status === "missed") {
                  // Number with small red X badge
                  return (
                    <div key={cell.day} className="relative flex items-center justify-center h-10">
                      <span className="text-[13px] font-medium text-gray-700">{cell.day}</span>
                      <span className="absolute top-1 right-1">
                        <XCircle className="h-3.5 w-3.5 text-red-500" fill="white" />
                      </span>
                    </div>
                  )
                }

                // future / not-due — plain number
                return (
                  <div key={cell.day} className="flex items-center justify-center h-10">
                    <span className={cn(
                      "text-[13px] font-medium",
                      cell.status === "future" ? "text-gray-400" : "text-gray-600"
                    )}>
                      {cell.day}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-emerald-500">
                  <CheckCircle2 className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
                <span className="text-[12px] text-gray-500">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-[14px] w-[14px] text-red-500" />
                <span className="text-[12px] text-gray-500">Missed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-[14px] w-[14px] rounded-full border-2 border-gray-300 bg-white inline-block" />
                <span className="text-[12px] text-gray-500">Not Due / Future</span>
              </div>
            </div>
          </div>

          {/* Right: History + Notes */}
          <div className="w-[220px] flex-shrink-0 flex flex-col gap-5">
            {/* History */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[13px] font-semibold text-gray-700">History (This Cycle)</p>
              </div>
              <div className="divide-y divide-gray-100">
                {historyRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-4 py-2.5 gap-2">
                    <span className="text-[12px] text-gray-600 leading-snug">{row.label}</span>
                    {row.status === "completed" && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[12px] font-medium text-gray-700">Completed</span>
                        <CheckCircle2 className="h-[14px] w-[14px] text-emerald-500" strokeWidth={2.5} />
                      </div>
                    )}
                    {row.status === "missed" && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[12px] font-semibold text-red-500">Missed</span>
                        <XCircle className="h-[14px] w-[14px] text-red-500" />
                      </div>
                    )}
                    {row.status === "not-completed" && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[12px] text-gray-400">Not Completed</span>
                        <span className="h-[14px] w-[14px] rounded-full border-2 border-gray-300 flex-shrink-0 inline-block" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-[13px] font-semibold text-gray-700 mb-2">Notes (Optional)</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes here..."
                className="w-full h-[88px] text-[13px] text-gray-600 placeholder:text-gray-400 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-colors"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
