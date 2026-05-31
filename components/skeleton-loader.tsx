import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DepartmentCardSkeleton() {
  return (
    <Card className="h-full animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted w-9 h-9" />
            <div className="h-5 w-24 bg-muted rounded" />
          </div>
          <div className="h-2.5 w-2.5 rounded-full bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-muted rounded" />
            <div className="h-4 w-8 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-4 w-10 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-10 bg-muted rounded" />
            <div className="h-6 w-12 bg-muted rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full" />
          <div className="h-4 w-10 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export function VictoryTargetCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-6 w-16 bg-muted rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-10 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
          <div className="h-2 bg-muted rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export function PowerMoveTableSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-20 bg-muted rounded-full" />
          <div className="h-8 w-8 bg-muted rounded" />
        </div>
      ))}
    </div>
  )
}

export function CompanyWIGSkeleton() {
  return (
    <Card className="border-2 animate-pulse">
      <CardHeader className="pb-3">
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="h-10 w-full max-w-2xl bg-muted rounded" />
        <div className="h-4 w-full max-w-md bg-muted rounded mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-3 w-28 bg-muted rounded" />
            <div className="h-5 w-12 bg-muted rounded" />
          </div>
          <div className="h-3 bg-muted rounded-full" />
          <div className="h-3 w-40 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/30 space-y-2">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-3 w-28 bg-muted rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DepartmentPageSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-32 bg-muted rounded" />
          <div className="h-9 w-24 bg-muted rounded" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex items-center gap-4 border-b">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-32 bg-muted rounded-t" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <VictoryTargetCardSkeleton />
        <VictoryTargetCardSkeleton />
      </div>
    </div>
  )
}
