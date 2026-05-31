"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Save, TrendingUp } from "lucide-react"
import { DepartmentChip } from "@/components/department-chip"
import { useToast } from "@/hooks/use-toast"

type AchievementEntry = {
  id: string
  department: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
  victoryTarget: string
  target: number
  achieved: number
  lastUpdated: string
  updatedBy: string
}

const MOCK_ACHIEVEMENTS: AchievementEntry[] = []

export function AchievementTracking() {
  const [achievements, setAchievements] = useState<AchievementEntry[]>(MOCK_ACHIEVEMENTS)
  const [deptFilter, setDeptFilter] = useState<string>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const { toast } = useToast()

  const filteredAchievements =
    deptFilter === "all" ? achievements : achievements.filter((a) => a.department === deptFilter)

  const handleStartEdit = (id: string, currentValue: number) => {
    setEditingId(id)
    setEditValue(currentValue)
  }

  const handleSaveAchievement = (id: string) => {
    setAchievements(
      achievements.map((a) =>
        a.id === id
          ? {
              ...a,
              achieved: editValue,
              lastUpdated: new Date().toISOString().split("T")[0],
              updatedBy: "Admin User",
            }
          : a,
      ),
    )
    setEditingId(null)
    toast({
      title: "Achievement Updated",
      description: "Victory Target achievement has been updated successfully.",
    })
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievement Tracking</h1>
          <p className="text-gray-600">Update achieved numbers for Victory Targets across all departments.</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="M">Marketing</SelectItem>
            <SelectItem value="A">Accounts/Finance</SelectItem>
            <SelectItem value="S">Sales</SelectItem>
            <SelectItem value="T">Team Tools & SOPs</SelectItem>
            <SelectItem value="E">Execution/Ops</SelectItem>
            <SelectItem value="R">R&D/Risk</SelectItem>
            <SelectItem value="Y">Leadership</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Victory Target</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Achieved</TableHead>
              <TableHead>Gap</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Updated By</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAchievements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                  No achievement records available.
                </TableCell>
              </TableRow>
            ) : (
              filteredAchievements.map((achievement) => {
              const gap = achievement.target - achievement.achieved
              const progress = Math.round((achievement.achieved / achievement.target) * 100)
              const isEditing = editingId === achievement.id

              return (
                <TableRow key={achievement.id}>
                  <TableCell>
                    <DepartmentChip code={achievement.department} />
                  </TableCell>
                  <TableCell className="font-medium">{achievement.victoryTarget}</TableCell>
                  <TableCell className="text-gray-900 font-semibold">{achievement.target.toLocaleString()}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="w-32"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => handleStartEdit(achievement.id, achievement.achieved)}
                        className="text-gray-900 font-semibold hover:text-blue-600 transition-colors"
                      >
                        {achievement.achieved.toLocaleString()}
                      </button>
                    )}
                  </TableCell>
                  <TableCell className="text-red-600 font-semibold">
                    {isEditing ? (achievement.target - editValue).toLocaleString() : gap.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${Math.min(isEditing ? (editValue / achievement.target) * 100 : progress, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {isEditing ? Math.round((editValue / achievement.target) * 100) : progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{achievement.lastUpdated}</TableCell>
                  <TableCell className="text-gray-600">{achievement.updatedBy}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleSaveAchievement(achievement.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(achievement.id, achievement.achieved)}
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            }))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Update Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>Click on the "Achieved" number to edit it inline</li>
          <li>Progress bars and gaps update automatically</li>
          <li>All changes are logged with timestamp and user</li>
          <li>BPR traffic lights update based on progress percentage</li>
        </ul>
      </div>
    </>
  )
}
