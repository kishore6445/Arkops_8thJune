"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CalendarDays, Clock, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WIGSessionSchedulerProps {
  departmentName: string
  onSchedule?: (schedule: any) => void
}

export function WIGSessionScheduler({ departmentName, onSchedule }: WIGSessionSchedulerProps) {
  const { toast } = useToast()
  const [recurring, setRecurring] = useState<"weekly" | "bi-weekly">("weekly")
  const [dayOfWeek, setDayOfWeek] = useState<string>("thursday")
  const [time, setTime] = useState<string>("10:00")
  const [duration, setDuration] = useState<string>("60")
  const [facilitator, setFacilitator] = useState<string>("")

  const handleSchedule = () => {
    const schedule = {
      departmentName,
      recurring,
      dayOfWeek,
      time,
      duration: Number.parseInt(duration),
      facilitator,
    }

    toast({
      title: "WIG Session Scheduled",
      description: `${departmentName} will meet every ${dayOfWeek} at ${time} for ${duration} minutes`,
    })

    onSchedule?.(schedule)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Schedule Weekly WIG Sessions
        </CardTitle>
        <CardDescription>Create a recurring cadence of accountability for your team (4DX Discipline 4)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recurring">Frequency</Label>
            <Select value={recurring} onValueChange={(v) => setRecurring(v as "weekly" | "bi-weekly")}>
              <SelectTrigger id="recurring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="day">Day of Week</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger id="day">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time
            </Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="facilitator" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Meeting Facilitator
            </Label>
            <Input
              id="facilitator"
              placeholder="Enter facilitator name"
              value={facilitator}
              onChange={(e) => setFacilitator(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={handleSchedule} size="lg" className="gap-2">
            <CalendarDays className="h-5 w-5" />
            Schedule WIG Sessions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
