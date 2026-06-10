"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ChevronRight, Info, CheckCircle2, XCircle, Circle } from "lucide-react"
import ConfirmationDialog from "@/components/confirmation-dialog"

interface PowerMoveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: PowerMoveFormData) => void | Promise<void>
  victoryTargets: Array<{ id: string; title: string; owner?: string; ownerId?: string; department?: string }>
}

export interface PowerMoveFormData {
  title: string
  frequency: string
  targetPerCycle: number
  owner: string
  ownerId?: string
  linkedVictoryTargets: string[]
  autoCreateTasks: boolean
  selectedDays: string[]
  startDate?: string
  endDate?: string
  description?: string
}

const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

type UserOption = {
  id: string
  name: string
  email: string
  role?: string
}

// Utility: get current month calendar data
function getMonthCalendar(selectedDays: string[]) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // day of week for first day (0=Sun, adjust to Mon=0)
  const startDow = (firstDay.getDay() + 6) % 7

  const cells: { date: number | null; status: "completed" | "missed" | "not-due" | "future" | "blank" }[] = []

  for (let i = 0; i < startDow; i++) {
    cells.push({ date: null, status: "blank" })
  }

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const today = now.getDate()

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dow = (new Date(year, month, d).getDay() + 6) % 7
    const dayName = dayNames[dow]
    const isDue = selectedDays.length === 0 || selectedDays.includes(dayName)

    if (!isDue) {
      cells.push({ date: d, status: "not-due" })
    } else if (d < today - 2) {
      cells.push({ date: d, status: "completed" })
    } else if (d < today) {
      cells.push({ date: d, status: "missed" })
    } else {
      cells.push({ date: d, status: "future" })
    }
  }

  return { cells, month: now.toLocaleString("default", { month: "long" }), year }
}

