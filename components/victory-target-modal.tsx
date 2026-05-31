"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"

interface VictoryTargetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: VictoryTargetFormData) => void
}

export interface VictoryTargetFormData {
  title: string
  metricType: string
  timeframe: string
  targetValue: number
  owner: string
  paceMethod: string
  notes: string
}

const DUMMY_USERS = ["Sarah M.", "John D.", "Emily R.", "Michael K.", "Jessica L."]

export function VictoryTargetModal({ open, onOpenChange, onSave }: VictoryTargetModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<VictoryTargetFormData>({
    title: "",
    metricType: "count",
    timeframe: "weekly",
    targetValue: 0,
    owner: "",
    paceMethod: "linear",
    notes: "",
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
      case "targetValue":
        if (!value || value <= 0) {
          newErrors.targetValue = "Target must be greater than 0"
        } else if (value > 1000000) {
          newErrors.targetValue = "Target seems unusually high"
        } else {
          delete newErrors.targetValue
        }
        break
      case "owner":
        if (!value) {
          newErrors.owner = "Owner is required"
        } else {
          delete newErrors.owner
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
    if (formData.targetValue <= 0) {
      newErrors.targetValue = "Target must be greater than 0"
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
      await new Promise((resolve) => setTimeout(resolve, 800))

      onSave(formData)

      toast({
        title: "Success!",
        description: `${formData.title} has been created successfully`,
      })

      if (saveAndAddAnother) {
        setFormData({
          title: "",
          metricType: "count",
          timeframe: "weekly",
          targetValue: 0,
          owner: "",
          paceMethod: "linear",
          notes: "",
        })
        setErrors({})
        setHasChanges(false)
      } else {
        onOpenChange(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Victory Target. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const hasAnyChange =
      formData.title !== "" || formData.targetValue > 0 || formData.owner !== "" || formData.notes !== ""
    setHasChanges(hasAnyChange)
  }, [formData])

  useEffect(() => {
    if (open && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && hasChanges && !isLoading) {
      setShowUnsavedWarning(true)
    } else {
      onOpenChange(newOpen)
      if (!newOpen) {
        setFormData({
          title: "",
          metricType: "count",
          timeframe: "weekly",
          targetValue: 0,
          owner: "",
          paceMethod: "linear",
          notes: "",
        })
        setErrors({})
        setHasChanges(false)
      }
    }
  }

  const confirmClose = () => {
    setShowUnsavedWarning(false)
    setFormData({
      title: "",
      metricType: "count",
      timeframe: "weekly",
      targetValue: 0,
      owner: "",
      paceMethod: "linear",
      notes: "",
    })
    setErrors({})
    setHasChanges(false)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Victory Target (Lag Measure)</DialogTitle>
            <DialogDescription>Create a new victory target to track progress toward your WIG</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-md:overflow-y-auto max-md:flex-1 max-md:px-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                ref={titleInputRef}
                id="title"
                placeholder="e.g., Qualified Conversations Touched"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  validateField("title", e.target.value)
                }}
                onBlur={() => validateField("title", formData.title)}
                className={errors.title ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="metricType">Metric Type *</Label>
                <Select value={formData.metricType} onValueChange={(v) => setFormData({ ...formData, metricType: v })}>
                  <SelectTrigger id="metricType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="count">Count</SelectItem>
                    <SelectItem value="currency">Currency</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe *</Label>
                <Select value={formData.timeframe} onValueChange={(v) => setFormData({ ...formData, timeframe: v })}>
                  <SelectTrigger id="timeframe">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetValue">Target Value *</Label>
                <Input
                  id="targetValue"
                  type="number"
                  placeholder="0"
                  value={formData.targetValue || ""}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setFormData({ ...formData, targetValue: value })
                    validateField("targetValue", value)
                  }}
                  onBlur={() => validateField("targetValue", formData.targetValue)}
                  className={errors.targetValue ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.targetValue && <p className="text-sm text-red-600">{errors.targetValue}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Owner *</Label>
                <Select
                  value={formData.owner}
                  onValueChange={(v) => {
                    setFormData({ ...formData, owner: v })
                    validateField("owner", v)
                  }}
                >
                  <SelectTrigger id="owner" className={errors.owner ? "border-red-500 focus-visible:ring-red-500" : ""}>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {DUMMY_USERS.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.owner && <p className="text-sm text-red-600">{errors.owner}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paceMethod">Pace Method *</Label>
              <Select value={formData.paceMethod} onValueChange={(v) => setFormData({ ...formData, paceMethod: v })}>
                <SelectTrigger id="paceMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear pace</SelectItem>
                  <SelectItem value="custom">Custom milestones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional context or details..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[80px]"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">{formData.notes.length}/500</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleSave(true)} disabled={isLoading} className="max-sm:hidden">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Add Another
            </Button>
            <Button onClick={() => handleSave(false)} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
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
