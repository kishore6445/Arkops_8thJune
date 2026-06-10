"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PowerMove {
  id: string
  name: string
  frequency?: string
  targetPerCycle?: number
  progress?: number
  owner?: string
  weeklyTarget?: number
  weeklyActual?: number
  activityCompleted?: boolean
  linkedVictoryTarget?: string
}

interface PowerMoveCardRedesignedProps {
  pm: PowerMove
  target: number
  actual: number
  onComplete?: (id: string) => void
  isPrimary?: boolean
}

const COLORS = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-cyan-500']

export function PowerMoveCardRedesigned({
  pm,
  target,
  actual,
  onComplete,
  isPrimary = false,
}: PowerMoveCardRedesignedProps) {
  const isCompleted = actual >= target
  const progressPercentage = target > 0 ? (actual / target) * 100 : 0
  const bgColor = COLORS[Math.floor(Math.random() * COLORS.length)]

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Header with avatar and title */}
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0',
                bgColor
              )}
            >
              {pm.name?.[0]?.toUpperCase() || '○'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base leading-tight text-stone-900">{pm.name}</h3>
                {isPrimary && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0">
                    Primary
                  </Badge>
                )}
              </div>
              <p className="text-xs text-stone-500">
                {pm.frequency} • {target} times per period • Owner: {pm.owner}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                This Period Progress
              </span>
              <span className="text-sm font-bold text-stone-900">
                {actual}/{target} • {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-500 rounded-full',
                  isCompleted ? 'bg-emerald-500' : 'bg-stone-400'
                )}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats preview (visible on hover or always) */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
            <div>
              <div className="text-xs text-stone-500 font-medium">Current Streak</div>
              <div className="text-sm font-bold text-stone-900">3d 🔥</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 font-medium">Best Streak</div>
              <div className="text-sm font-bold text-stone-900">12d 🏆</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 font-medium">Status</div>
              <Badge className={cn('text-xs', isCompleted ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                {isCompleted ? 'Complete' : 'At Risk'}
              </Badge>
            </div>
          </div>

          {/* Action button */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => onComplete?.(pm.id)}
              disabled={isCompleted}
            >
              {isCompleted ? '✓ Completed' : 'Mark Today Complete'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