export function PowerMoveModal({ open, onOpenChange, onSave, victoryTargets }: PowerMoveModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [users, setUsers] = useState<UserOption[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)

  const [formData, setFormData] = useState<PowerMoveFormData>({
    title: "",
    frequency: "weekly",
    targetPerCycle: 0,
    owner: "",
    ownerId: undefined,
    linkedVictoryTargets: [],
    autoCreateTasks: true,
    selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    description: "",
  })

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors }
    switch (field) {
      case "title":
        if (!value || value.trim().length === 0) {
          newErrors.title = "Title is required"
        } else if (value.length < 3) {
          newErrors.title = "Title must be at least 3 characters"
        } else {
          delete newErrors.title
        }
        break
      case "targetPerCycle":
        if (!value || value <= 0) {
          newErrors.targetPerCycle = "Target must be greater than 0"
        } else {
          delete newErrors.targetPerCycle
        }
        break
      case "owner":
        if (!value) {
          newErrors.owner = "Owner is required"
        } else {
          delete newErrors.owner
        }
        break
      case "linkedVictoryTargets":
        if (availableVictoryTargets.length > 0 && value.length === 0) {
          newErrors.linkedVictoryTargets = "Please link at least one Victory Target"
        } else {
          delete newErrors.linkedVictoryTargets
        }
        break
    }
    setErrors(newErrors)
  }

  const handleSave = async (saveAndAddAnother = false) => {
    const newErrors: Record<string, string> = {}

    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = "Title is required"
    }
    if (!formData.owner) {
      newErrors.owner = "Owner is required"
    }
    if (formData.targetPerCycle <= 0) {
      newErrors.targetPerCycle = "Target must be greater than 0"
    }
    if (availableVictoryTargets.length > 0 && formData.linkedVictoryTargets.length === 0) {
      newErrors.linkedVictoryTargets = "Please link at least one Victory Target"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast({
        title: "Validation Error",
        description: "Please fix the errors before saving",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await onSave(formData)

      toast({
        title: "Success!",
        description: `${formData.title} has been created successfully`,
      })

      if (saveAndAddAnother) {
        setFormData({
          title: "",
          frequency: "weekly",
          targetPerCycle: 0,
          owner: "",
          linkedVictoryTargets: [],
          autoCreateTasks: true,
          selectedDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
          description: "",
        })
        setErrors({})
      } else {
        onOpenChange(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Power Move. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDay = (day: string) => {
    setFormData({
      ...formData,
      selectedDays: formData.selectedDays.includes(day)
        ? formData.selectedDays.filter((d) => d !== day)
        : [...formData.selectedDays, day],
    })
  }

  useEffect(() => {
    const hasAnyChange =
      formData.title !== "" ||
      formData.targetPerCycle > 0 ||
      formData.owner !== "" ||
      formData.linkedVictoryTargets.length > 0
    setHasChanges(hasAnyChange)
  }, [formData])

  useEffect(() => {
    if (open && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const normalizeName = (value?: string) => value?.trim().toLowerCase() || ""

  const ownerFilteredTargets = victoryTargets.filter((target) => {
    if (!formData.owner && !formData.ownerId) return false
    if (formData.ownerId && target.ownerId) {
      return target.ownerId === formData.ownerId
    }
    if (!formData.owner || !target.owner) return false
    return normalizeName(target.owner) === normalizeName(formData.owner)
  })

  const availableVictoryTargets = ownerFilteredTargets

  useEffect(() => {
    if (!formData.linkedVictoryTargets[0]) return
    const stillValid = availableVictoryTargets.some((target) => target.id === formData.linkedVictoryTargets[0])
    if (!stillValid) {
      setFormData((prev) => ({ ...prev, linkedVictoryTargets: [] }))
    }
  }, [availableVictoryTargets, formData.linkedVictoryTargets])

  useEffect(() => {
    if (!open) return

    const loadUsers = async () => {
      setIsLoadingUsers(true)
      setUsersError(null)
      try {
        const response = await fetch("/api/admin/users", { cache: "no-store" })
        const result = await response.json()
        if (!response.ok) {
          setUsersError(result?.error || "Unable to load users.")
          setUsers([])
          return
        }
        if (Array.isArray(result.users)) {
          setUsers(result.users)
        } else {
          setUsers([])
        }
      } catch (error) {
        setUsersError(error instanceof Error ? error.message : "Unable to load users.")
        setUsers([])
      } finally {
        setIsLoadingUsers(false)
      }
    }

    loadUsers()
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasChanges && !isLoading) {
      setShowUnsavedWarning(true)
    } else {
      onOpenChange(newOpen)
    }
  }

  const confirmClose = () => {
    setShowUnsavedWarning(false)
    setHasChanges(false)
    onOpenChange(false)
  }

  // Derive preview values
  const activeDays = formData.selectedDays.length > 0 ? formData.selectedDays : ["Mon", "Tue", "Wed", "Thu", "Fri"]
  const frequencyLabel =
    formData.frequency === "weekly" && activeDays.length > 0
      ? `Custom Days (${activeDays.join(", ")})`
      : formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1)

  const startDateFormatted = formData.startDate
    ? new Date(formData.startDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—"

  const getFirstCycle = () => {
    if (!formData.startDate) return "—"
    const start = new Date(formData.startDate + "T00:00:00")
    const end = new Date(start)
    end.setDate(end.getDate() + 4)
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  const weeklyViewDays = ["Mon", "Tue", "Wed", "Thu", "Fri"].filter((d) => activeDays.includes(d))
  const { cells: calendarCells, month: calMonth, year: calYear } = getMonthCalendar(activeDays)

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className=" w-full p-0 gap-0 max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-lg font-semibold text-gray-900">Add Power Move (Lead Measure)</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-0.5">
              Create a new power move that drives your victory targets
            </DialogDescription>
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* LEFT: Form */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title *</Label>
                <Input
                  ref={titleInputRef}
                  id="title"
                  placeholder="e.g., Webinars Conducted"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value })
                    validateField("title", e.target.value)
                  }}
                  onBlur={() => validateField("title", formData.title)}
                  className={`h-9 text-sm ${errors.title ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300"}`}
                />
                {errors.title
                  ? <p className="text-xs text-red-600">{errors.title}</p>
                  : <p className="text-xs text-gray-400">e.g., Webinars Conducted</p>
                }
              </div>

              {/* Frequency + Repeat On */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Frequency *</Label>
                  <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v })}>
                    <SelectTrigger className="h-9 text-sm border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Custom Days</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Repeat On *</Label>
                  <div className="flex gap-1.5">
                    {ALL_DAYS.map((day) => {
                      const selected = formData.selectedDays.includes(day)
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`h-8 w-9 rounded text-xs font-semibold transition-colors ${
                            selected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-400">Select the days this power move is expected to be completed.</p>
                </div>
              </div>

              {/* Target Per Cycle + Start Date + End Date */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Target Per Cycle *</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={formData.targetPerCycle || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      setFormData({ ...formData, targetPerCycle: value })
                      validateField("targetPerCycle", value)
                    }}
                    onBlur={() => validateField("targetPerCycle", formData.targetPerCycle)}
                    className={`h-9 text-sm ${errors.targetPerCycle ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.targetPerCycle
                    ? <p className="text-xs text-red-600">{errors.targetPerCycle}</p>
                    : <p className="text-xs text-gray-400">Based on selected days (Mon–Fri)</p>
                  }
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Start Date *</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={formData.startDate || ""}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="h-9 text-sm border-gray-300 pr-8"
                    />
                  </div>
                  <p className="text-xs text-gray-400">When tracking should begin</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">End Date <span className="font-normal text-gray-400">(Optional)</span></Label>
                  <Input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="h-9 text-sm border-gray-300"
                  />
                  <p className="text-xs text-gray-400">Leave empty for no end date</p>
                </div>
              </div>

              {/* Owner + Victory Target */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Owner *</Label>
                  <Select
                    value={formData.ownerId ?? formData.owner}
                    onValueChange={(value) => {
                      const selected = users.find((user) => user.id === value || user.name === value)
                      const nextOwner = selected?.name ?? value
                      const nextOwnerId = selected?.id
                      setFormData({ ...formData, owner: nextOwner, ownerId: nextOwnerId, linkedVictoryTargets: [] })
                      validateField("owner", nextOwner)
                    }}
                  >
                    <SelectTrigger className={`h-9 text-sm ${errors.owner ? "border-red-500" : "border-gray-300"}`}>
                      <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select owner"} />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter((user) => !user.role?.toLowerCase().includes("admin"))
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.owner
                    ? <p className="text-xs text-red-600">{errors.owner}</p>
                    : <p className="text-xs text-gray-400">Select the owner responsible for this power move.</p>
                  }
                  {usersError && <p className="text-xs text-rose-600">{usersError}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">
                    Link to Victory Targets <span className="font-normal text-gray-400">(Optional)</span>
                  </Label>
                  <Select
                    value={formData.linkedVictoryTargets[0] || ""}
                    onValueChange={(value) => {
                      const nextTargets = value ? [value] : []
                      setFormData({ ...formData, linkedVictoryTargets: nextTargets })
                      validateField("linkedVictoryTargets", nextTargets)
                    }}
                    disabled={!formData.owner || availableVictoryTargets.length === 0}
                  >
                    <SelectTrigger className={`h-9 text-sm ${errors.linkedVictoryTargets ? "border-red-500" : "border-gray-300"}`}>
                      <SelectValue
                        placeholder={
                          !formData.owner
                            ? "Select owner first"
                            : availableVictoryTargets.length === 0
                              ? "No victory targets"
                              : "Select victory target"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVictoryTargets.map((target) => (
                        <SelectItem key={target.id} value={target.id}>
                          {target.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.linkedVictoryTargets
                    ? <p className="text-xs text-red-600">{errors.linkedVictoryTargets}</p>
                    : <p className="text-xs text-gray-400">Choose a victory target to link this power move.</p>
                  }
                </div>
              </div>

              {/* Auto-create */}
              <div className="flex items-start gap-2.5 p-3 rounded-md border border-gray-200 bg-gray-50">
                <Checkbox
                  id="autoCreateTasks"
                  checked={formData.autoCreateTasks}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoCreateTasks: checked as boolean })}
                  className="mt-0.5"
                />
                <div>
                  <label htmlFor="autoCreateTasks" className="text-sm font-medium text-gray-800 cursor-pointer">
                    Auto-create recurring tasks
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">Automatically create tasks for the selected days.</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Description <span className="font-normal text-gray-400">(Optional)</span></Label>
                <Textarea
                  placeholder="Update daily report and submit to the marketing head."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="text-sm border-gray-300 min-h-[72px] resize-none"
                />
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-between pt-2 pb-1">
                <Button
                  variant="ghost"
                  onClick={() => handleOpenChange(false)}
                  disabled={isLoading}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSave(true)}
                    disabled={isLoading}
                    className="text-sm border-gray-300 text-gray-700"
                  >
                    {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                    Save & Add Another
                  </Button>
                  <Button
                    onClick={() => handleSave(false)}
                    disabled={isLoading}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT: Preview Panel */}
            <div className="w-[280px] shrink-0 border-l border-gray-100 bg-gray-50 overflow-y-auto px-5 py-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Preview Summary</h3>
              <p className="text-xs text-gray-500 mb-4">This is how the power move will be tracked.</p>

              {/* Frequency */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-0.5">Frequency</p>
                <p className="text-sm font-medium text-gray-900">{frequencyLabel}</p>
              </div>

              {/* Target Per Cycle */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-0.5">Target Per Cycle</p>
                <p className="text-sm font-medium text-gray-900">
                  {formData.targetPerCycle > 0 ? `${formData.targetPerCycle} times per week` : "—"}
                </p>
              </div>

              {/* Start Date */}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-0.5">Start Date</p>
                <p className="text-sm font-medium text-gray-900">{startDateFormatted}</p>
              </div>

              {/* First Cycle */}
              <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 mb-0.5">First Cycle</p>
                <p className="text-sm font-medium text-gray-900">{getFirstCycle()}</p>
              </div>

              {/* Weekly View Example */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-700 mb-2">Weekly View Example</p>
                <div className="grid grid-cols-5 gap-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => {
                    const active = activeDays.includes(d)
                    return (
                      <div key={d} className="flex flex-col items-center gap-1">
                        <span className="text-[11px] font-medium text-gray-500">{d}</span>
                        {active ? (
                          <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-gray-200 bg-white" />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-5 gap-1 mt-1.5">
                  <span className="text-[10px] text-center text-gray-400 col-span-1">Target</span>
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].slice(1).map((d) => (
                    <span key={d} className="text-[10px] text-center text-gray-400">
                      {activeDays.includes(d) ? "1" : "—"}
                    </span>
                  ))}
                </div>
              </div>

              {/* Monthly Calendar Example */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-700">Monthly Calendar Example</p>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <p className="text-xs font-semibold text-gray-800 mb-2">{calMonth} {calYear}</p>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-0.5 mb-1">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                      <span key={d} className="text-[10px] text-center font-medium text-gray-400">{d}</span>
                    ))}
                  </div>
                  {/* Calendar cells */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {calendarCells.map((cell, idx) => {
                      if (cell.status === "blank") {
                        return <div key={idx} />
                      }
                      const isToday = cell.date === new Date().getDate()
                      return (
                        <div
                          key={idx}
                          className={`w-full aspect-square flex items-center justify-center rounded text-[10px] font-medium relative ${
                            cell.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : cell.status === "missed"
                                ? "border border-red-400 text-red-500"
                                : cell.status === "not-due"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                          }`}
                        >
                          {cell.date}
                          {cell.status === "completed" && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                            </span>
                          )}
                          {cell.status === "missed" && (
                            <span className="absolute -top-0.5 -right-0.5">
                              <XCircle className="h-3 w-3 text-red-500 bg-white rounded-full" />
                            </span>
                          )}
                          {cell.status !== "completed" && cell.status !== "missed" && cell.date}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Circle className="h-3.5 w-3.5 text-gray-300" />
                    <span className="text-xs text-gray-500">Due / Not Completed</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 ml-2" />
                    <span className="text-xs text-gray-500">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-xs text-gray-500">Missed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="h-3.5 w-3.5 text-gray-200" />
                    <span className="text-xs text-gray-500">Not Due</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: How it works + Legend */}
          <div className="border-t border-gray-100 bg-white">
            <div className="px-6 py-3 bg-blue-50 border-t border-blue-100 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-blue-700">How it works</span>
                <p className="text-xs text-blue-600 mt-0.5">
                  Power move will be created for selected days (Mon–Fri). Each day will be tracked. Streaks will be calculated based on consecutive completed days.
                </p>
              </div>
            </div>

            <div className="px-6 py-3 flex items-center gap-6">
              <span className="text-xs font-semibold text-gray-600">Legend (Dashboard &amp; Calendar)</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs text-gray-600">Missed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Circle className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-600">Not Completed / Due</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Circle className="h-3.5 w-3.5 text-gray-200" />
                <span className="text-xs text-gray-600">Not Due / Future</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showUnsavedWarning}
        onOpenChange={setShowUnsavedWarning}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to close without saving?"
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        onConfirm={confirmClose}
        variant="destructive"
      />
    </>
  )
}
