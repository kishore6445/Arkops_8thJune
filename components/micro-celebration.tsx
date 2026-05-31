"use client"

import { useState, useEffect } from "react"

interface MicroCelebrationProps {
  show: boolean
  message: string
  onComplete?: () => void
}

export function MicroCelebration({ show, message, onComplete }: MicroCelebrationProps) {
  const [visible, setVisible] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([])

  useEffect(() => {
    if (show) {
      setVisible(true)

      // Generate confetti particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][Math.floor(Math.random() * 5)],
      }))
      setParticles(newParticles)

      // Hide after animation
      const timer = setTimeout(() => {
        setVisible(false)
        setParticles([])
        onComplete?.()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!visible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}

      {/* Message */}
      <div className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-2xl border animate-bounce-in">
        <p className="text-xl font-bold text-center text-foreground">{message}</p>
      </div>
    </div>
  )
}
