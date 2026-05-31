import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import type { Task } from "@/components/department-page"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const statusConfig = {
    done: {
      icon: CheckCircle2,
      label: "Done",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    "in-progress": {
      icon: Circle,
      label: "In Progress",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    todo: {
      icon: Circle,
      label: "To Do",
      color: "text-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200",
    },
  }

  const config = statusConfig[task.status]
  const StatusIcon = config.icon

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="font-medium text-sm leading-snug">{task.task}</p>
          </div>
          <StatusIcon className={`h-5 w-5 ${config.color} shrink-0`} />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{task.owner}</span>
          <span>•</span>
          <span>Due: {task.due}</span>
        </div>

        <Badge variant="outline" className={`text-xs ${config.bg} ${config.border} ${config.color}`}>
          {config.label}
        </Badge>

        {task.linkedPowerMove && (
          <div className="pt-2 border-t text-xs text-muted-foreground">
            <span>Linked to: </span>
            <span className="font-medium text-blue-600">{task.linkedPowerMove}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
