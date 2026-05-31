import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function VictoryTargetsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading Victory Targets">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded w-16 shrink-0"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-8 mb-1"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-10"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </CardContent>
        </Card>
      ))}
      <span className="sr-only">Loading Victory Targets...</span>
    </div>
  )
}
