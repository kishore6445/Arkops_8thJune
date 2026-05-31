import { AppShell } from "@/components/app-shell"
import { CompanyWIGSkeleton, DepartmentCardSkeleton } from "@/components/skeleton-loader"

export default function Loading() {
  return (
    <AppShell>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
        <CompanyWIGSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <DepartmentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
