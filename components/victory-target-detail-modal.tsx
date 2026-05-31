"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AnimatedProgress } from "@/components/animated-progress"
import { Target, User, Calendar, TrendingUp, Edit2, Save, X } from "lucide-react"
import type { VictoryTarget, PowerMove } from "@/components/department-page"

interface VictoryTargetDetailModalProps {
  victoryTarget: VictoryTarget | null
  linkedPowerMoves?: PowerMove[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VictoryTargetDetailModal({
  victoryTarget,
  linkedPowerMoves = [],
  open,
  onOpenChange,
}: VictoryTargetDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTarget, setEditedTarget] = useState(victoryTarget)

  if (!victoryTarget) return null

  const progress = Math.round((victoryTarget.achieved / victoryTarget.target) * 100)
  const gap = victoryTarget.target - victoryTarget.achieved

  const handleSave = () => {
    // TODO: Save to backend
    console.log("[v0] Saving Victory Target:", editedTarget)
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedTarget?.title}
                  onChange={(e) => setEditedTarget({ ...victoryTarget, title: e.target.value })}
                  className="text-2xl font-bold"
                />
              ) : (
                <DialogTitle className="text-2xl">{victoryTarget.title}</DialogTitle>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={victoryTarget.status === "on-track" ? "default" : "destructive"}>
                {victoryTarget.status}
              </Badge>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
          {isEditing ? (
            <Textarea
              value={editedTarget?.description}
              onChange={(e) => setEditedTarget({ ...victoryTarget, description: e.target.value })}
              placeholder="Description..."
              rows={2}
            />
          ) : (
            <DialogDescription>{victoryTarget.description || "No description provided"}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium mb-1">Target</p>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedTarget?.target}
                    onChange={(e) => setEditedTarget({ ...victoryTarget, target: Number(e.target.value) })}
                    className="text-2xl font-bold text-center"
                  />
                ) : (
                  <p className="text-2xl font-bold tabular-nums">{victoryTarget.target}</p>
                )}
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium mb-1">Achieved</p>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedTarget?.achieved}
                    onChange={(e) => setEditedTarget({ ...victoryTarget, achieved: Number(e.target.value) })}
                    className="text-2xl font-bold text-center"
                  />
                ) : (
                  <p className="text-2xl font-bold tabular-nums text-blue-600">{victoryTarget.achieved}</p>
                )}
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium mb-1">Gap</p>
                <p className="text-2xl font-bold tabular-nums text-destructive">{gap}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold tabular-nums">{progress}%</span>
              </div>
              <AnimatedProgress value={progress} className="h-3" />
            </div>
          </div>

          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                Owner
              </Label>
              <p className="text-sm font-medium">{victoryTarget.owner}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Unit
              </Label>
              <p className="text-sm font-medium">{victoryTarget.unit || "—"}</p>
            </div>
          </div>

          {linkedPowerMoves.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-amber-600" />
                  Daily Power Moves Driving This Target
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {linkedPowerMoves.length} Active
                </Badge>
              </div>
              <div className="space-y-2">
                {linkedPowerMoves.map((pm) => {
                  const pmProgress = Math.round((pm.progress / pm.targetPerCycle) * 100)
                  return (
                    <div
                      key={pm.id}
                      className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-tight">{pm.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Target: {pm.targetPerCycle} {pm.unit} per week
                          </p>
                        </div>
                        <Badge variant={pmProgress >= 100 ? "default" : "outline"} className="text-xs shrink-0">
                          {pm.progress}/{pm.targetPerCycle}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <AnimatedProgress value={pmProgress} className="h-2" />
                        <p className="text-xs text-right text-muted-foreground tabular-nums">{pmProgress}%</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>4DX Principle:</strong> These are your <em>lead measures</em> - activities that predict and
                  influence this Victory Target (lag measure). Focus on executing these daily activities consistently.
                </p>
              </div>
            </div>
          )}

          {/* History Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Progress History
            </h3>
            <div className="p-4 bg-muted/30 rounded-lg text-center text-sm text-muted-foreground">
              History tracking coming soon
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
