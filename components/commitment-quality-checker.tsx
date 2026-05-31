"use client"

import { AlertCircle, CheckCircle2 } from "lucide-react"

interface CommitmentQualityCheckerProps {
  commitmentText: string
}

export function CommitmentQualityChecker({ commitmentText }: CommitmentQualityCheckerProps) {
  const checkQuality = (text: string) => {
    if (!text || text.length < 10) {
      return { quality: "too-short", message: "Commitment is too vague. Be more specific." }
    }

    const hasNumber = /\d+/.test(text)
    const hasVerb = /(call|send|create|complete|finish|update|review|meet|deliver|launch)/i.test(text)
    const hasTimeframe = /(today|tomorrow|monday|tuesday|wednesday|thursday|friday|by|before)/i.test(text)

    const vagueWords = /(work on|look into|think about|consider|maybe|try to|work with)/i.test(text)

    if (vagueWords) {
      return { quality: "vague", message: "⚠️ Too vague. Use specific action verbs and numbers." }
    }

    if (hasNumber && hasVerb && hasTimeframe) {
      return { quality: "excellent", message: "✓ Excellent commitment! Specific and measurable." }
    }

    if (hasVerb && (hasNumber || hasTimeframe)) {
      return { quality: "good", message: "Good commitment. Consider adding a specific timeframe or quantity." }
    }

    return { quality: "needs-work", message: "Make this more specific with numbers and timeframes." }
  }

  const { quality, message } = checkQuality(commitmentText)

  if (!commitmentText) return null

  const colorClasses = {
    "too-short": "text-gray-500",
    vague: "text-amber-600",
    "needs-work": "text-amber-600",
    good: "text-blue-600",
    excellent: "text-green-600",
  }

  const bgClasses = {
    "too-short": "bg-gray-100 border-gray-200",
    vague: "bg-amber-50 border-amber-200",
    "needs-work": "bg-amber-50 border-amber-200",
    good: "bg-blue-50 border-blue-200",
    excellent: "bg-green-50 border-green-200",
  }

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border ${bgClasses[quality]} mt-2`}>
      {quality === "excellent" ? (
        <CheckCircle2 className={`h-4 w-4 ${colorClasses[quality]} mt-0.5 shrink-0`} />
      ) : (
        <AlertCircle className={`h-4 w-4 ${colorClasses[quality]} mt-0.5 shrink-0`} />
      )}
      <p className={`text-sm font-medium ${colorClasses[quality]}`}>{message}</p>
    </div>
  )
}
