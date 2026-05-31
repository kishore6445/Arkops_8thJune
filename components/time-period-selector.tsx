"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface TimePeriodSelectorProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  currentWeekStart: Date
  onNavigate: (direction: "prev" | "next") => void
}

export function TimePeriodSelector({
  selectedPeriod,
  onPeriodChange,
  currentWeekStart,
  onNavigate,
}: TimePeriodSelectorProps) {
  const getWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}, ${startDate.getFullYear()}`
  }

  const getMonthRange = (startDate: Date) => {
    return startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getDisplayText = () => {
    if (selectedPeriod === "this-week" || selectedPeriod === "custom") {
      return `Week of ${getWeekRange(currentWeekStart)}`
    } else if (selectedPeriod === "this-month") {
      return `Month of ${getMonthRange(currentWeekStart)}`
    } else if (selectedPeriod === "last-4-weeks") {
      const fourWeeksAgo = new Date(currentWeekStart)
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
      return `Last 4 Weeks: ${getWeekRange(fourWeeksAgo).split(",")[0]} - ${getWeekRange(currentWeekStart).split("-")[1]}`
    }
    return getWeekRange(currentWeekStart)
  }

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3 bg-muted/10 border-b border-border/30">
      <div className="flex items-center gap-3">
        <Calendar className="h-4 w-4 text-muted-foreground/40" />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("prev")}
            className="h-7 w-7 p-0"
            aria-label="Previous period"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm font-medium text-muted-foreground/60 min-w-[280px] text-center">
            {getDisplayText()}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("next")}
            className="h-8 w-8 p-0"
            aria-label="Next period"
            disabled={selectedPeriod === "this-week" && new Date(currentWeekStart) >= new Date()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-[160px] h-8 text-sm border-border/30">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="last-week">Last Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="last-4-weeks">Last 4 Weeks</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
