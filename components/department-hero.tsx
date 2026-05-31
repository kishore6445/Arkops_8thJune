"use client"

import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DepartmentHeroProps {
  name: string
  icon: LucideIcon
  wig: string
  status: "on-track" | "at-risk" | "behind"
  color: string
}

export function DepartmentHero({ name, icon: Icon, wig, status, color }: DepartmentHeroProps) {
  const statusColors = {
    "on-track": "bg-emerald-500/10 text-emerald-700 border-emerald-200",
    "at-risk": "bg-amber-500/10 text-amber-700 border-amber-200",
    behind: "bg-red-500/10 text-red-700 border-red-200",
  }

  const statusLabels = {
    "on-track": "On Track",
    "at-risk": "At Risk",
    behind: "Behind",
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-muted/30 border border-border/50 mb-8">
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent 70%)`,
        }}
      />

      <div className="relative px-8 py-6 sm:px-12 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* Icon Circle - reduced size */}
          <div
            className={cn(
              "flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-3xl transition-all duration-300",
              "shadow-lg shadow-black/5",
            )}
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-8 w-8 sm:h-9 sm:w-9" style={{ color }} strokeWidth={1.5} />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">{name}</h1>
              <Badge variant="outline" className={cn("font-medium", statusColors[status])}>
                {statusLabels[status]}
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground font-light max-w-3xl leading-relaxed">{wig}</p>
          </div>
        </div>
      </div>

      {/* Bottom subtle line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
