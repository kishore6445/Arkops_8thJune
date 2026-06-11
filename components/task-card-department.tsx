"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/brand-structure"
import { cn } from "@/lib/utils"

interface TaskCardDepartmentProps {
  task: Task
  onComplete?: (taskId: string) => void
}

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
}

export function TaskCardDepartment({ task, onComplete }: TaskCardDepartmentProps) {
  const isCompleted = task.status === "completed"
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  const isOverdue = dueDate < today && !isCompleted

  return (
    <div className="bg-white rounded-lg border border-stone-200/60 shadow-sm p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            onClick={() => onComplete?.(task.id)}
            className="mt-0.5 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            )}
          </button>
          <h3 className={cn("text-sm font-semibold line-clamp-2", isCompleted ? "line-through text-gray-500" : "text-gray-900")}>
            {task.title}
          </h3>
        </div>
        <Badge className={cn("text-xs px-2 py-0.5 flex-shrink-0", PRIORITY_COLORS[task.priority])}>
          {task.priority}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-gray-600">
        <span>{dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        <span>{task.owner}</span>
        {isOverdue && !isCompleted && <span className="text-red-500 font-semibold">Overdue</span>}
        <Badge
          className={cn(
            "text-xs px-2 py-0.5",
            isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          )}
        >
          {isCompleted ? "Done" : "Pending"}
        </Badge>
      </div>
    </div>
  )
}
