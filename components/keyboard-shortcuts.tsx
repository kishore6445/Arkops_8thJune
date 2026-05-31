"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface KeyboardShortcutsProps {
  onQuickAdd?: () => void
}

export function KeyboardShortcuts({ onQuickAdd }: KeyboardShortcutsProps) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K for quick add
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        if (onQuickAdd) {
          onQuickAdd()
        }
      }

      // Command/Ctrl + 1-7 for department navigation
      if ((e.metaKey || e.ctrlKey) && e.key >= "1" && e.key <= "7") {
        e.preventDefault()
        const routes = [
          "/dashboard", // 1
          "/", // 2 (WAR Dashboard)
          "/marketing", // 3
          "/accounts", // 4
          "/sales", // 5
          "/team", // 6
          "/execution", // 7
        ]
        const index = Number.parseInt(e.key) - 1
        if (routes[index]) {
          router.push(routes[index])
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [router, onQuickAdd])

  return null // This is a headless component
}
