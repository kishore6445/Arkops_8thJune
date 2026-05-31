"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LoadMoreButtonProps {
  onLoadMore: () => void
  isLoading: boolean
}

export function LoadMoreButton({ onLoadMore, isLoading }: LoadMoreButtonProps) {
  return (
    <div className="flex justify-center mt-4">
      <Button onClick={onLoadMore} variant="outline" disabled={isLoading} className="gap-2 bg-transparent">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          "Load More"
        )}
      </Button>
    </div>
  )
}
