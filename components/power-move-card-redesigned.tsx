"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MoreVertical, CheckCircle2 } from "lucide-react"
import { StreakDetailModal } from "@/components/power-move-streak-detail-modal"

interface PowerMove {
  id: string
  name: string
  frequency?: string
  targetPerCycle?: number
  progress?: number
  owner?: string
  weeklyTarget?: number
  weeklyActual?: number
  activityCompleted?: boolean
  linkedVictoryTarget?: string
}

interface PowerMoveCardRedesignedProps {
  pm: PowerMove
  target: number
  actual: number
  onComplete?: (id: string) => void
  isPrimary?: boolean
}

// Deterministic color from name first char — no random on render
const AVATAR_COLORS: Record<string, string> = {
  A: "bg-emerald-600", B: "bg-blue-600", C: "bg-purple-600", D: "bg-emerald-600",
  E: "bg-orange-600", F: "bg-pink-600", G: "bg-teal-600", H: "bg-red-600",
  I: "bg-indigo-600", J: "bg-yellow-600", K: "bg-cyan-600", L: "bg-lime-600",
  M: "bg-violet-600", N: "bg-sky-600", O: "bg-rose-600", P: "bg-fuchsia-600",
  Q: "bg-emerald-600", R: "bg-blue-600", S: "bg-amber-600", T: "bg-blue-600",
  U: "bg-green-600", V: "bg-purple-600", W: "bg-teal-600", X: "bg-red-600",
  Y: "bg-indigo-600", Z: "bg-gray-600",
}

function getAvatarColor(name: string) {
  const letter = (name?.[0] || "A").toUpperCase()
  return AVATAR_COLORS[letter] ?? "bg-emerald-600"
}

// Weekday chain — mock for now, Mon–Fri
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"]

function WeekdayDot({ completed, day }: { completed: boolean; day: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[11px] font-medium text-gray-500 leading-none">{day}</span>
      {completed ? (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
          <CheckCircle2 className="h-4 w-4 text-white" strokeWidth={2.5} />
        </span>
      ) : (
        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-200 bg-white" />
      )}
    </div>
  )
}

export function PowerMoveCardRedesigned({
  pm,
  target,
  actual,
  onComplete,
  isPrimary = false,
}: PowerMoveCardRedesignedProps) {
  const [streakOpen, setStreakOpen] = useState(false)
  const progressPct = target > 0 ? Math.min((actual / target) * 100, 100) : 0
  const avatarBg = getAvatarColor(pm.name)
  const avatarLetter = (pm.name?.[0] || "?").toUpperCase()

  // Derive completed days from actual count (leftmost days first)
  const completedDays = Math.min(actual, 5)

  // Mock streak data — same as original component
  const currentStreak = 3
  const bestStreak = 12
  const missedDays = WEEKDAYS.slice(completedDays, 5)
  const status = progressPct >= 60 ? "On Track" : progressPct >= 30 ? "At Risk" : "Missed"
  const isOnTrack = status === "On Track"

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* ── Row 1: Avatar + Title + Actions ── */}
        <div className="px-5 pt-5 pb-3 flex items-start gap-3">
          {/* Avatar */}
          <div className={cn("h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-base", avatarBg)}>
            {avatarLetter}
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {isPrimary && (
                <Badge className="bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-semibold px-2 py-0 rounded-sm h-5">
                  Primary
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-[15px] leading-snug text-gray-900">{pm.name}</h3>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {pm.frequency ?? "weekly"} &bull; {target} times per week &bull; Owner: {pm.owner ?? "—"}
            </p>
          </div>

          {/* Top-right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setStreakOpen(true)}
              className="text-[13px] font-medium text-blue-600 hover:text-blue-700 hover:underline whitespace-nowrap"
            >
              View Streak
            </button>
            <button className="p-1 rounded hover:bg-gray-100 text-gray-400">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Mark Today Complete button ── */}
        <div className="px-5 pb-3">
          <button
            onClick={() => onComplete?.(pm.id)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-[13px] font-semibold rounded-lg px-4 py-2 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
            Mark Today Complete
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-100 mx-5" />

        {/* ── Stats Row ── */}
        <div className="px-5 pt-4 pb-5 grid grid-cols-[1fr_1.4fr_auto_auto] gap-x-6 gap-y-0 items-start">

          {/* This Week Progress */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide leading-none">This Week Progress</p>
            <p className="text-[22px] font-bold text-gray-900 leading-none">
              {actual} <span className="text-gray-400 font-normal">/ {target}</span>
            </p>
            <p className="text-[12px] text-gray-500 leading-none">completed</p>
            {/* progress bar */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[12px] font-medium text-gray-500 whitespace-nowrap">{Math.round(progressPct)}%</span>
            </div>
          </div>

          {/* Weekly Chain Mon–Fri */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide leading-none">Weekly Chain (Mon–Fri)</p>
            <div className="flex items-end gap-3 pt-1">
              {WEEKDAYS.map((day, i) => (
                <WeekdayDot key={day} day={day} completed={i < completedDays} />
              ))}
            </div>
          </div>

          {/* Current Streak + Best Streak */}
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide leading-none">Current Streak</p>
              <p className="text-[22px] font-bold text-orange-500 leading-tight mt-1">
                {currentStreak} days <span className="text-base">&#128293;</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide leading-none">Missed Days</p>
              <p className="text-[13px] font-semibold text-red-500 mt-1">
                {missedDays.length === 0 ? "None" : missedDays.join(", ")}
              </p>
            </div>
          </div>

          {/* Best Streak + Status */}
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide leading-none">Best Streak</p>
              <p className="text-[22px] font-bold text-yellow-500 leading-tight mt-1">
                {bestStreak} days <span className="text-base">&#127942;</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide leading-none">Status</p>
              <span className={cn(
                "inline-block mt-1 px-3 py-1 rounded-md text-[13px] font-semibold",
                isOnTrack ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
              )}>
                {status}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Streak Detail Modal */}
      <StreakDetailModal
        isOpen={streakOpen}
        onClose={() => setStreakOpen(false)}
        powerMoveId={pm.id}
        powerMoveName={pm.name}
        targetPerCycle={target}
        frequency={(pm.frequency as any) ?? "weekly"}
      />
    </>
  )
}
