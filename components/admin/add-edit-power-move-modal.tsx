"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generatePreviewData } from "@/lib/power-move-preview"

type PowerMove = {
  id: string
  brandId: string
  department: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
  name: string
  frequency: "daily" | "weekly" | "monthly"
  weeklyTarget: number
  owner: string
  ownerId?: string
  linkedVictoryTargetId?: string
  linkedVictoryTargetTitle: string
}

type UserOption = {
  id: string
  name: string
  email: string
  role?: string
  departments?: Array<{ code: PowerMove["department"]; permission: "admin" | "member" | "view" }>
}

type VictoryTargetOption = {
  id: string
  title: string
  owner?: string
  ownerId?: string
  brandId?: string
  department?: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
}

type PowerMoveFormData = {
  brandId: string
  department: PowerMove["department"]
  name: string
  frequency: PowerMove["frequency"]
  weeklyTarget: number
  owner: string
  ownerId?: string
  linkedVictoryTargetId?: string
  linkedVictoryTargetTitle: string
  customDays?: string[] // New field for custom day selection
}

type CompanyBrand = {
  id: string
  brand_name: string
  brand_slug: string
}

interface AddEditPowerMoveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  powerMove: PowerMove | null
  brands: CompanyBrand[]
  onSave: (data: Partial<PowerMove>) => void
}

