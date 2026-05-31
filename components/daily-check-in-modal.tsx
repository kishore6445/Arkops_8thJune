"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Target, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyCheckInModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userName?: string
  currentStreak?: number
  onSubmit: (commitment: string) => void
}

export function DailyCheckInModal({
  open,
  onOpenChange,
  userName = "there",
  currentStreak = 0,
  onSubmit,
}: DailyCheckInModalProps) {
  const [commitment, setCommitment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!commitment.trim()) return
    setIsSubmitting(true)

    setTimeout(() => {
      onSubmit(commitment)
      setCommitment("")
      setIsSubmitting(false)
      onOpenChange(false)
    }, 300)
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">Good Morning</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">{today}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Streak display */}
          {currentStreak > 0 && (
            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <Flame className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">{currentStreak} day streak! Keep it going.</span>
            </div>
          )}

          {/* The ONE thing question */}
          <div className="space-y-3">
            <label className="block text-center">
              <span className="text-lg font-semibold text-foreground">
                What is the ONE thing you will complete today?
              </span>
              <span className="block text-sm text-muted-foreground mt-1">
                Be specific. One clear commitment drives focus.
              </span>
            </label>
            <Textarea
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="e.g., Complete 5 client discovery calls"
              className="min-h-[100px] text-base resize-none border-stone-200 focus:border-primary"
              autoFocus
            />
          </div>

          <Button
            onClick={handleSubmit}
            className={cn(
              "w-full h-12 text-base font-semibold transition-all",
              commitment.trim() && "shadow-md hover:shadow-lg",
            )}
            disabled={!commitment.trim() || isSubmitting}
          >
            {isSubmitting ? "Committing..." : "I Commit to This"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Implementation intentions increase follow-through by 2-3x
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
