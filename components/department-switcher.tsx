"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MessageSquare, FileText, TrendingUp, Users, TargetIcon, Lightbulb, Award } from "lucide-react"

const departments = [
  { name: "Marketing", path: "/marketing", icon: MessageSquare, color: "#3b82f6" },
  { name: "Accounts", path: "/accounts", icon: FileText, color: "#8b5cf6" },
  { name: "Sales", path: "/sales", icon: TrendingUp, color: "#10b981" },
  { name: "Team Tools", path: "/team", icon: Users, color: "#f59e0b" },
  { name: "Execution", path: "/execution", icon: TargetIcon, color: "#ef4444" },
  { name: "R&D", path: "/rnd", icon: Lightbulb, color: "#06b6d4" },
  { name: "Leadership", path: "/leadership", icon: Award, color: "#ec4899" },
]

export function DepartmentSwitcher() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {departments.map((dept) => {
        const Icon = dept.icon
        const isActive = pathname === dept.path

        return (
          <Link
            key={dept.path}
            href={dept.path}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap",
              isActive ? "bg-primary text-primary-foreground shadow-sm" : "bg-background hover:bg-muted/50",
            )}
          >
            <Icon className="h-4 w-4" style={{ color: isActive ? undefined : dept.color }} />
            <span className="text-sm font-medium">{dept.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
