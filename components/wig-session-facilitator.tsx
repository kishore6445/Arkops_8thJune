"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Presentation, ChevronRight, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface WIGSessionFacilitatorProps {
  departmentName: string
  isActive: boolean
  onClose: () => void
}

export function WIGSessionFacilitator({ departmentName, isActive, onClose }: WIGSessionFacilitatorProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const agendaSteps = [
    {
      title: "Review the Scoreboard",
      description: "Are we winning? Review Victory Targets and overall progress",
      duration: "5 min",
    },
    {
      title: "Report on Commitments",
      description: "Each team member reports on last week's commitments",
      duration: "10 min",
    },
    {
      title: "Review Power Moves",
      description: "Did we execute our lead measures? What's the activity completion rate?",
      duration: "5 min",
    },
    {
      title: "Plan Next Week",
      description: "Make new commitments that will move the WIG forward",
      duration: "10 min",
    },
  ]

  if (!isActive) {
    return (
      <Button variant="outline" size="sm" onClick={() => {}} className="gap-2">
        <Presentation className="h-4 w-4" />
        Start WIG Session
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 z-50 p-8 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{departmentName} WIG Session</h1>
            <p className="text-blue-200 text-lg">Weekly Accountability Meeting</p>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Exit Facilitator Mode
          </Button>
        </div>

        <Card className="p-8 bg-white/95 backdrop-blur">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              {agendaSteps.map((step, idx) => (
                <div key={idx} className="flex items-center flex-1">
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all",
                      idx === currentStep
                        ? "bg-blue-600 text-white scale-110"
                        : idx < currentStep
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {idx < currentStep ? <CheckCircle2 className="h-6 w-6" /> : idx + 1}
                  </div>
                  {idx < agendaSteps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-1 mx-2 rounded transition-all",
                        idx < currentStep ? "bg-green-600" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="text-center space-y-4 py-12">
              <Badge className="text-sm px-4 py-1">{agendaSteps[currentStep].duration}</Badge>
              <h2 className="text-5xl font-bold text-gray-900">{agendaSteps[currentStep].title}</h2>
              <p className="text-xl text-muted-foreground">{agendaSteps[currentStep].description}</p>
            </div>

            <div className="flex items-center justify-between pt-8 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {agendaSteps.length}
              </div>
              <Button
                onClick={() => (currentStep < agendaSteps.length - 1 ? setCurrentStep(currentStep + 1) : onClose())}
                className="gap-2"
              >
                {currentStep < agendaSteps.length - 1 ? (
                  <>
                    Next <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  "Complete Session"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
