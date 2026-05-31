"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CommitmentTemplate {
  id: string
  title: string
  category: string
  frequency: string
}

const defaultTemplates: CommitmentTemplate[] = [
  { id: "1", title: "Send weekly update email to team", category: "Communication", frequency: "Weekly" },
  { id: "2", title: "Review team performance metrics", category: "Management", frequency: "Weekly" },
  { id: "3", title: "1-on-1 meetings with direct reports", category: "Leadership", frequency: "Weekly" },
  { id: "4", title: "Update project status dashboard", category: "Operations", frequency: "Weekly" },
  { id: "5", title: "Conduct client follow-up calls", category: "Sales", frequency: "Daily" },
  { id: "6", title: "Review and respond to customer feedback", category: "Support", frequency: "Daily" },
]

interface CommitmentTemplatesProps {
  onAddFromTemplate: (template: CommitmentTemplate) => void
}

export function CommitmentTemplates({ onAddFromTemplate }: CommitmentTemplatesProps) {
  const { toast } = useToast()
  const [templates] = useState<CommitmentTemplate[]>(defaultTemplates)

  const handleUseTemplate = (template: CommitmentTemplate) => {
    onAddFromTemplate(template)
    toast({
      title: "Template Added",
      description: `"${template.title}" has been added to your commitments.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-base">Commitment Templates</CardTitle>
        </div>
        <CardDescription>Quick-add common recurring commitments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{template.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{template.frequency}</span>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleUseTemplate(template)} className="gap-1 shrink-0">
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
