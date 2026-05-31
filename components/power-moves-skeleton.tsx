import { Card, CardContent } from "@/components/ui/card"

export function PowerMovesSkeleton() {
  return (
    <>
      {/* Desktop Table Skeleton */}
      <Card className="hidden md:block animate-pulse" role="status" aria-label="Loading Power Moves">
        <CardContent className="pt-6">
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </th>
                  <th className="text-right py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </th>
                  <th className="text-center py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                  </th>
                  <th className="text-left py-3 px-4">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="h-4 bg-gray-200 rounded w-8 ml-auto"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 bg-gray-200 rounded w-10"></div>
                        <div className="w-16 h-2 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <span className="sr-only">Loading Power Moves...</span>
      </Card>

      {/* Mobile Card Skeleton */}
      <div className="md:hidden space-y-3 animate-pulse" role="status" aria-label="Loading Power Moves">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="h-5 bg-gray-200 rounded w-40"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
        <span className="sr-only">Loading Power Moves...</span>
      </div>
    </>
  )
}
