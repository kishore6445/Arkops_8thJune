"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Target,
  Plus,
  X,
  Clock,
  Hash,
  Percent,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface WorkEntry {
  id: string
  category: string
  description: string
  measureType: "output" | "time" | "progress" | "improvement"
  quantity?: number
  unit?: string
  notes?: string
}

interface PowerMoveUpdate {
  id: string
  name: string
  completed: number
  target: number
}

interface DailyReportFormProps {
  onSubmit: (report: any) => void
}

const workCategories = [
  { value: "design", label: "Design" },
  { value: "development", label: "Development / Coding" },
  { value: "sales", label: "Sales / BD" },
  { value: "marketing", label: "Marketing / Content" },
  { value: "operations", label: "Operations / Admin" },
  { value: "research", label: "Research / Analysis" },
  { value: "meetings", label: "Meetings / Collaboration" },
  { value: "other", label: "Other" },
]

const measureTypes = [
  {
    value: "output",
    label: "Output Created",
    icon: Hash,
    unit: "items",
    placeholder: "e.g., 10",
    description: "Things you created/completed",
  },
  {
    value: "time",
    label: "Time Spent",
    icon: Clock,
    unit: "hours",
    placeholder: "e.g., 4",
    description: "Hours invested in this work",
  },
  {
    value: "progress",
    label: "Progress Made",
    icon: Percent,
    unit: "%",
    placeholder: "e.g., 80",
    description: "Percentage of task completed",
  },
  {
    value: "improvement",
    label: "Improvements Made",
    icon: Wrench,
    unit: "items",
    placeholder: "e.g., 2",
    description: "Things you improved/fixed",
  },
]

