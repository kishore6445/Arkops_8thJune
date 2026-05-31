"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AnimatedProgress } from "@/components/animated-progress"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface PowerMove {
  id: string
  name: string
  description: string
  frequency: string
  targetPerCycle: number
  progress: number
  owner: string
  linkedVictoryTarget?: string
  linkToTool?: string
}

interface PowerMoveCardProps {
  move: PowerMove
}

export function PowerMoveCard({ move }: PowerMoveCardProps) {
  const [expanded, setExpanded] = useState(false)
  const progressPercentage = (move.progress / move.targetPerCycle) * 100

  return (
    <Card className="transition-all duration-150 hover:shadow-md">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight mb-1">{move.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{move.description}</p>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-muted rounded transition-colors shrink-0"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold tabular-nums">
                {move.progress}/{move.targetPerCycle}
              </span>
              <Badge variant="secondary" className="text-xs">
                {move.frequency}
              </Badge>
            </div>
            <AnimatedProgress value={progressPercentage} className="h-2" />
          </div>

          {/* Owner */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {move.owner
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{move.owner}</span>
          </div>

          {/* Expanded Details */}
          {expanded && (
            <div className="pt-3 border-t space-y-2 text-sm">
              {move.linkedVictoryTarget && (
                <div>
                  <span className="text-muted-foreground">Linked to:</span>
                  <span className="ml-2 font-medium">{move.linkedVictoryTarget}</span>
                </div>
              )}
              {move.linkToTool && (
                <div>
                  <a
                    href={move.linkToTool}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Open Tool →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
