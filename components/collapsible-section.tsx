"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  badge?: string | number
  defaultExpanded?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({ title, icon, badge, defaultExpanded = false, children }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card className="overflow-hidden shadow-sm border-muted hover:shadow-md transition-shadow">
      <Button
        variant="ghost"
        className="w-full h-auto py-3 px-5 flex items-center justify-between hover:bg-muted/70 rounded-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 group"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, "-").toLowerCase()}`}
        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${title} section`}
      >
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="group-hover:scale-110 transition-transform duration-200">
            {icon}
          </span>
          <h2 className="text-base font-semibold group-hover:text-primary transition-colors">{title}</h2>
          {badge !== undefined && (
            <Badge variant="secondary" className="text-xs" aria-label={`${badge} items`}>
              {badge}
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
        )}
      </Button>

      {isExpanded && (
        <div
          className="px-5 pb-5"
          id={`collapsible-content-${title.replace(/\s+/g, "-").toLowerCase()}`}
          role="region"
          aria-label={`${title} content`}
        >
          {children}
        </div>
      )}
    </Card>
  )
}
