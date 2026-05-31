import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import { AnimatedProgress } from "@/components/animated-progress"

interface PowerMoveBPRCardProps {
  name: string
  weeklyTarget: number
  weeklyActual: number
  linkedVictoryTarget?: string
  owner: string
}

export function PowerMoveBPRCard({
  name,
  weeklyTarget,
  weeklyActual,
  linkedVictoryTarget,
  owner,
}: PowerMoveBPRCardProps) {
  const completionRate = Math.round((weeklyActual / weeklyTarget) * 100)

  let status: "green" | "yellow" | "red" = "green"
  if (completionRate >= 100) status = "green"
  else if (completionRate >= 70) status = "yellow"
  else status = "red"

  const statusColors = {
    green: "bg-green-500/20 border-green-500",
    yellow: "bg-yellow-500/20 border-yellow-500",
    red: "bg-red-500/20 border-red-500",
  }

  const statusTextColors = {
    green: "text-green-900",
    yellow: "text-yellow-900",
    red: "text-red-900",
  }

  return (
    <Card className={`border-2 ${statusColors[status]} ${status === "red" ? "animate-pulse" : ""}`}>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-sm">{name}</h3>
            </div>
            {linkedVictoryTarget && <p className="text-xs text-muted-foreground">Drives: {linkedVictoryTarget}</p>}
          </div>
          <div className={`w-12 h-12 rounded-full ${statusColors[status]} flex items-center justify-center border-4`}>
            <span className={`text-lg font-bold ${statusTextColors[status]}`}>{completionRate}%</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y">
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">Target</p>
            <p className="text-2xl font-bold tabular-nums">{weeklyTarget}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">Actual</p>
            <p
              className={`text-2xl font-bold tabular-nums ${weeklyActual >= weeklyTarget ? "text-green-600" : "text-yellow-600"}`}
            >
              {weeklyActual}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-medium mb-1">Gap</p>
            <p
              className={`text-2xl font-bold tabular-nums ${weeklyActual >= weeklyTarget ? "text-green-600" : "text-red-600"}`}
            >
              {Math.max(0, weeklyTarget - weeklyActual)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">This Week's Progress</span>
            <Badge variant={status === "green" ? "default" : status === "yellow" ? "secondary" : "destructive"}>
              {status === "green" ? "On Track" : status === "yellow" ? "At Risk" : "Critical"}
            </Badge>
          </div>
          <AnimatedProgress value={completionRate} className="h-2" />
        </div>

        <p className="text-xs text-muted-foreground">Owner: {owner}</p>
      </CardContent>
    </Card>
  )
}
