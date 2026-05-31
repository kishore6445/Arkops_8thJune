"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { TrendingUp, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VictoryTargetQuickUpdateProps {
  victoryTargetId: string
  currentAchieved: number
  target: number
  title: string
  onUpdate?: (newAchieved: number) => void
}

export function VictoryTargetQuickUpdate({
  victoryTargetId,
  currentAchieved,
  target,
  title,
  onUpdate,
}: VictoryTargetQuickUpdateProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newValue, setNewValue] = useState(currentAchieved.toString())
  const { toast } = useToast()

  const handleSave = () => {
    const numValue = Number(newValue)
    if (isNaN(numValue) || numValue < 0) {
      toast({
        title: "Invalid number",
        description: "Please enter a valid positive number",
        variant: "destructive",
      })
      return
    }

    const oldGap = target - currentAchieved
    const newGap = target - numValue
    const gapReduction = oldGap - newGap

    // TODO: Save to backend
    console.log("[v0] Quick updating Victory Target:", victoryTargetId, "to", numValue)

    toast({
      title: "Scoreboard Updated!",
      description:
        gapReduction > 0
          ? `Gap reduced by ${gapReduction}! Keep going!`
          : gapReduction < 0
            ? `Gap increased by ${Math.abs(gapReduction)}. Review lead measures.`
            : "Progress logged.",
    })

    onUpdate?.(numValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setNewValue(currentAchieved.toString())
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          setIsEditing(true)
        }}
        className="gap-2 text-xs"
      >
        <TrendingUp className="h-3 w-3" />
        Quick Update
      </Button>
    )
  }

  return (
    <Card className="absolute top-2 right-2 p-3 space-y-2 z-10 shadow-lg" onClick={(e) => e.stopPropagation()}>
      <p className="text-xs font-medium">Update Progress</p>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="w-24 h-8 text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") handleCancel()
          }}
        />
        <span className="text-xs text-muted-foreground">/ {target}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSave} className="h-7 gap-1">
          <Check className="h-3 w-3" />
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7">
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  )
}
