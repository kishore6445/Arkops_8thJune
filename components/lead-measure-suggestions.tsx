"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Plus, Zap } from "lucide-react"

interface Suggestion {
  id: string
  victoryTargetName: string
  suggestedPowerMove: string
  reason: string
  frequency: string
  targetPerCycle: number
}

interface LeadMeasureSuggestionsProps {
  suggestions: Suggestion[]
  onAddSuggestion: (suggestion: Suggestion) => void
}

export function LeadMeasureSuggestions({ suggestions, onAddSuggestion }: LeadMeasureSuggestionsProps) {
  if (suggestions.length === 0) return null

  return (
    <Card className="border-2 border-amber-200 bg-amber-50/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <CardTitle>Suggested Power Moves</CardTitle>
        </div>
        <CardDescription>Consider adding these lead measures to improve at-risk Victory Targets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="p-4 rounded-lg border border-amber-200 bg-white space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    At Risk
                  </Badge>
                  <span className="text-sm font-medium text-gray-900">{suggestion.victoryTargetName}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{suggestion.suggestedPowerMove}</p>
                    <p className="text-sm text-muted-foreground mt-1">{suggestion.reason}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <span>Frequency: {suggestion.frequency}</span>
                      <span>•</span>
                      <span>Target: {suggestion.targetPerCycle} per cycle</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => onAddSuggestion(suggestion)} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
