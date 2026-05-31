import type { PowerMove, VictoryTarget } from "@/components/department-page"
import { getBPRStatus, getProgressPercentage } from "./bpr-status"

/**
 * Calculate Victory Target progress based on linked Power Moves
 * A Victory Target is achieved when its Power Moves are completed
 */
export function calculateVictoryTargetProgress(
  victoryTarget: VictoryTarget,
  powerMoves: PowerMove[],
): { achieved: number; target: number; progress: number } {
  const linkedPowerMoves = powerMoves.filter((pm) => pm.victoryTargetId === victoryTarget.id)

  if (linkedPowerMoves.length === 0) {
    // No Power Moves linked, use manual values
    return {
      achieved: victoryTarget.achieved ?? 0,
      target: victoryTarget.target ?? 1,
      progress: getProgressPercentage(victoryTarget.achieved ?? 0, victoryTarget.target ?? 1),
    }
  }

  // Calculate average completion rate of linked Power Moves
  const totalProgress = linkedPowerMoves.reduce((sum, pm) => {
    const pmProgress = (pm.progress / pm.targetPerCycle) * 100
    return sum + pmProgress
  }, 0)

  const avgProgress = totalProgress / linkedPowerMoves.length

  // Apply progress percentage to Victory Target
  const target = victoryTarget.target ?? 1
  const achieved = Math.round((avgProgress / 100) * target)

  return {
    achieved,
    target,
    progress: Math.round(avgProgress),
  }
}

/**
 * Calculate Department score based on Victory Targets
 * Department is winning when 70%+ of Victory Targets are green
 */
export function calculateDepartmentScore(victoryTargets: VictoryTarget[], powerMoves: PowerMove[]) {
  if (victoryTargets.length === 0) {
    return {
      greenCount: 0,
      totalTargets: 0,
      percentage: 0,
      status: "red" as const,
    }
  }

  const updatedTargets = victoryTargets.map((vt) => {
    const calculated = calculateVictoryTargetProgress(vt, powerMoves)
    return {
      ...vt,
      achieved: calculated.achieved,
      target: calculated.target,
    }
  })

  const greenCount = updatedTargets.filter((vt) => {
    const progress = getProgressPercentage(vt.achieved ?? 0, vt.target ?? 1)
    return progress >= 70
  }).length

  const percentage = Math.round((greenCount / victoryTargets.length) * 100)
  const status = getBPRStatus(greenCount, victoryTargets.length)

  return {
    greenCount,
    totalTargets: victoryTargets.length,
    percentage,
    status,
    updatedTargets,
  }
}

/**
 * Calculate Company score by aggregating all department scores across all brands
 */
export function calculateCompanyScore(departments: Array<{ score: number; targetsCount: number }>) {
  if (departments.length === 0) {
    return {
      averageScore: 0,
      totalGreenTargets: 0,
      totalTargets: 0,
      status: "red" as const,
    }
  }

  const totalScore = departments.reduce((sum, dept) => sum + dept.score, 0)
  const averageScore = Math.round(totalScore / departments.length)

  const totalGreenTargets = Math.round(
    departments.reduce((sum, dept) => {
      const greenCount = Math.round((dept.score / 100) * dept.targetsCount)
      return sum + greenCount
    }, 0),
  )

  const totalTargets = departments.reduce((sum, dept) => sum + dept.targetsCount, 0)

  const status = getBPRStatus(totalGreenTargets, totalTargets)

  return {
    averageScore,
    totalGreenTargets,
    totalTargets,
    status,
  }
}

/**
 * Calculate individual team member score based on their Power Moves
 */
export function calculateIndividualScore(powerMoves: PowerMove[]) {
  if (powerMoves.length === 0) {
    return {
      completionRate: 0,
      completedMoves: 0,
      totalMoves: 0,
      status: "red" as const,
    }
  }

  const completedCount = powerMoves.filter((pm) => {
    const progress = (pm.progress / pm.targetPerCycle) * 100
    return progress >= 100
  }).length

  const completionRate = Math.round((completedCount / powerMoves.length) * 100)
  const status = getBPRStatus(completedCount, powerMoves.length)

  return {
    completionRate,
    completedMoves: completedCount,
    totalMoves: powerMoves.length,
    status,
  }
}