export function DailyReportForm({ onSubmit }: DailyReportFormProps) {
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([
    { id: "1", category: "", description: "", measureType: "output", quantity: undefined, unit: "items", notes: "" },
  ])
  const [workLogOpen, setWorkLogOpen] = useState(false) // Collapsed by default

  const [wins, setWins] = useState<string[]>([""])
  const [blockers, setBlockers] = useState<string[]>([""])
  const [learnings, setLearnings] = useState("")
  const [tomorrow, setTomorrow] = useState<string[]>(["", "", ""])
  const [powerMoves, setPowerMoves] = useState<PowerMoveUpdate[]>([
    { id: "1", name: "Client Discovery Calls", completed: 0, target: 5 },
    { id: "2", name: "Story Scripts Written", completed: 0, target: 3 },
  ])

  const [honestyAnswer, setHonestyAnswer] = useState<"yes" | "partially" | "no" | "">("")
  const [honestyReason, setHonestyReason] = useState("")

  const addWorkEntry = () => {
    setWorkEntries([
      ...workEntries,
      {
        id: Date.now().toString(),
        category: "",
        description: "",
        measureType: "output",
        quantity: undefined,
        unit: "items",
        notes: "",
      },
    ])
  }

  const removeWorkEntry = (id: string) => {
    if (workEntries.length > 1) {
      setWorkEntries(workEntries.filter((entry) => entry.id !== id))
    }
  }

  const updateWorkEntry = (id: string, field: keyof WorkEntry, value: any) => {
    setWorkEntries(
      workEntries.map((entry) => {
        if (entry.id === id) {
          const updated = { ...entry, [field]: value }
          if (field === "measureType") {
            const measureConfig = measureTypes.find((m) => m.value === value)
            updated.unit = measureConfig?.unit || "items"
          }
          return updated
        }
        return entry
      }),
    )
  }

  const addWin = () => setWins([...wins, ""])
  const removeWin = (index: number) => setWins(wins.filter((_, i) => i !== index))
  const updateWin = (index: number, value: string) => {
    const newWins = [...wins]
    newWins[index] = value
    setWins(newWins)
  }

  const addBlocker = () => setBlockers([...blockers, ""])
  const removeBlocker = (index: number) => setBlockers(blockers.filter((_, i) => i !== index))
  const updateBlocker = (index: number, value: string) => {
    const newBlockers = [...blockers]
    newBlockers[index] = value
    setBlockers(newBlockers)
  }

  const updateTomorrow = (index: number, value: string) => {
    const newTomorrow = [...tomorrow]
    newTomorrow[index] = value
    setTomorrow(newTomorrow)
  }

  const updatePowerMoveCompleted = (id: string, value: number) => {
    setPowerMoves(powerMoves.map((pm) => (pm.id === id ? { ...pm, completed: value } : pm)))
  }

  const totalPowerMoveTarget = powerMoves.reduce((acc, pm) => acc + pm.target, 0)
  const totalPowerMoveCompleted = powerMoves.reduce((acc, pm) => acc + pm.completed, 0)
  const powerMovePercentage =
    totalPowerMoveTarget > 0 ? Math.round((totalPowerMoveCompleted / totalPowerMoveTarget) * 100) : 0

  const canSubmit = honestyAnswer === "yes" || (honestyAnswer && honestyReason.trim().length > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit && powerMovePercentage < 100) {
      return
    }
    onSubmit({
      workEntries: workEntries.filter((w) => w.description.trim()),
      wins: wins.filter((w) => w.trim()),
      blockers: blockers.filter((b) => b.trim()),
      learnings,
      tomorrow: tomorrow.filter((t) => t.trim()),
      powerMoves,
      honestyAnswer,
      honestyReason,
      date: new Date().toISOString(),
    })
  }

  const getMeasureConfig = (type: string) => measureTypes.find((m) => m.value === type)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 border-2 border-slate-900 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-slate-900" />
          <h3 className="text-lg font-bold text-slate-900">Power Move Completion</h3>
        </div>

        <p className="text-sm text-slate-600 mb-6 border-l-2 border-slate-400 pl-3 italic">
          If Power Moves are not completed, all other work is secondary.
        </p>

        <div className="space-y-4">
          {powerMoves.map((pm) => (
            <div key={pm.id} className="flex items-center gap-4 bg-white p-4 rounded-lg border">
              <div className="flex-1">
                <Label className="text-base font-medium">{pm.name}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max={pm.target}
                  value={pm.completed}
                  onChange={(e) => updatePowerMoveCompleted(pm.id, Number.parseInt(e.target.value) || 0)}
                  className="w-20 text-center text-lg font-bold"
                />
                <span className="text-muted-foreground font-medium">/ {pm.target}</span>
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold ${
                    pm.completed >= pm.target
                      ? "bg-emerald-600"
                      : pm.completed / pm.target >= 0.7
                        ? "bg-amber-500"
                        : "bg-red-500"
                  } text-white`}
                >
                  {Math.round((pm.completed / pm.target) * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-slate-700">Today's Execution Score</span>
            <div
              className={`text-3xl font-bold ${
                powerMovePercentage >= 70
                  ? "text-emerald-600"
                  : powerMovePercentage >= 50
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            >
              {powerMovePercentage}%
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-amber-400 bg-amber-50">
        <h3 className="text-lg font-bold text-slate-900 mb-2">The Truth</h3>
        <p className="text-base text-slate-700 mb-6 font-medium">Did you do what you committed to today?</p>

        <RadioGroup
          value={honestyAnswer}
          onValueChange={(value) => setHonestyAnswer(value as "yes" | "partially" | "no")}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white border hover:border-emerald-400 transition-colors">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes" className="flex-1 cursor-pointer font-medium text-emerald-700">
              Yes - I completed what I committed to
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white border hover:border-amber-400 transition-colors">
            <RadioGroupItem value="partially" id="partially" />
            <Label htmlFor="partially" className="flex-1 cursor-pointer font-medium text-amber-700">
              Partially - I completed some but not all
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white border hover:border-red-400 transition-colors">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no" className="flex-1 cursor-pointer font-medium text-red-700">
              No - I did not complete my commitments
            </Label>
          </div>
        </RadioGroup>

        {(honestyAnswer === "partially" || honestyAnswer === "no") && (
          <div className="mt-4 pt-4 border-t">
            <Label className="text-sm font-semibold text-slate-700 mb-2 block">
              What happened? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Be honest. This is for your growth, not judgment."
              value={honestyReason}
              onChange={(e) => setHonestyReason(e.target.value)}
              rows={3}
              className="bg-white"
              required
            />
            {honestyAnswer && !honestyReason.trim() && (
              <p className="text-sm text-red-500 mt-2">Please provide a reason to continue.</p>
            )}
          </div>
        )}
      </Card>

      <Collapsible open={workLogOpen} onOpenChange={setWorkLogOpen}>
        <Card className="p-6 border border-slate-200 bg-slate-50/50">
          <CollapsibleTrigger asChild>
            <button type="button" className="flex items-center justify-between w-full text-left">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-medium text-slate-600">Supporting Work Log</h3>
                <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
                  Does not count as execution
                </span>
              </div>
              {workLogOpen ? (
                <ChevronUp className="h-5 w-5 text-slate-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400" />
              )}
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <p className="text-sm text-slate-500 mb-4">
              Log other work here. Remember: activity without Power Move progress is not execution.
            </p>

            <div className="space-y-4">
              {workEntries.map((entry, index) => {
                const measureConfig = getMeasureConfig(entry.measureType)
                const MeasureIcon = measureConfig?.icon || Hash

                return (
                  <div key={entry.id} className="bg-white rounded-lg p-4 border space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Entry {index + 1}</span>
                      {workEntries.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeWorkEntry(entry.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Category</Label>
                        <Select value={entry.category} onValueChange={(v) => updateWorkEntry(entry.id, "category", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {workCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-3">
                        <Label className="text-xs text-muted-foreground mb-1 block">What did you work on?</Label>
                        <Input
                          placeholder="e.g., Created marketing flyers for Q1 campaign"
                          value={entry.description}
                          onChange={(e) => updateWorkEntry(entry.id, "description", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground mb-1 block">How do you measure this?</Label>
                        <Select
                          value={entry.measureType}
                          onValueChange={(v) => updateWorkEntry(entry.id, "measureType", v as WorkEntry["measureType"])}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {measureTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">
                          <MeasureIcon className="h-3 w-3 inline mr-1" />
                          Quantity
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            placeholder={measureConfig?.placeholder || "0"}
                            value={entry.quantity || ""}
                            onChange={(e) =>
                              updateWorkEntry(entry.id, "quantity", e.target.value ? Number(e.target.value) : undefined)
                            }
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">{entry.unit}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Notes</Label>
                        <Input
                          placeholder="Any context..."
                          value={entry.notes || ""}
                          onChange={(e) => updateWorkEntry(entry.id, "notes", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              <Button type="button" variant="outline" size="sm" onClick={addWorkEntry}>
                <Plus className="h-4 w-4 mr-1" /> Add Another Entry
              </Button>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Wins */}
      <Card className="p-6 border-2 border-emerald-200 bg-emerald-50">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">Today's Wins</h3>
        </div>

        <div className="space-y-3">
          {wins.map((win, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="What did you accomplish today?"
                value={win}
                onChange={(e) => updateWin(index, e.target.value)}
                className="flex-1 bg-white"
              />
              {wins.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeWin(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addWin}>
            <Plus className="h-4 w-4 mr-1" /> Add Another Win
          </Button>
        </div>
      </Card>

      {/* Blockers */}
      <Card className="p-6 border-2 border-red-200 bg-red-50">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold">Blockers / Challenges</h3>
        </div>

        <div className="space-y-3">
          {blockers.map((blocker, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="What's blocking your progress?"
                value={blocker}
                onChange={(e) => updateBlocker(index, e.target.value)}
                className="flex-1 bg-white"
              />
              {blockers.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeBlocker(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addBlocker}>
            <Plus className="h-4 w-4 mr-1" /> Add Another Blocker
          </Button>
        </div>
      </Card>

      {/* Learnings */}
      <Card className="p-6 border-2 border-blue-200 bg-blue-50">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Key Learning / Insight</h3>
        </div>

        <Textarea
          placeholder="What did you learn today that will help you execute better?"
          value={learnings}
          onChange={(e) => setLearnings(e.target.value)}
          rows={3}
          className="bg-white"
        />
      </Card>

      <Card className="p-6 border-2 border-purple-200 bg-purple-50">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Tomorrow's Top 3</h3>
          <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded font-medium">
            Must advance Power Moves
          </span>
        </div>

        <p className="text-sm text-purple-600 mb-4 italic">
          If these do not move a Power Move, they do not belong here.
        </p>

        <div className="space-y-3">
          {tomorrow.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-sm font-bold text-purple-700">
                {index + 1}
              </span>
              <Input
                placeholder={`Priority ${index + 1} - What Power Move will this advance?`}
                value={item}
                onChange={(e) => updateTomorrow(index, e.target.value)}
                className="flex-1 bg-white"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          type="submit"
          size="lg"
          className="flex-1"
          disabled={!honestyAnswer || (honestyAnswer !== "yes" && !honestyReason.trim())}
        >
          Submit Daily Report
        </Button>
        <Button type="button" variant="outline" size="lg">
          Save Draft
        </Button>
      </div>

      {!honestyAnswer && (
        <p className="text-center text-sm text-amber-600">
          You must answer "Did you do what you committed to today?" before submitting.
        </p>
      )}
    </form>
  )
}
