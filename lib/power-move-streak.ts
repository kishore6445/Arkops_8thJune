export type StreakDay = {
  date: Date
  dayName: string
  status: "completed" | "missed" | "future"
  shortDay: string
}

export type StreakStats = {
  thisWeek: number
  currentStreak: number
  bestStreak: number
  missedDays: string[]
  status: "on-track" | "at-risk" | "missed"
  weekDays: StreakDay[]
}

/**
 * Get the start of week (Monday) for a given date
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

/**
 * Get all dates in the current week
 */
export function getWeekDates(): Date[] {
  const weekStart = getWeekStart()
  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + i)
    dates.push(date)
  }
  return dates
}

/**
 * Format a date as YYYY-MM-DD for database queries
 */
export function formatDateForDB(date: Date): string {
  return date.toISOString().split("T")[0]
}

/**
 * Parse database date string to Date
 */
export function parseDBDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z")
}

/**
 * Calculate streak statistics from daily tracking data
 */
export function calculateStreakStats(
  trackingData: Array<{ date: string; completed: boolean }>,
  targetPerCycle: number,
  frequency: "daily" | "weekly" | "monthly",
): StreakStats {
  const today = new Date()
  const weekStart = getWeekStart()
  const weekDates = getWeekDates()

  // Build completion map for quick lookup
  const completionMap = new Map<string, boolean>()
  trackingData.forEach((item) => {
    completionMap.set(item.date, item.completed)
  })

  // Weekly completion
  const weekDays: StreakDay[] = weekDates.map((date) => {
    const dateStr = formatDateForDB(date)
    const completed = completionMap.get(dateStr) ?? false
    const isToday = formatDateForDB(today) === dateStr
    const isFuture = date > today

    return {
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
      shortDay: date.toLocaleDateString("en-US", { weekday: "narrow" }),
      status: isFuture ? "future" : completed ? "completed" : "missed",
    }
  })

  const thisWeek = weekDays.filter((d) => d.status === "completed").length
  const missedDays = weekDays
    .filter((d) => d.status === "missed")
    .map((d) => d.dayName.slice(0, 3))

  // Calculate streaks (from most recent backward)
  let currentStreak = 0
  let bestStreak = 0
  let tempStreak = 0

  // Sort by date descending
  const sortedTracking = [...trackingData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  for (const item of sortedTracking) {
    if (item.completed) {
      tempStreak++
      bestStreak = Math.max(bestStreak, tempStreak)

      // Current streak is from today backward
      const itemDate = parseDBDate(item.date)
      if (itemDate <= today) {
        currentStreak = tempStreak
      }
    } else {
      tempStreak = 0
    }
  }

  // Determine status
  let status: "on-track" | "at-risk" | "missed" = "on-track"
  if (thisWeek >= targetPerCycle) {
    status = "on-track"
  } else if (thisWeek >= targetPerCycle * 0.5) {
    status = "at-risk"
  } else {
    status = "missed"
  }

  return {
    thisWeek,
    currentStreak,
    bestStreak,
    missedDays,
    status,
    weekDays,
  }
}

/**
 * Get day status icon
 */
export function getDayStatusIcon(status: "completed" | "missed" | "future"): string {
  switch (status) {
    case "completed":
      return "✅"
    case "missed":
      return "❌"
    case "future":
      return "⬜"
  }
}

/**
 * Get status badge color
 */
export function getStatusColor(status: "on-track" | "at-risk" | "missed"): string {
  switch (status) {
    case "on-track":
      return "bg-green-100 text-green-800"
    case "at-risk":
      return "bg-yellow-100 text-yellow-800"
    case "missed":
      return "bg-red-100 text-red-800"
  }
}
