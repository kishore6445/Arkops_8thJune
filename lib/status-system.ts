// Unified Status System for Arkmedis OS
// Used across War Dashboard, Department Pages, and Individual Dashboard

export type ExecutionStatus = 'WINNING' | 'AT RISK' | 'BEHIND'

interface StatusConfig {
  status: ExecutionStatus
  bg: string
  text: string
  border: string
  badge: string
}

export function getExecutionStatus(percentage: number): ExecutionStatus {
  if (percentage >= 70) return 'WINNING'
  if (percentage >= 50) return 'AT RISK'
  return 'BEHIND'
}

export function getStatusConfig(percentage: number): StatusConfig {
  const status = getExecutionStatus(percentage)
  
  const configs: Record<ExecutionStatus, StatusConfig> = {
    WINNING: {
      status: 'WINNING',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-300 border-l-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    'AT RISK': {
      status: 'AT RISK',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-300 border-l-amber-500',
      badge: 'bg-amber-100 text-amber-800'
    },
    BEHIND: {
      status: 'BEHIND',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-300 border-l-rose-500',
      badge: 'bg-rose-100 text-rose-800'
    }
  }

  return configs[status]
}

export function getStatusColor(percentage: number): string {
  if (percentage >= 70) return '#16A34A' // Emerald
  if (percentage >= 50) return '#F59E0B' // Amber
  return '#DC2626' // Rose
}

export function getStatusLabel(percentage: number): ExecutionStatus {
  return getExecutionStatus(percentage)
}
