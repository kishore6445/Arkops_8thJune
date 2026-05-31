"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

interface AnimatedProgressProps {
  value: number
  className?: string
  "aria-label"?: string
}

export function AnimatedProgress({ value, className, "aria-label": ariaLabel }: AnimatedProgressProps) {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentValue(value)
    }, 100)

    return () => clearTimeout(timer)
  }, [value])

  return (
    <Progress
      value={currentValue}
      className={className}
      aria-label={ariaLabel || `Progress: ${currentValue}%`}
      aria-valuenow={currentValue}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}
