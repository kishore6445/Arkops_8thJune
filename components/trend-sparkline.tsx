"use client"

import { useEffect, useRef } from "react"

interface TrendSparklineProps {
  data: number[] // Last 8 weeks of progress percentages
  className?: string
}

export function TrendSparkline({ data, className = "" }: TrendSparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    if (data.length === 0) return

    // Calculate points
    const max = Math.max(...data, 100)
    const min = Math.min(...data, 0)
    const range = max - min || 1

    const stepX = width / (data.length - 1 || 1)
    const points = data.map((value, index) => ({
      x: index * stepX,
      y: height - ((value - min) / range) * height,
    }))

    const gradient = ctx.createLinearGradient(0, 0, width, 0)
    const lastValue = data[data.length - 1]
    const firstValue = data[0]

    if (lastValue > firstValue) {
      gradient.addColorStop(0, "#10b981") // green for upward trend
      gradient.addColorStop(1, "#059669")
    } else {
      gradient.addColorStop(0, "#ef4444") // red for downward trend
      gradient.addColorStop(1, "#dc2626")
    }

    ctx.strokeStyle = gradient
    ctx.lineWidth = 2
    ctx.lineJoin = "round"
    ctx.lineCap = "round"

    // Draw the line
    ctx.beginPath()
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()

    // Draw dots at each point
    ctx.fillStyle = lastValue > firstValue ? "#10b981" : "#ef4444"
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [data])

  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={24}
      className={`inline-block ${className}`}
      aria-label="Progress trend over last 8 weeks"
    />
  )
}
