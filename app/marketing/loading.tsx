import { AppShell } from "@/components/app-shell"
import { DepartmentPageSkeleton } from "@/components/skeleton-loader"

export default function Loading() {
  return (
    <AppShell>
      <DepartmentPageSkeleton />
    </AppShell>
  )
}
