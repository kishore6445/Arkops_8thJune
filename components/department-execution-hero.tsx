
'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBrand } from '@/lib/brand-context'
import type { VictoryTarget, PowerMove } from '@/components/department-page'
import { calculateDepartmentScore } from '@/lib/score-calculations'
import { TimePeriodSelector } from '@/components/time-period-selector'
import { ExecutionStreak } from '@/components/execution-streak'
import { QuarterSelector, type QuarterOption } from '@/components/quarter-selector'
import { AccountabilitySections } from '@/components/accountability-sections'
import {
  Flame,
  Target,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Zap,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DepartmentExecutionHeroProps {
  departmentName: string
  victoryTargets: VictoryTarget[]
  powerMoves: PowerMove[]
  calculatedScore?: ReturnType<typeof calculateDepartmentScore>
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  currentWeekStart: Date
  onNavigate: (direction: 'prev' | 'next') => void
  onWeeklyReview: () => void
  onAddPowerMove?: () => void
  onAddTask?: () => void
  onAddCommitment?: () => void

  /**
   * This should come from the parent component.
   * The parent owns the powerMoves state, so the parent should update the progress.
   */
  onCompletePowerMove?: (powerMoveId: string) => void

  selectedQuarter: QuarterOption
  onQuarterChange: (quarter: QuarterOption) => void
  coreObjective?: {
    title: string
    description: string
  }
  teamMembers?: Array<{ name: string; role: string }>
}

type TeamMomentumMember = {
  name: string
  role: string
  score: number | null
  streak: number
  status: 'on-track' | 'at-risk' | 'losing' | 'no-data'
}

export function DepartmentExecutionHero({
  departmentName,
  victoryTargets,
  powerMoves,
  calculatedScore,
  selectedPeriod,
  onPeriodChange,
  currentWeekStart,
  onNavigate,
  onWeeklyReview,
  onAddPowerMove,
  onAddTask,
  onAddCommitment,
  onCompletePowerMove,
  selectedQuarter,
  onQuarterChange,
  coreObjective,
  teamMembers = [],
}: DepartmentExecutionHeroProps) {
  const { brandConfig, isReady } = useBrand()
  const [showStreak, setShowStreak] = useState(false)

  const companyWIG = brandConfig?.companyWIG

  const score = useMemo(() => {
    if (calculatedScore) return calculatedScore
    return calculateDepartmentScore(victoryTargets, powerMoves)
  }, [calculatedScore, victoryTargets, powerMoves])

  const powerMoveStats = useMemo(() => {
    const getPowerMoveTarget = (pm: PowerMove) => pm.targetPerCycle ?? pm.weeklyTarget ?? 1
    const getPowerMoveActual = (pm: PowerMove) => Math.max(pm.progress ?? 0, pm.weeklyActual ?? 0)

    const completed = powerMoves.filter((pm) => getPowerMoveActual(pm) >= getPowerMoveTarget(pm)).length
    const total = powerMoves.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      completed,
      total,
      percentage,
    }
  }, [powerMoves])

  const hasPowerMoveData = powerMoves.length > 0
  const hasVictoryTargetData = victoryTargets.length > 0

  const currentStreak = 0
  const bestStreak = 0
  const weeklyHistory: number[] = []

  const getQuarterlyTargetData = () => {
    const targets = (score as any).updatedTargets ?? victoryTargets

    if (selectedQuarter === 'annual') {
      return {
        target: targets.reduce((sum: number, vt: any) => sum + (vt.target ?? 0), 0),
        achieved: targets.reduce((sum: number, vt: any) => sum + (vt.achieved ?? 0), 0),
        greenCount: score.greenCount,
        totalTargets: score.totalTargets,
      }
    }

    const quarterIndex = ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(selectedQuarter)
    let totalTarget = 0
    let totalAchieved = 0
    let greenCount = 0

    targets.forEach((vt: any) => {
      const quarters = Array.isArray(vt.quarters) ? vt.quarters : undefined
      const quarterData = quarters?.[quarterIndex]

      if (quarterData) {
        totalTarget += quarterData.target
        totalAchieved += quarterData.achieved

        const progress = quarterData.target > 0 ? (quarterData.achieved / quarterData.target) * 100 : 0
        if (progress >= 70) greenCount++
      } else {
        totalTarget += vt.target ?? 0
        totalAchieved += vt.achieved ?? 0

        const progress = vt.target > 0 ? (vt.achieved / vt.target) * 100 : 0
        if (progress >= 70) greenCount++
      }
    })

    return {
      target: totalTarget,
      achieved: totalAchieved,
      greenCount,
      totalTargets: targets.length,
    }
  }

  const quarterData = getQuarterlyTargetData()
  const greenTargets = quarterData.greenCount
  const totalTargets = quarterData.totalTargets

  const getExecutionStatus = (): 'winning' | 'at-risk' | 'losing' => {
    if (powerMoveStats.total === 0) return 'losing'
    if (powerMoveStats.percentage >= 70) return 'winning'
    if (powerMoveStats.percentage >= 50) return 'at-risk'
    return 'losing'
  }

  const executionStatus = getExecutionStatus()

  const weeklyMomentumDisplay = hasPowerMoveData ? `${powerMoveStats.percentage}%` : '—'
  const consistencyDisplay = hasPowerMoveData ? `${powerMoveStats.percentage}%` : '—'
  // const targetsOnPaceDisplay = hasPowerMoveData
  //   ? `${powerMoveStats.completed} / ${powerMoveStats.total}`
  //   : hasVictoryTargetData
  //     ? `${greenTargets} / ${totalTargets}`
  //     : '—'

  const targetsOnPaceDisplay = hasPowerMoveData
    ? `${powerMoveStats.completed} / ${powerMoveStats.total}`
    : '—'

  const executionTrendDisplay = hasPowerMoveData
    ? powerMoveStats.percentage >= 70
      ? 'Rising'
      : powerMoveStats.percentage >= 50
        ? 'Stable'
        : 'Falling'
    : '—'

  const statusColors = {
    winning: {
      color: '#16A34A',
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      badge: 'ON TRACK',
      icon: CheckCircle2,
    },
    'at-risk': {
      color: '#F59E0B',
      bg: 'bg-[#F59E0B]',
      text: 'text-white',
      badge: 'CAUTION',
      icon: AlertCircle,
    },
    losing: {
      color: '#DC2626',
      bg: 'bg-[#DC2626]',
      text: 'text-white',
      badge: hasPowerMoveData ? 'TRENDING AT RISK' : 'NO DATA YET',
      icon: XCircle,
    },
  }

  const status = statusColors[executionStatus]
  const StatusIcon = status.icon

  const teamMomentumData: TeamMomentumMember[] = useMemo(() => {
    const getPowerMoveTarget = (pm: PowerMove) => pm.targetPerCycle ?? pm.weeklyTarget ?? 1
    const getPowerMoveActual = (pm: PowerMove) => Math.max(pm.progress ?? 0, pm.weeklyActual ?? 0)

    return teamMembers
      .map((member) => {
        const memberMoves = powerMoves.filter((pm) => pm.owner === member.name)
        if (memberMoves.length === 0) {
          return {
            name: member.name,
            role: member.role,
            score: null,
            streak: 0,
            status: 'no-data' as const,
          }
        }

        const totalTarget = memberMoves.reduce((sum, pm) => sum + getPowerMoveTarget(pm), 0)
        const totalActual = memberMoves.reduce(
          (sum, pm) => sum + Math.min(getPowerMoveActual(pm), getPowerMoveTarget(pm)),
          0,
        )
        const score = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0
        const status: TeamMomentumMember['status'] =
          score >= 70 ? 'on-track' : score >= 50 ? 'at-risk' : 'losing'

        return {
          name: member.name,
          role: member.role,
          score,
          streak: 0,
          status,
        }
      })
      .sort((a, b) => {
        if (a.score === null && b.score === null) return 0
        if (a.score === null) return 1
        if (b.score === null) return -1
        return b.score - a.score
      })
  }, [teamMembers, powerMoves])

  const teamMomentumColumns = useMemo(() => {
    const columnCount = 2
    const perColumn = Math.ceil(teamMomentumData.length / columnCount)

    return Array.from({ length: columnCount }, (_, index) =>
      teamMomentumData.slice(index * perColumn, (index + 1) * perColumn),
    )
  }, [teamMomentumData])

  const scoredTeamMembers = teamMomentumData.filter((member) => member.score !== null) as Array<
    Omit<TeamMomentumMember, 'score'> & { score: number }
  >

  const mostConsistentMember = scoredTeamMembers[0] ?? null
  const atRiskMember = scoredTeamMembers.find((member) => member.score <= 0) ?? null

  if (!isReady || !companyWIG || !score) {
    return (
      <Card className='shadow-sm'>
        <div className='px-6 py-8'>Loading...</div>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* HERO SECTION */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* LEFT: TEAM EXECUTION RATE */}
        <div className='bg-white rounded-2xl border border-stone-200/60 shadow-sm p-8 flex flex-col items-center justify-center min-h-[320px]'>
          <p className='text-xs font-bold uppercase tracking-widest text-stone-500 mb-4'>
            Team Execution Rate
          </p>

          <div className='flex items-center justify-center gap-4 mb-8'>
            <div className='text-7xl font-black text-stone-900'>
              {hasPowerMoveData ? `${powerMoveStats.percentage}%` : '—'}
            </div>

            <div className='w-40 h-40 relative flex items-center justify-center'>
              <svg className='w-full h-full -rotate-90' viewBox='0 0 100 100'>
                <circle cx='50' cy='50' r='45' fill='none' stroke='#E5E7EB' strokeWidth='4' />
                <circle
                  cx='50'
                  cy='50'
                  r='45'
                  fill='none'
                  stroke={status.color}
                  strokeWidth='4'
                  strokeDasharray={
                    hasPowerMoveData
                      ? `${2.83 * 45 * (powerMoveStats.percentage / 100)} ${2.83 * 45}`
                      : `0 ${2.83 * 45}`
                  }
                  strokeLinecap='round'
                  className='transition-all duration-700'
                />
              </svg>
            </div>
          </div>

          <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6', status.bg, status.text)}>
            <StatusIcon className='h-4 w-4' />
            <span className='text-sm font-bold'>{status.badge}</span>
          </div>

          <div className='flex items-center gap-2 text-sm font-semibold text-stone-600 mb-6'>
            <TrendingUp className='h-4 w-4 text-emerald-600' />
            {hasPowerMoveData ? 'Based on overall department power moves' : 'No power move data yet'}
          </div>

          <div className='text-center pt-6 border-t border-stone-200/60'>
            <p className='text-4xl font-black text-stone-900 mb-1'>
              {powerMoveStats.completed} / {powerMoveStats.total}
            </p>
            <p className='text-xs font-semibold text-stone-500 uppercase'>
              Power Moves Completed
            </p>
          </div>
        </div>

        {/* RIGHT: VICTORY TARGETS */}
        <div className='bg-white rounded-2xl border border-stone-200/60 shadow-sm p-8'>
          <p className='text-xs font-bold uppercase tracking-widest text-stone-500 mb-6'>
            Department Victory Targets
          </p>
          <p className='text-xs text-stone-600 mb-6 font-semibold'>
            Results measured weekly
          </p>

          {victoryTargets.length === 0 ? (
            <div className='rounded-xl border border-stone-200/60 bg-stone-50 p-8 text-center'>
              <p className='text-sm text-stone-500 font-semibold'>No victory targets yet.</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {victoryTargets.slice(0, 3).map((vt, index) => {
                const progress = vt.target > 0 ? (vt.achieved / vt.target) * 100 : 0
                const statusColor = progress >= 70 ? '#22C55E' : progress >= 50 ? '#F59E0B' : '#EF4444'
                const statusLabel = progress >= 70 ? 'On Pace' : progress >= 50 ? 'Needs Momentum' : 'Behind'
                const isPrimary = index === 0

                return (
                  <div
                    key={vt.id}
                    className='flex items-start gap-4 pb-4 border-b border-stone-200/60 last:border-0 last:pb-0'
                  >
                    <div
                      className='w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-lg'
                      style={{ backgroundColor: `${statusColor}20` }}
                    >
                      <p className='text-2xl font-black' style={{ color: statusColor }}>
                        {Math.round(progress)}%
                      </p>
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <p className='text-sm font-bold text-stone-900'>
                          {vt.title}
                        </p>

                        {isPrimary && (
                          <span className='text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded'>
                            Primary
                          </span>
                        )}
                      </div>

                      <p className='text-xs text-stone-500 mt-1'>
                        {vt.achieved} / {vt.target} {vt.unit || ''}
                      </p>

                      <p className='text-xs font-semibold mt-2' style={{ color: statusColor }}>
                        {statusLabel}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className='mt-6 pt-6 border-t border-stone-200/60 flex items-center justify-center gap-3'>
            <span className='text-3xl font-black text-stone-900'>
              {hasVictoryTargetData ? greenTargets : '—'}
            </span>

            {hasVictoryTargetData && (
              <>
                <span className='text-stone-400 font-bold'>/</span>
                <span className='text-2xl font-black text-stone-600'>{totalTargets}</span>
                <span className='text-xs font-semibold text-stone-500 ml-2'>On Track</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white p-6 rounded-xl border border-stone-200/60 shadow-sm'>
          <p className='text-xs font-bold text-stone-500 uppercase tracking-wide mb-3'>Weekly Momentum</p>
          <p className='text-3xl font-black text-stone-900 mb-1'>{weeklyMomentumDisplay}</p>
          <p className='text-xs text-stone-500 font-semibold'>
            {hasPowerMoveData ? 'Based on current execution' : 'No power moves yet'}
          </p>
        </div>

        <div className='bg-white p-6 rounded-xl border border-stone-200/60 shadow-sm'>
          <p className='text-xs font-bold text-stone-500 uppercase tracking-wide mb-3'>Consistency</p>
          <p className='text-3xl font-black text-emerald-600 mb-1'>{consistencyDisplay}</p>
          <p className='text-xs text-stone-500 font-semibold'>
            {hasPowerMoveData ? 'Based on completed power moves' : 'No power moves yet'}
          </p>
        </div>

        <div className='bg-white p-6 rounded-xl border border-stone-200/60 shadow-sm'>
          <p className='text-xs font-bold text-stone-500 uppercase tracking-wide mb-3'>Targets On Pace</p>
          <p className='text-3xl font-black text-amber-600 mb-1'>{targetsOnPaceDisplay}</p>
          <p className='text-xs text-stone-500 font-semibold'>
            {hasPowerMoveData ? 'Based on overall department power moves' : hasVictoryTargetData ? 'On track' : 'No targets yet'}
          </p>
        </div>

        <div className='bg-white p-6 rounded-xl border border-stone-200/60 shadow-sm'>
          <p className='text-xs font-bold text-stone-500 uppercase tracking-wide mb-3'>Execution Trend</p>
          <p className='text-3xl font-black text-blue-600 mb-1'>{executionTrendDisplay}</p>
          <p className='text-xs text-stone-500 font-semibold'>
            {hasPowerMoveData ? 'Based on execution score' : 'No data yet'}
          </p>
        </div>
      </div>

      {/* TEAM MOMENTUM */}
      <div className='bg-white rounded-2xl border border-stone-200/60 shadow-sm p-8'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <p className='text-lg font-black uppercase tracking-wide text-stone-900'>Team Momentum</p>
            <p className='text-xs text-stone-500 mt-1 font-semibold'>Ranked by execution score</p>
          </div>

          <Button variant='ghost' size='sm' className='text-blue-600 font-semibold'>
            View full leaderboard →
          </Button>
        </div>

        {teamMomentumData.length === 0 ? (
          <div className='rounded-xl border border-stone-200/60 bg-stone-50 p-8 text-center'>
            <p className='text-sm text-stone-500 font-semibold'>No team momentum data yet.</p>
            <p className='text-xs text-stone-400 mt-2'>
              Member-wise execution scores will appear here after tracking is connected.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {teamMomentumColumns.map((column, columnIndex) => (
              <div key={columnIndex} className='space-y-4'>
                {column.map((member) => (
                  <div
                    key={member.name}
                    className='flex items-center justify-between gap-4 rounded-3xl border border-stone-200/60 bg-white p-4'
                  >
                    <div>
                      <p className='text-sm font-bold text-stone-900'>{member.name}</p>
                      <p className='text-xs text-stone-500'>{member.role}</p>
                    </div>

                    <div className='text-right'>
                      <p className='text-lg font-black text-stone-900'>
                        {member.score !== null ? `${member.score}%` : '—'}
                      </p>
                      <p className='text-xs font-semibold text-stone-500'>Execution Score</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* INSIGHT CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center'>
              <CheckCircle2 className='h-5 w-5 text-emerald-600' />
            </div>
            <p className='text-sm font-black uppercase tracking-wide text-stone-900'>Most Consistent Member</p>
          </div>
          {mostConsistentMember ? (
            <div className='text-center'>
              <p className='text-lg font-black text-stone-900'>{mostConsistentMember.name}</p>
              <p className='text-sm text-stone-500'>{mostConsistentMember.role}</p>
              <p className='text-xs text-stone-500 font-semibold mt-3'>
                {mostConsistentMember.score}% execution score
              </p>
            </div>
          ) : (
            <p className='text-sm text-stone-500 font-semibold text-center py-8'>No member data yet.</p>
          )}
        </div>

        <div className='bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center'>
              <AlertCircle className='h-5 w-5 text-amber-600' />
            </div>
            <p className='text-sm font-black uppercase tracking-wide text-stone-900'>At Risk Member</p>
          </div>
          {atRiskMember ? (
            <div className='text-center'>
              <p className='text-lg font-black text-stone-900'>{atRiskMember.name}</p>
              <p className='text-sm text-stone-500'>{atRiskMember.role}</p>
              <p className='text-xs text-stone-500 font-semibold mt-3'>
                {atRiskMember.score}% execution score
              </p>
            </div>
          ) : (
            <p className='text-sm text-stone-500 font-semibold text-center py-8'>No member data yet.</p>
          )}
        </div>

        <div className='bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center'>
              <Zap className='h-5 w-5 text-emerald-600' />
            </div>
            <p className='text-sm font-black uppercase tracking-wide text-stone-900'>Team Energy</p>
          </div>

          <div className='text-center'>
            <div className='w-16 h-16 rounded-full mx-auto mb-3 bg-stone-100 flex items-center justify-center'>
              <div className='text-3xl'>
                {hasPowerMoveData
                  ? powerMoveStats.percentage >= 70
                    ? '😊'
                    : powerMoveStats.percentage >= 50
                      ? '🙂'
                      : '😐'
                  : '—'}
              </div>
            </div>

            <p className='text-center text-sm font-bold text-stone-900'>
              {hasPowerMoveData
                ? powerMoveStats.percentage >= 70
                  ? 'High Momentum'
                  : powerMoveStats.percentage >= 50
                    ? 'Building Momentum'
                    : 'Needs Momentum'
                : 'No Data Yet'}
            </p>

            <p className='text-center text-xs text-stone-500 mt-1 font-semibold'>
              {hasPowerMoveData
                ? 'Based on current power move execution'
                : 'Add power moves to start tracking team energy'}
            </p>
          </div>
        </div>
      </div>

      {/* TIME PERIOD & CONTROLS */}
      <div className='bg-white rounded-2xl border border-stone-200/60 shadow-sm p-6'>
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <TimePeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={onPeriodChange}
            currentWeekStart={currentWeekStart}
            onNavigate={onNavigate}
          />

          <div className='flex items-center gap-3'>
            <QuarterSelector selectedQuarter={selectedQuarter} onQuarterChange={onQuarterChange} />

            <Button
              onClick={() => setShowStreak(!showStreak)}
              size='sm'
              variant='outline'
              className='gap-1.5 text-xs'
            >
              <Flame className='h-4 w-4' />
              {currentStreak > 0 ? `${currentStreak}w Streak` : 'Streak'}
            </Button>

            <Button
              onClick={onWeeklyReview}
              size='sm'
              variant='outline'
              className='gap-1.5 text-xs'
            >
              <Target className='h-4 w-4' />
              Review
            </Button>
          </div>
        </div>

        {showStreak && (
          <div className='px-5 py-3 border-t border-stone-200 bg-stone-50 mt-4 rounded-lg'>
            <ExecutionStreak
              currentStreak={currentStreak}
              bestStreak={bestStreak}
              weeklyHistory={weeklyHistory}
            />
          </div>
        )}
      </div>

      {/* POWER MOVES */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <p className='text-lg font-black uppercase tracking-wide text-stone-900'>Power Moves</p>
            <p className='text-xs text-stone-500 mt-1 font-semibold'>Lead Measures - Recurring Actions</p>
          </div>
          {onAddPowerMove && (
            <Button onClick={onAddPowerMove} size='sm' className='gap-1.5'>
              + Add Power Move
            </Button>
          )}
        </div>

        {powerMoves.length === 0 ? (
          <div className='bg-white p-8 rounded-xl border border-stone-200/60 text-center'>
            <p className='text-sm text-stone-500'>No power moves yet for this period.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {powerMoves.map((pm, index) => {
              const target = pm.targetPerCycle ?? pm.weeklyTarget ?? 1
              const actual = Math.max(pm.progress ?? 0, pm.weeklyActual ?? 0)
              const isCompleted = actual >= target
              const isPrimary = index < 2

              const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-cyan-500']
              const bgColor = colors[index % colors.length]

              return (
                <div
                  key={pm.id}
                  className='bg-white rounded-xl border border-stone-200/60 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-all'
                >
                  <div className='flex items-start gap-3'>
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0', bgColor)}>
                      {pm.name?.[0]?.toUpperCase() || '○'}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-bold text-stone-900 line-clamp-2'>{pm.name}</p>
                      {pm.frequency && (
                        <p className='text-xs text-stone-500 mt-1'>{pm.frequency}</p>
                      )}
                    </div>
                  </div>

                  <div className='flex-1 flex items-center justify-between pt-2 border-t border-stone-100'>
                    <span className='text-xs font-semibold text-stone-600'>{actual}/{target}</span>
                    <Button
                      size='sm'
                      variant={isCompleted ? 'outline' : 'secondary'}
                      onClick={() => onCompletePowerMove?.(pm.id)}
                      disabled={isCompleted}
                    >
                      {isCompleted ? 'Completed' : 'Complete'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}