export function AddEditPowerMoveModal({
  open,
  onOpenChange,
  powerMove,
  brands,
  onSave,
}: AddEditPowerMoveModalProps) {
  const getDefaultBrandId = () => brands[0]?.brand_slug || ""

  const [formData, setFormData] = useState<PowerMoveFormData>({
    brandId: getDefaultBrandId(),
    department: "M",
    name: "",
    frequency: "weekly",
    weeklyTarget: 0,
    owner: "",
    ownerId: undefined as string | undefined,
    linkedVictoryTargetId: undefined as string | undefined,
    linkedVictoryTargetTitle: "",
    customDays: [],
  })
  const [users, setUsers] = useState<UserOption[]>([])
  const [victoryTargets, setVictoryTargets] = useState<VictoryTargetOption[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingTargets, setIsLoadingTargets] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [targetsError, setTargetsError] = useState<string | null>(null)

  useEffect(() => {
    if (powerMove) {
      setFormData({
        brandId: powerMove.brandId,
        department: powerMove.department,
        name: powerMove.name,
        frequency: powerMove.frequency,
        weeklyTarget: powerMove.weeklyTarget,
        owner: powerMove.owner,
        ownerId: powerMove.ownerId,
        linkedVictoryTargetId: powerMove.linkedVictoryTargetId,
        linkedVictoryTargetTitle: powerMove.linkedVictoryTargetTitle,
      })
    } else {
      setFormData({
        brandId: getDefaultBrandId(),
        department: "M",
        name: "",
        frequency: "weekly",
        weeklyTarget: 0,
        owner: "",
        ownerId: undefined,
        linkedVictoryTargetId: undefined,
        linkedVictoryTargetTitle: "",
      })
    }
  }, [powerMove, open, brands])

  useEffect(() => {
    if (!formData.brandId && brands.length > 0) {
      setFormData((prev) => ({ ...prev, brandId: brands[0].brand_slug }))
    }
  }, [brands, formData.brandId])

  const selectedOwner = users.find((user) => user.id === formData.ownerId)
  const ownerDepartments = selectedOwner?.departments || []
  const availableDepartments = ownerDepartments.length > 0 ? ownerDepartments.map((dept) => dept.code) : null

  useEffect(() => {
    if (!availableDepartments || availableDepartments.length === 0) return
    if (!availableDepartments.includes(formData.department)) {
      setFormData((prev) => ({ ...prev, department: availableDepartments[0] }))
    }
  }, [availableDepartments, formData.department])

  const filteredVictoryTargets = victoryTargets.filter((target) => {
    const matchesBrand = target.brandId ? target.brandId === formData.brandId : true
    const matchesDepartment = target.department ? target.department === formData.department : true
    const matchesOwner = formData.ownerId ? target.ownerId === formData.ownerId : true
    return matchesBrand && matchesDepartment && matchesOwner
  })

  useEffect(() => {
    if (!formData.linkedVictoryTargetId) return
    const stillValid = filteredVictoryTargets.some((target) => target.id === formData.linkedVictoryTargetId)
    if (!stillValid) {
      setFormData((prev) => ({ ...prev, linkedVictoryTargetId: undefined, linkedVictoryTargetTitle: "" }))
    }
  }, [filteredVictoryTargets, formData.linkedVictoryTargetId])

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

    const loadTargets = async () => {
      setIsLoadingTargets(true)
      setTargetsError(null)
      try {
        const response = await fetch("/api/admin/victory-targets", { cache: "no-store" })
        const result = await response.json()
        if (!response.ok) {
          setTargetsError(result?.error || "Unable to load victory targets.")
          setVictoryTargets([])
          return
        }

        if (Array.isArray(result.targets)) {
          setVictoryTargets(
            result.targets.map((target: {
              id: string
              title: string
              owner?: string
              ownerId?: string
              brandId?: string
              department?: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
            }) => ({
              id: target.id,
              title: target.title,
              owner: target.owner,
              ownerId: target.ownerId,
              brandId: target.brandId,
              department: target.department,
            })),
          )
        } else {
          setVictoryTargets([])
        }
      } catch (error) {
        setTargetsError(error instanceof Error ? error.message : "Unable to load victory targets.")
        setVictoryTargets([])
      } finally {
        setIsLoadingTargets(false)
      }
    }

    loadUsers()
    loadTargets()
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{powerMove ? "Edit Power Move (Lead Measure)" : "Add Power Move (Lead Measure)"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* LEFT SECTION: Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="name">Title *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Daily Report Update"
                  required
                />
                <p className="text-xs text-muted-foreground">e.g., Webinars Conducted</p>
              </div>

              {/* Frequency and Repeat On */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value: "daily" | "weekly" | "monthly") =>
                      setFormData({ ...formData, frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Repeat On *</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const days = [...(formData.customDays || [])]
                          if (days.includes(day)) {
                            days.splice(days.indexOf(day), 1)
                          } else {
                            days.push(day)
                          }
                          setFormData({ ...formData, customDays: days })
                        }}
                        className={`py-2 px-1.5 rounded text-xs font-semibold transition-colors ${
                          formData.customDays?.includes(day)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Select the days this power move is expected to be completed.</p>
                </div>
              </div>

              {/* Target Per Cycle and Start Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weeklyTarget">Target Per Cycle *</Label>
                  <Input
                    id="weeklyTarget"
                    type="number"
                    value={formData.weeklyTarget}
                    onChange={(e) => setFormData({ ...formData, weeklyTarget: Number(e.target.value) })}
                    placeholder="5"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Based on selected days (Mon-Fri)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    defaultValue="2026-06-10"
                    required
                  />
                  <p className="text-xs text-muted-foreground">When tracking should begin</p>
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  placeholder="Leave empty for no end date"
                />
                <p className="text-xs text-muted-foreground">Leave empty for no end date</p>
              </div>

              {/* Owner */}
              <div className="space-y-2">
                <Label htmlFor="owner">Owner *</Label>
                <Select
                  value={formData.ownerId || ""}
                  onValueChange={(value) => {
                    const selectedUser = users.find((user) => user.id === value)
                    setFormData({
                      ...formData,
                      ownerId: value || undefined,
                      owner: selectedUser?.name || "",
                    })
                  }}
                >
                  <SelectTrigger>
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
                <p className="text-xs text-muted-foreground">Select the owner responsible for this power move.</p>
              </div>

              {/* Victory Target */}
              <div className="space-y-2">
                <Label htmlFor="linkedVictoryTarget">Link to Victory Targets (Optional)</Label>
                {filteredVictoryTargets.length > 0 ? (
                  <Select
                    value={formData.linkedVictoryTargetId || ""}
                    onValueChange={(value) => {
                      const selectedTarget = victoryTargets.find((target) => target.id === value)
                      setFormData({
                        ...formData,
                        linkedVictoryTargetId: value,
                        linkedVictoryTargetTitle: selectedTarget?.title || "",
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingTargets ? "Loading..." : "Select victory target"} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredVictoryTargets.map((target) => (
                        <SelectItem key={target.id} value={target.id}>
                          {target.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formData.ownerId
                      ? "No victory targets found for selected filters."
                      : "Choose a victory target to link this power move."}
                  </p>
                )}
              </div>

              {/* Auto-create checkbox */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="autocreate"
                  defaultChecked
                  className="mt-1"
                />
                <label htmlFor="autocreate" className="text-sm">
                  <strong>Auto-create recurring tasks</strong>
                  <p className="text-xs text-muted-foreground mt-1">Automatically create tasks for the selected days.</p>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" onClick={handleSubmit}>
                  Save & Add Another
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save
                </Button>
              </div>
            </form>
          </div>

          {/* RIGHT SECTION: Preview */}
          <div className="space-y-6 border-l pl-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">Preview Summary</h3>
              <p className="text-sm text-muted-foreground mb-4">This is how the power move will be tracked.</p>
              
              {(() => {
                const preview = generatePreviewData(formData.frequency, formData.weeklyTarget, undefined, formData.customDays)
                return (
                  <div className="space-y-4">
                    {/* Frequency and Target */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Frequency</span>
                        <span className="font-semibold text-sm">Custom Days (Mon, Tue, Wed, Thu, Fri)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Target Per Cycle</span>
                        <span className="font-semibold text-sm">{formData.weeklyTarget} times per week</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Start Date</span>
                        <span className="font-semibold text-sm">Jun 10, 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">First Cycle</span>
                        <span className="font-semibold text-sm">Jun 10 - Jun 14, 2026</span>
                      </div>
                    </div>

                    {/* Weekly View Example */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Weekly View Example</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {preview.weeklyView.map((day) => (
                          <div key={day.day} className="text-center">
                            <div className="text-xs font-semibold text-muted-foreground mb-1">{day.day}</div>
                            <div className="text-2xl">{day.status === "completed" ? "✓" : "⭕"}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-3 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">✓</span>
                          <span>Target</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">1</span>
                          <span>Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Calendar Example */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Monthly Calendar Example</h4>
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="text-sm font-semibold mb-2">June 2026</div>
                        <div className="grid grid-cols-7 gap-1 text-xs">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                            <div key={d} className="text-center font-semibold text-muted-foreground py-1">
                              {d}
                            </div>
                          ))}
                          {preview.monthlyCalendar.slice(0, 30).map((day, idx) => (
                            <div
                              key={idx}
                              className={`text-center py-1 rounded text-xs font-medium ${
                                day.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : day.status === "missed"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {day.date}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex gap-4 mt-3 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 bg-green-100 rounded border border-green-200"></span>
                          <span>Completed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 bg-red-100 rounded border border-red-200"></span>
                          <span>Missed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 bg-gray-100 rounded border border-gray-200"></span>
                          <span>Not Due</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
