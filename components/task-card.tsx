"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Trash2, Edit2, Calendar, User, AlertCircle, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/brand-structure"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onComplete?: (taskId: string) => void
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

const PRIORITY_COLORS = {
  high: { badge: "bg-red-100 text-red-700" },
  medium: { badge: "bg-amber-100 text-amber-700" },
  low: { badge: "bg-blue-100 text-blue-700" },
}

const STATUS_COLORS = {
  pending: { badge: "bg-amber-100 text-amber-700", border: "border-l-4 border-l-amber-500" },
  completed: { badge: "bg-emerald-100 text-emerald-700", border: "border-l-4 border-l-emerald-500" },
}

export function TaskCard({ task, onComplete, onEdit, onDelete }: TaskCardProps) {
  const [isHovering, setIsHovering] = useState(false)
  const isCompleted = task.status === "completed"
  const statusColor = STATUS_COLORS[task.status]
  const priorityColor = PRIORITY_COLORS[task.priority]

  // Format due date
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  const isOverdue = dueDate < today && !isCompleted
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div
      className={cn(
        "bg-white rounded-lg border transition-all p-4 flex items-center justify-between gap-4",
        statusColor.border,
        isCompleted ? "bg-gray-50 border-gray-200" : "border-gray-200",
        isHovering && !isCompleted ? "shadow-md" : "shadow-sm"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Left: Checkbox + Title + Details */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {/* Checkbox */}
        <button
          onClick={() => onComplete?.(task.id)}
          className="mt-0.5 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
          aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>

        {/* Title + Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn("font-semibold text-sm", isCompleted ? "line-through text-gray-500" : "text-gray-900")}>
              {task.title}
            </h3>
            {isOverdue && !isCompleted && (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            {/* Due Date */}
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {isOverdue && !isCompleted ? "Overdue " : ""}
                {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {daysUntilDue > 0 && !isCompleted && ` (${daysUntilDue}d)`}
              </span>
            </div>

            {/* Owner */}
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{task.owner}</span>
            </div>

            {/* Priority Badge */}
            <Badge className={cn("text-xs px-2 py-0.5", priorityColor.badge)}>
              {task.priority}
            </Badge>
          </div>
        </div>
      </div>

      {/* Right: Status + Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Status Badge */}
        <Badge className={cn("text-xs font-semibold px-2 py-0.5", statusColor.badge)}>
          {isCompleted ? "Completed" : "Pending"}
        </Badge>

        {/* Action Buttons - Show on hover */}
        {isHovering && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => onEdit?.(task)}
              title="Edit task"
            >
              <Edit2 className="w-4 h-4 text-gray-600 hover:text-gray-900" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => onDelete?.(task.id)}
              title="Delete task"
            >
              <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
