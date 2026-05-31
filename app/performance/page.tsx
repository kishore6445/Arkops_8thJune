import { Suspense } from "react"
import { AppShell } from "@/components/app-shell"
import { PerformanceManagement } from "@/components/performance-management"

export default function PerformancePage() {
  return (
    <AppShell>
      <Suspense fallback={<div>Loading...</div>}>
        <PerformanceManagement />
      </Suspense>
    </AppShell>
  )
}
