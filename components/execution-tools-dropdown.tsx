"use client"

import type React from "react"

import { ExternalLink, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface ExecutionTool {
  label: string
  description: string
  url: string
  icon?: React.ReactNode
  requiresPermission?: boolean
}

export interface ExecutionToolsConfig {
  [department: string]: ExecutionTool[]
}

// Global config mapping departments to their execution tools
export const executionToolsConfig: ExecutionToolsConfig = {
  marketing: [
    {
      label: "Open CRM (Leads & Sources)",
      description: "Leads captured from webinars & emails",
      url: "/crm?filter=marketing",
      icon: "🔗",
    },
    {
      label: "Open Sprint Board (Marketing Tasks)",
      description: "View and manage marketing sprint tasks",
      url: "/sprints?team=marketing",
      icon: "🔗",
    },
    {
      label: "View Campaign Evidence",
      description: "Assets and proof of campaign execution",
      url: "/campaigns",
      icon: "🔗",
    },
  ],
  accounts: [
    {
      label: "Open Finance App (Invoices & Collections)",
      description: "Track invoices, payments, and collections",
      url: "/finance?view=invoices",
      icon: "🔗",
      requiresPermission: true,
    },
    {
      label: "Open Sprint Board (Finance Tasks)",
      description: "View and manage finance sprint tasks",
      url: "/sprints?team=finance",
      icon: "🔗",
    },
  ],
  sales: [
    {
      label: "Open CRM (Pipeline & Deals)",
      description: "Manage sales pipeline and track deals",
      url: "/crm?filter=sales",
      icon: "🔗",
    },
    {
      label: "Open Sprint Board (Sales Tasks)",
      description: "View and manage sales sprint tasks",
      url: "/sprints?team=sales",
      icon: "🔗",
    },
  ],
  team: [
    {
      label: "Open Sprint Board (Team Tasks)",
      description: "View and manage team operations tasks",
      url: "/sprints?team=team",
      icon: "🔗",
    },
  ],
  execution: [
    {
      label: "Open Sprint Board (Execution Tasks)",
      description: "View and manage execution tasks",
      url: "/sprints?team=execution",
      icon: "🔗",
    },
  ],
  rnd: [
    {
      label: "Open Sprint Board (R&D Tasks)",
      description: "View and manage R&D sprint tasks",
      url: "/sprints?team=rnd",
      icon: "🔗",
    },
  ],
  leadership: [
    {
      label: "Open Company CRM Summary",
      description: "High-level view of all sales activities",
      url: "/crm?view=summary",
      icon: "🔗",
      requiresPermission: true,
    },
    {
      label: "Open Finance Overview",
      description: "Read-only financial dashboard",
      url: "/finance?view=overview",
      icon: "🔗",
      requiresPermission: true,
    },
  ],
}

interface ExecutionToolsDropdownProps {
  departmentKey: string
  userPermissions?: string[]
}

export function ExecutionToolsDropdown({ departmentKey, userPermissions = [] }: ExecutionToolsDropdownProps) {
  const tools = executionToolsConfig[departmentKey] || []

  // Filter tools based on permissions (for now, show all in demo)
  const availableTools = tools.filter((tool) => {
    if (tool.requiresPermission) {
      // In a real app, check userPermissions array
      // For demo purposes, we'll show all tools
      return true
    }
    return true
  })

  const hasTools = availableTools.length > 0

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px]">
              {hasTools ? (
                availableTools.map((tool, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                    onClick={() => window.open(tool.url, "_blank")}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-base">{tool.icon}</span>
                      <span className="font-medium text-sm">{tool.label}</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground pl-6">{tool.description}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled className="text-sm text-muted-foreground">
                  No execution tools available for this department
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[240px] text-center">
          <p className="text-xs">Configure external tools links for this department</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
