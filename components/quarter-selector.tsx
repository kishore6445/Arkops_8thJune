"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Quarter, getCurrentQuarter } from "@/lib/brand-structure"

export type QuarterOption = Quarter | "annual"

interface QuarterSelectorProps {
  selectedQuarter: QuarterOption
  onQuarterChange: (quarter: QuarterOption) => void
  className?: string
  variant?: "default" | "compact"
}

export function QuarterSelector({
  selectedQuarter,
  onQuarterChange,
  className,
  variant = "default",
}: QuarterSelectorProps) {
  const currentQuarter = getCurrentQuarter()
  const quarters: QuarterOption[] = ["annual", "Q1", "Q2", "Q3", "Q4"]

  const getQuarterLabel = (q: QuarterOption) => {
    if (q === "annual") return "Full Year"
    const quarterRanges = {
      Q1: "Jan - Mar",
      Q2: "Apr - Jun",
      Q3: "Jul - Sep",
      Q4: "Oct - Dec",
    }
    return `${q} (${quarterRanges[q]})`
  }

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={cn("gap-1.5 text-xs h-7 px-2", className)}>
            <Calendar className="h-3 w-3" />
            <span>{selectedQuarter === "annual" ? "Annual" : selectedQuarter}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {quarters.map((q) => (
            <DropdownMenuItem
              key={q}
              onClick={() => onQuarterChange(q)}
              className={cn("flex items-center justify-between text-sm", selectedQuarter === q && "bg-stone-100")}
            >
              <span>{getQuarterLabel(q)}</span>
              {q === currentQuarter && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded">Now</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("gap-2 bg-white border-stone-200 text-stone-700", className)}>
          <Calendar className="h-4 w-4 text-stone-500" />
          <span>{selectedQuarter === "annual" ? "Full Year" : selectedQuarter}</span>
          {selectedQuarter === currentQuarter && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Current</span>
          )}
          <ChevronDown className="h-3 w-3 text-stone-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {quarters.map((q) => (
          <DropdownMenuItem
            key={q}
            onClick={() => onQuarterChange(q)}
            className={cn("flex items-center justify-between", selectedQuarter === q && "bg-stone-100")}
          >
            <span>{getQuarterLabel(q)}</span>
            {q === currentQuarter && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Now</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
