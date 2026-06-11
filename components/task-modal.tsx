"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "@/lib/brand-structure"
import { X } from "lucide-react"

interface TaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Partial<Task>) => void
  initialTask?: Task
}

export function TaskModal({ open, onOpenChange, onSave, initialTask }: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    owner: "",
    status: "pending",
    priority: "medium",
  })

  useEffect(() => {
    if (initialTask) {
      setFormData(initialTask)
    } else {
      setFormData({
        title: "",
        dueDate: new Date().toISOString().split("T")[0],
        owner: "",
        status: "pending",
        priority: "medium",
      })
    }
  }, [initialTask, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.dueDate && formData.owner) {
      onSave(formData)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full p-0 gap-0 max-h-[95vh] overflow-hidden flex flex-col" style={{ maxWidth: "500px" }}>
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle>{initialTask ? "Edit Task" : "Create Task"}</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Review quarterly report"
              required
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate || ""}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
            />
          </div>

          {/* Owner */}
          <div className="space-y-2">
            <Label htmlFor="owner">Assigned To *</Label>
            <Input
              id="owner"
              value={formData.owner || ""}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="e.g., John Doe"
              required
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority || "medium"} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status || "pending"} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit}>
            Save Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
