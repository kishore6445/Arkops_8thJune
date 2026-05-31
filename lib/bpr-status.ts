export type BPRStatus = "green" | "yellow" | "red"

export interface BPRStatusConfig {
  status: BPRStatus
  label: string
  description: string
  bgClass: string
  textClass: string
  borderColor: string
  badgeClass: string
  iconColor: string
}

/**
 * Calculate BPR status based on progress percentage
 * Following Alan Mulally's BPR methodology:
 * - Green: 70%+ (On track, no help needed)
 * - Yellow: 50-69% (Caution, may need help)
 * - Red: <50% (Off target, needs help now)
 */
export function getBPRStatus(actual: number, target: number): BPRStatus {
  if (!target || target === 0) return "red"
  const progress = (actual / target) * 100

  if (progress >= 70) return "green"
  if (progress >= 50) return "yellow"
  return "red"
}

/**
 * Get BPR status configuration for consistent styling
 */
export function getBPRStatusConfig(status: BPRStatus): BPRStatusConfig {
  const configs: Record<BPRStatus, BPRStatusConfig> = {
    green: {
      status: "green",
      label: "ON TRACK",
      description: "No help needed - continue execution",
      bgClass: "bg-green-50",
      textClass: "text-green-700",
      borderColor: "#16a34a",
      badgeClass: "bg-green-600 text-white border-green-600",
      iconColor: "text-green-600",
    },
    yellow: {
      status: "yellow",
      label: "CAUTION",
      description: "May need help - monitor closely",
      bgClass: "bg-yellow-50",
      textClass: "text-yellow-700",
      borderColor: "#eab308",
      badgeClass: "bg-yellow-500 text-white border-yellow-500",
      iconColor: "text-yellow-600",
    },
    red: {
      status: "red",
      label: "NEEDS HELP",
      description: "Off target - requires immediate attention",
      bgClass: "bg-red-50",
      textClass: "text-red-700",
      borderColor: "#dc2626",
      badgeClass: "bg-red-600 text-white border-red-600",
      iconColor: "text-red-600",
    },
  }

  return configs[status]
}

/**
 * Get progress percentage for display
 */
export function getProgressPercentage(actual: number, target: number): number {
  if (!target || target === 0) return 0
  return Math.round((actual / target) * 100)
}

/**
 * Determine if item needs special attention (Mulally's BPR principle)
 */
export function needsSpecialAttention(status: BPRStatus): boolean {
  return status === "red"
}

/**
 * Get hex color code for BPR status
 */
export function getBPRColor(status: BPRStatus): string {
  const colors: Record<BPRStatus, string> = {
    green: "#16a34a",
    yellow: "#eab308",
    red: "#dc2626",
  }
  return colors[status]
}

export { getBPRColor as getBPRStatusColor }

/**
 * Get BPR status circle styling for visual display
 */
export function getBPRStatusCircle(percentage: number): {
  bgColor: string
  status: BPRStatus
  label: string
} {
  const status = percentage >= 70 ? "green" : percentage >= 50 ? "yellow" : "red"
  const config = getBPRStatusConfig(status)

  return {
    bgColor: status === "green" ? "bg-emerald-600" : status === "yellow" ? "bg-amber-500" : "bg-red-500",
    status,
    label: config.label,
  }
}
