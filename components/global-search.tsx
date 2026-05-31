"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Search, FileText, Target, TrendingUp, User } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SearchResult {
  id: string
  type: "victory-target" | "power-move" | "commitment" | "user"
  title: string
  description: string
  link: string
  department?: string
}

// Mock search function - will be replaced with real API call
function searchContent(query: string): SearchResult[] {
  if (!query) return []

  const mockResults: SearchResult[] = [
    {
      id: "vt1",
      type: "victory-target",
      title: "Qualified Conversations Touched",
      description: "Target: 1500, Achieved: 420",
      link: "/marketing?tab=victory-targets",
      department: "Marketing",
    },
    {
      id: "pm1",
      type: "power-move",
      title: "Webinars Conducted",
      description: "2/week - Sarah M.",
      link: "/marketing?tab=power-moves",
      department: "Marketing",
    },
    {
      id: "c1",
      type: "commitment",
      title: "Launch LinkedIn ad campaign",
      description: "Due Wednesday - Sarah M.",
      link: "/marketing?tab=commitments",
      department: "Marketing",
    },
  ]

  return mockResults.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()),
  )
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Handle Command+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Search when query changes
  useEffect(() => {
    const results = searchContent(query)
    setResults(results)
    setSelectedIndex(0)
  }, [query])

  // Handle arrow key navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
      } else if (e.key === "Enter" && results[selectedIndex]) {
        window.location.href = results[selectedIndex].link
        setOpen(false)
      }
    },
    [results, selectedIndex],
  )

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "victory-target":
        return <Target className="h-4 w-4" aria-hidden="true" />
      case "power-move":
        return <TrendingUp className="h-4 w-4" aria-hidden="true" />
      case "commitment":
        return <FileText className="h-4 w-4" aria-hidden="true" />
      case "user":
        return <User className="h-4 w-4" aria-hidden="true" />
    }
  }

  const getCategoryLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "victory-target":
        return "Victory Target"
      case "power-move":
        return "Power Move"
      case "commitment":
        return "Commitment"
      case "user":
        return "User"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <Input
            placeholder="Search Victory Targets, Power Moves, Commitments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            autoFocus
            aria-label="Global search"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-xs text-gray-600">
            ESC
          </kbd>
        </div>

        {results.length > 0 ? (
          <div className="max-h-96 overflow-y-auto py-2" role="listbox">
            {results.map((result, index) => (
              <Link
                key={result.id}
                href={result.link}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors",
                  index === selectedIndex && "bg-gray-50",
                )}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div className="mt-0.5 text-blue-600">{getIcon(result.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{result.title}</p>
                    {result.department && <span className="text-xs text-gray-500">in {result.department}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{result.description}</p>
                  <span className="text-xs text-gray-400 mt-1 inline-block">{getCategoryLabel(result.type)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="py-12 text-center text-sm text-gray-500" role="status">
            No results found for "{query}"
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-gray-500" role="status">
            <p className="mb-2">Start typing to search...</p>
            <p className="text-xs">Victory Targets, Power Moves, Commitments, and more</p>
          </div>
        )}

        <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex gap-4">
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 ml-1">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">Enter</kbd> Open
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">⌘K</kbd> to open
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
