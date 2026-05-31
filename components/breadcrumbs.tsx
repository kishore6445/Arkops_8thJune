"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }]

    const labelMap: Record<string, string> = {
      dashboard: "My Dashboard",
      marketing: "Marketing",
      accounts: "Accounts / Compliance / Finance",
      sales: "Sales",
      team: "Team Tools & SOPs",
      execution: "Execution & Operations",
      rnd: "R&D / Risk",
      leadership: "You (Leadership & Strategy)",
      "company-review": "Company Review",
      "daily-report": "Daily Report",
      admin: "Admin",
    }

    paths.forEach((path, index) => {
      const href = index === paths.length - 1 ? undefined : `/${paths.slice(0, index + 1).join("/")}`
      breadcrumbs.push({
        label: labelMap[path] || path.charAt(0).toUpperCase() + path.slice(1),
        href,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs on home page
  if (pathname === "/") return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4 lg:mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={crumb.label} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className={cn(
                    "hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded px-1 -mx-1",
                    "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {index === 0 && <Home className="h-4 w-4 inline mr-1" aria-hidden="true" />}
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
