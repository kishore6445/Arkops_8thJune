"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export function useUrlState<T extends string>(key: string, defaultValue: T): [T, (value: T) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize state from URL or default
  const [state, setState] = useState<T>(() => {
    const paramValue = searchParams.get(key)
    return (paramValue as T) || defaultValue
  })

  // Update URL when state changes
  const updateUrl = useCallback(
    (value: T) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === defaultValue) {
        params.delete(key)
      } else {
        params.set(key, value)
      }

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname

      // Use replace to avoid cluttering browser history
      router.replace(newUrl, { scroll: false })
      setState(value)
    },
    [key, defaultValue, pathname, router, searchParams],
  )

  // Sync state with URL changes (for back/forward navigation)
  useEffect(() => {
    const paramValue = searchParams.get(key)
    const urlValue = (paramValue as T) || defaultValue
    if (urlValue !== state) {
      setState(urlValue)
    }
  }, [searchParams, key, defaultValue, state])

  return [state, updateUrl]
}
