"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface FiltersBarProps {
  filters: {
    owner?: string
    status?: string
    timeframe?: string
    linkedTarget?: string
  }
  onFiltersChange: (filters: any) => void
  availableOwners?: string[]
  availableTargets?: string[]
}

export function FiltersBar({ filters, onFiltersChange, availableOwners = [], availableTargets = [] }: FiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const removeFilter = (key: string) => {
    const newFilters = { ...filters }
    delete newFilters[key as keyof typeof filters]
    onFiltersChange(newFilters)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
          aria-expanded={showFilters}
          aria-controls="filters-panel"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-gray-600 hover:text-gray-900">
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Active filters">
          {filters.owner && (
            <Badge variant="outline" className="gap-1.5 pr-1.5" role="listitem">
              Owner: {filters.owner}
              <button
                onClick={() => removeFilter("owner")}
                className="hover:bg-gray-200 rounded-full p-0.5"
                aria-label="Remove owner filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status && (
            <Badge variant="outline" className="gap-1.5 pr-1.5" role="listitem">
              Status: {filters.status}
              <button
                onClick={() => removeFilter("status")}
                className="hover:bg-gray-200 rounded-full p-0.5"
                aria-label="Remove status filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.timeframe && (
            <Badge variant="outline" className="gap-1.5 pr-1.5" role="listitem">
              Timeframe: {filters.timeframe}
              <button
                onClick={() => removeFilter("timeframe")}
                className="hover:bg-gray-200 rounded-full p-0.5"
                aria-label="Remove timeframe filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.linkedTarget && (
            <Badge variant="outline" className="gap-1.5 pr-1.5" role="listitem">
              Linked to: {filters.linkedTarget}
              <button
                onClick={() => removeFilter("linkedTarget")}
                className="hover:bg-gray-200 rounded-full p-0.5"
                aria-label="Remove linked target filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Filter Controls */}
      {showFilters && (
        <div
          id="filters-panel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          {availableOwners.length > 0 && (
            <div>
              <label htmlFor="owner-filter" className="text-xs font-medium text-gray-700 mb-1.5 block">
                Owner
              </label>
              <Select
                value={filters.owner || "all"}
                onValueChange={(value) => onFiltersChange({ ...filters, owner: value === "all" ? undefined : value })}
              >
                <SelectTrigger id="owner-filter" className="w-full">
                  <SelectValue placeholder="All owners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All owners</SelectItem>
                  {availableOwners.map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      {owner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label htmlFor="status-filter" className="text-xs font-medium text-gray-700 mb-1.5 block">
              Status
            </label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => onFiltersChange({ ...filters, status: value === "all" ? undefined : value })}
            >
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="behind">Behind</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="timeframe-filter" className="text-xs font-medium text-gray-700 mb-1.5 block">
              Timeframe
            </label>
            <Select
              value={filters.timeframe || "all"}
              onValueChange={(value) => onFiltersChange({ ...filters, timeframe: value === "all" ? undefined : value })}
            >
              <SelectTrigger id="timeframe-filter" className="w-full">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {availableTargets && availableTargets.length > 0 && (
            <div>
              <label htmlFor="target-filter" className="text-xs font-medium text-gray-700 mb-1.5 block">
                Linked Target
              </label>
              <Select
                value={filters.linkedTarget || "all"}
                onValueChange={(value) =>
                  onFiltersChange({ ...filters, linkedTarget: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger id="target-filter" className="w-full">
                  <SelectValue placeholder="All targets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All targets</SelectItem>
                  {availableTargets.map((target) => (
                    <SelectItem key={target} value={target}>
                      {target}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
