"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Plus, Star, TrendingUp, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import confetti from "canvas-confetti"

interface Win {
  id: string
  title: string
  owner: string
  date: string
  category: "target-hit" | "commitment-streak" | "team-win" | "breakthrough"
}

interface WinsCelebrationPanelProps {
  departmentName: string
}

export function WinsCelebrationPanel({ departmentName }: WinsCelebrationPanelProps) {
  const { toast } = useToast()
  const [wins, setWins] = useState<Win[]>([
    {
      id: "1",
      title: "Hit 100% of Victory Target - Client Acquisition",
      owner: "Sarah M.",
      date: "Dec 20, 2026",
      category: "target-hit",
    },
    {
      id: "2",
      title: "10-week commitment completion streak",
      owner: "John D.",
      date: "Dec 19, 2026",
      category: "commitment-streak",
    },
  ])
  const [newWin, setNewWin] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddWin = () => {
    if (!newWin.trim()) return

    const win: Win = {
      id: Date.now().toString(),
      title: newWin,
      owner: "You",
      date: new Date().toLocaleDateString(),
      category: "team-win",
    }

    setWins([win, ...wins])
    setNewWin("")
    setIsAdding(false)

    // Trigger confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    toast({
      title: "Win Celebrated!",
      description: "Great work! Keep the momentum going.",
    })
  }

  const getCategoryIcon = (category: Win["category"]) => {
    switch (category) {
      case "target-hit":
        return <Target className="h-4 w-4 text-green-600" />
      case "commitment-streak":
        return <Star className="h-4 w-4 text-yellow-600" />
      case "team-win":
        return <Trophy className="h-4 w-4 text-blue-600" />
      case "breakthrough":
        return <TrendingUp className="h-4 w-4 text-purple-600" />
    }
  }

  const getCategoryLabel = (category: Win["category"]) => {
    switch (category) {
      case "target-hit":
        return "Victory Target"
      case "commitment-streak":
        return "Streak"
      case "team-win":
        return "Team Win"
      case "breakthrough":
        return "Breakthrough"
    }
  }

  return (
    <Card className="border-2 border-yellow-200 bg-yellow-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-600" />
          Wins of the Week
        </CardTitle>
        <CardDescription>Celebrate progress and recognize team achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isAdding ? (
          <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add a Win to Celebrate
          </Button>
        ) : (
          <div className="space-y-2">
            <Textarea
              placeholder="Describe the win (e.g., 'Hit 100% of Client Calls target', 'Closed biggest deal ever', etc.)"
              value={newWin}
              onChange={(e) => setNewWin(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddWin} className="flex-1">
                Celebrate Win
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {wins.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No wins recorded yet. Add your first win above!
            </p>
          ) : (
            wins.map((win) => (
              <div key={win.id} className="flex items-start gap-3 p-3 rounded-lg border bg-white">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-yellow-100 text-yellow-800">
                    {win.owner
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{win.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{win.owner}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{win.date}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 gap-1">
                  {getCategoryIcon(win.category)}
                  {getCategoryLabel(win.category)}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
