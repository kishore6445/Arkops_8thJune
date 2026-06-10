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

// Calendar helpers
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  // 0=Sun…6=Sat → convert to Mon=0
  const d = new Date(year, month, 1).getDay()
  return (d + 6) % 7 // Mon-based
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]
const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type DayStatus = "completed" | "missed" | "not-due" | "future" | "empty"

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

  // Mock data — same pattern as existing component
  const thisWeek = 3
  const currentStreak = 3
  const bestStreak = 12
  const status = "On Track"

  // Mock day statuses: 10,11,12 completed; 13 missed; 14 missed (today); rest not-due or future
  const mockCompletedDates = new Set([10, 11, 12])
  const mockMissedDates = new Set([13])
  const mockTodayDate = 14

  function getDayStatus(day: number, monthOffset = 0): DayStatus {
    if (monthOffset !== 0) return "not-due"
    const d = new Date(calYear, calMonth, day)
    const dow = d.getDay() // 0=Sun,6=Sat
    const isWeekend = dow === 0 || dow === 6
    if (isWeekend) return "not-due"
    if (d > today) return "future"
    if (mockCompletedDates.has(day)) return "completed"
    if (mockMissedDates.has(day)) return "missed"
    if (day === mockTodayDate) return "missed"
    return "not-due"
  }

  // Build calendar grid
  const daysInMonth = getDaysInMonth(calYear, calMonth)
  const firstDow = getFirstDayOfMonth(calYear, calMonth) // 0=Mon
  const calCells: Array<{ day: number | null; status: DayStatus }> = []
  for (let i = 0; i < firstDow; i++) calCells.push({ day: null, status: "empty" })
  for (let d = 1; d <= daysInMonth; d++) calCells.push({ day: d, status: getDayStatus(d) })

  // Mock history rows for "History (This Cycle)"
  const historyRows = [
    { label: "Jun 10, 2026 (Mon)", status: "completed" },
    { label: "Jun 11, 2026 (Tue)", status: "completed" },
    { label: "Jun 12, 2026 (Wed)", status: "completed" },
    { label: "Jun 13, 2026 (Thu)", status: "missed" },
    { label: "Jun 14, 2026 (Fri)", status: "not-completed" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-0 gap-0 overflow-hidden rounded-2xl border border-gray-200 shadow-xl">

        {/* ── Modal Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900">{powerMoveName}</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {frequency} &bull; {targetPerCycle} times per week &bull; Owner: Kishore
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 mt-0.5"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Stats Row ── */}
        <div className="px-6 py-5 grid grid-cols-4 gap-4 border-b border-gray-100">
          {/* This Week */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">This Week</p>
            <p className="text-[28px] font-bold text-gray-900 leading-tight mt-1">
              {thisWeek} <span className="text-[18px] text-gray-400 font-normal">/ {targetPerCycle}</span>
            </p>
            <p className="text-[12px] text-gray-500">completed</p>
          </div>
          {/* Current Streak */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Current Streak</p>
            <p className="text-[28px] font-bold text-orange-500 leading-tight mt-1">
              {currentStreak} <span className="text-base">&#128293;</span>
            </p>
            <p className="text-[12px] text-gray-500">days</p>
          </div>
          {/* Best Streak */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Best Streak</p>
            <p className="text-[28px] font-bold text-yellow-500 leading-tight mt-1">
              {bestStreak} <span className="text-base">&#127942;</span>
            </p>
            <p className="text-[12px] text-gray-500">days</p>
          </div>
          {/* Status */}
          <div>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</p>
            <div className="mt-2">
              <span className="inline-block px-4 py-1.5 rounded-md bg-emerald-100 text-emerald-700 text-[13px] font-semibold">
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* ── Calendar + History two-column ── */}
        <div className="px-6 py-5 flex gap-6">

          {/* Left: Calendar */}
          <div className="flex-1 min-w-0">
            {/* Month nav */}
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-[15px] font-bold text-gray-900">
                {MONTH_NAMES[calMonth]} {calYear}
              </h3>
              <button
                className="p-0.5 rounded hover:bg-gray-100 text-gray-400"
                onClick={() => {
                  const d = new Date(calYear, calMonth + 1, 1)
                  setCalYear(d.getFullYear()); setCalMonth(d.getMonth())
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {WEEKDAY_HEADERS.map(h => (
                <div key={h} className="text-center text-[11px] font-semibold text-gray-400 pb-1">{h}</div>
              ))}
              {/* Cells */}
              {calCells.map((cell, idx) => {
                if (cell.day === null) {
                  return <div key={`empty-${idx}`} />
                }
                const isToday = cell.day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                return (
                  <div key={cell.day} className="flex items-center justify-center h-9">
                    {cell.status === "completed" ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                        <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                      </span>
                    ) : cell.status === "missed" ? (
                      <div className="relative flex h-8 w-8 items-center justify-center">
                        <span className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold",
                          isToday ? "border-2 border-red-400 text-gray-700" : "text-gray-600"
                        )}>
                          {cell.day}
                        </span>
                        {!isToday && (
                          <span className="absolute -top-0.5 -right-0.5">
                            <XCircle className="h-3.5 w-3.5 text-red-500 fill-white" />
                          </span>
                        )}
                        {isToday && (
                          <span className="absolute -top-0.5 -right-0.5">
                            <XCircle className="h-3.5 w-3.5 text-red-500 fill-white" />
                          </span>
                        )}
                      </div>
                    ) : cell.status === "future" || cell.status === "not-due" ? (
                      <span className="text-[13px] text-gray-400">{cell.day}</span>
                    ) : (
                      <span className="text-[13px] text-gray-700">{cell.day}</span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Calendar legend */}
            <div className="flex items-center gap-5 mt-4">
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                  <CheckCircle2 className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
                <span className="text-[12px] text-gray-500">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-[12px] text-gray-500">Missed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full border border-gray-300 bg-white" />
                <span className="text-[12px] text-gray-500">Not Due / Future</span>
              </div>
            </div>
          </div>

          {/* Right: History + Notes */}
          <div className="w-56 flex-shrink-0 space-y-4">
            <div>
              <h3 className="text-[13px] font-bold text-gray-900 mb-3">History (This Cycle)</h3>
              <div className="space-y-2">
                {historyRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-gray-600">{row.label}</span>
                    {row.status === "completed" ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[12px] font-medium text-gray-700">Completed</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                      </div>
                    ) : row.status === "missed" ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[12px] font-semibold text-red-500">Missed</span>
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[12px] text-gray-400">Not Completed</span>
                        <span className="h-4 w-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-[13px] font-bold text-gray-900 mb-2">Notes (Optional)</h3>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add any notes here..."
                className="w-full h-24 text-[13px] text-gray-600 placeholder:text-gray-400 border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
