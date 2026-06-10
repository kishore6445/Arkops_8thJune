/**
 * Power Move Preview Utilities
 * Generates preview data for the Add/Edit Power Move modal
 */

type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"

export interface WeekPreviewDay {
  day: DayOfWeek
  status: "completed" | "notdue"
}

export interface CalendarDay {
  date: number
  status: "completed" | "missed" | "notdue" | "future"
}

export interface PreviewData {
  frequency: string
  target: number
  weeklyView: WeekPreviewDay[]
  monthlyCalendar: CalendarDay[]
  startDate: string
  firstCycleEnd: string
}

/**
 * Generate a sample weekly view for preview
 * Shows Mon-Fri with some completed days for visual reference
 */
export function generateWeeklyPreview(customDays?: string[]): WeekPreviewDay[] {
  const days: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri"]
  
  if (customDays && customDays.length > 0) {
    return days.map(day => ({
      day,
      status: customDays.includes(day) ? "completed" : "notdue"
    }))
  }

  // Default preview pattern: completed on Mon, Tue, Wed
  return days.map(day => ({
    day,
    status: ["Mon", "Tue", "Wed"].includes(day) ? "completed" : "notdue"
  }))
}

/**
 * Generate a sample monthly calendar for preview
 * Shows June 2026 as example with some completed/missed days
 */
export function generateMonthlyPreview(): CalendarDay[] {
  const daysInJune = 30
  const calendar: CalendarDay[] = []
  
  // Pattern: some completed, some missed, some not due
  const completedDates = [10, 11, 12, 17, 18, 19]
  const missedDates = [14, 24, 31]
  
  for (let i = 1; i <= daysInJune; i++) {
    let status: "completed" | "missed" | "notdue" | "future"
    if (completedDates.includes(i)) {
      status = "completed"
    } else if (missedDates.includes(i)) {
      status = "missed"
    } else if (i <= 12) {
      status = "notdue"
    } else {
      status = "future"
    }
    calendar.push({ date: i, status })
  }
  
  return calendar
}

/**
 * Generate complete preview data for the modal
 */
export function generatePreviewData(
  frequency: string,
  target: number,
  startDate?: Date,
  customDays?: string[]
): PreviewData {
  const start = startDate || new Date(2026, 5, 10) // June 10, 2026
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  
  return {
    frequency,
    target,
    weeklyView: generateWeeklyPreview(customDays),
    monthlyCalendar: generateMonthlyPreview(),
    startDate: start.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    firstCycleEnd: end.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }
}
