"use client"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronDown, Flame, CheckCircle2, AlertCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useUser } from "@/lib/user-context"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Image from "next/image"

type TimePeriod = "today" | "this-week" | "this-month" | "this-quarter"

type IndividualDashboardProps = {
  isAdmin: boolean
  currentUserName?: string
  currentUserId?: string
}

export function IndividualDashboard({
  isAdmin,
  currentUserName = "",
  currentUserId = "",
}: IndividualDashboardProps) {
  const { currentUser, isLoading: isUserLoading } = useUser()
  const [powerMoves, setPowerMoves] = useState<any[]>([])
  const [victoryTargets, setVictoryTargets] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isTrackingLoading, setIsTrackingLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("today")

  useEffect(() => {
    let isActive = true



    const load = async () => {
      try {
        setIsLoadingData(true)
        const [pmResponse, vtResponse] = await Promise.all([
          fetch("/api/admin/power-moves", { cache: "no-store" }),
          fetch("/api/admin/victory-targets", { cache: "no-store" }),
        ])

        const pmResult = await pmResponse.json().catch(() => ({}))
        const vtResult = await vtResponse.json().catch(() => ({}))
        console.log("Power moves response:", pmResult)
        console.log("Victory targets response:", vtResult)

     // if user is not active (e.g. component unmounted), don't attempt to set state
        if (!isActive) return
// if user is active set power moves and victory targets, ensuring we have arrays to avoid rendering issues
        setPowerMoves(Array.isArray(pmResult.powerMoves) ? pmResult.powerMoves : [])
        setVictoryTargets(Array.isArray(vtResult.targets) ? vtResult.targets : [])
      } catch {
        if (!isActive) return
        setPowerMoves([])
        setVictoryTargets([])
      } finally {
        if (isActive) setIsLoadingData(false)
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [])


  //This is the function that takes a powermove and retreives the owner id
  const getPowerMoveOwnerId = (powerMove: any) => powerMove.owner_id ?? powerMove.ownerId ?? ""

//Below function takes powermove from and returns the owner name
  const getPowerMoveOwnerName = (powerMove: any) => powerMove.owner ?? powerMove.ownerName ?? ""

  // Similar to power moves, these functions retrieve the owner ID and name for victory targets, checking multiple field names for compatibility and defaulting to empty strings if not found.

  const getVictoryTargetOwnerId = (target: any) => target.owner_id ?? target.ownerId ?? ""
  const getVictoryTargetOwnerName = (target: any) => target.owner ?? target.ownerName ?? ""

  // Determine the effective user ID and name to use for filtering power moves and victory targets. If the currentUser from context is available, use its ID and name; otherwise, fall back to the props passed into the component. This ensures that we have consistent identifiers for filtering even if the user data is not fully loaded.
  const effectiveUserId = currentUser?.id || currentUserId
  const effectiveUserName = currentUser?.name || currentUserName


  const displayName = currentUser?.name || currentUserName || "—"
  const displayRole = currentUser?.role || (isAdmin ? "Admin" : "Member")
  
  console.log("Current User:", currentUser)

  const displayBrands = currentUser?.assignments
    ? new Set(currentUser.assignments.map((assignment) => assignment.brand)).size
    : 0
  const displayAvatar = currentUser?.avatar || ""
  const displayStreak = 0


  const myPowerMoves = isAdmin
    ? powerMoves
    : effectiveUserId || effectiveUserName
      ? powerMoves.filter((pm: any) => {
          if (effectiveUserId) {
            return getPowerMoveOwnerId(pm) === effectiveUserId
          }
          return getPowerMoveOwnerName(pm) === effectiveUserName
        })
      : []

  const myVictoryTargets = isAdmin
    ? victoryTargets
    : effectiveUserId || effectiveUserName
      ? victoryTargets.filter((vt: any) => {
          if (effectiveUserId) {
            return getVictoryTargetOwnerId(vt) === effectiveUserId
          }
          return getVictoryTargetOwnerName(vt) === effectiveUserName
        })
      : []


      console.log("My Victory Targets:", myVictoryTargets)

  const getTargetActualForPeriod = (pm: any, period: TimePeriod) => {
    switch (period) {
      case "today":
        return {
          target: pm.dailyTarget ?? pm.weeklyTarget ?? 0,
          actual: pm.dailyActual ?? 0,
        }
      case "this-week":
        return { target: pm.weeklyTarget ?? 0, actual: pm.weeklyActual ?? 0 }
      case "this-month":
        return { target: pm.monthlyTarget ?? 0, actual: pm.monthlyActual ?? 0 }
      case "this-quarter":
        return { target: pm.quarterlyTarget ?? 0, actual: pm.quarterlyActual ?? 0 }
    }
    return { target: 0, actual: 0 }
  }

  const getActualFieldForPeriod = (pm: any, period: TimePeriod) => {
    switch (period) {
      case "today":
        return "dailyActual"
      case "this-week":
        return "weeklyActual"
      case "this-month":
        return "monthlyActual"
      case "this-quarter":
        return "quarterlyActual"
    }
    return "weeklyActual"
  }

  const getTargetFieldForPeriod = (period: TimePeriod) => {
    switch (period) {
      case "today":
        return "dailyTarget"
      case "this-week":
        return "weeklyTarget"
      case "this-month":
        return "monthlyTarget"
      case "this-quarter":
        return "quarterlyTarget"
    }
    return "weeklyTarget"
  }

  const powerMoveIds = useMemo(
    () => powerMoves.map((pm) => pm.id).filter(Boolean).join(","),
    [powerMoves],
  )

  useEffect(() => {
    if (!powerMoveIds) {
      setIsTrackingLoading(false)
      return
    }

    const controller = new AbortController()
    let isActive = true

    setIsTrackingLoading(true)
    // Load tracking data for the current set of power moves and selected time period. This will update the power moves with their actual and target values for the period, allowing the dashboard to display progress. The use of AbortController allows us to cancel the fetch request if the component unmounts or if the dependencies change before the request completes, preventing potential memory leaks or state updates on unmounted components.

    const loadTracking = async () => {
      try {
        const response = await fetch(
          `/api/power-move-tracking?period=${encodeURIComponent(selectedPeriod)}&powerMoveIds=${encodeURIComponent(
            powerMoveIds,
          )}`,
          { signal: controller.signal },
        )
        const result = await response.json().catch(() => ({}))

        debugger;

        if (!response.ok || !Array.isArray(result.tracking)) return

        const trackingMap = new Map<string, { actual: number; target: number }>(
          result.tracking.map((row: any) => [row.power_move_id, row]),
        )

console.log("result.tracking", result.tracking)
console.log("trackingMap as array", Array.from(trackingMap.entries()))
console.log("trackingMap size", trackingMap.size)
       
        setPowerMoves((prev) =>
          prev.map((pm) => {
            const tracked = trackingMap.get(pm.id)
            if (!tracked) return pm
            const actualField = getActualFieldForPeriod(pm, selectedPeriod)
            const targetField = getTargetFieldForPeriod(selectedPeriod)
            return {
              ...pm,
              [actualField]: tracked.actual,
              [targetField]: tracked.target ?? pm[targetField],
            }
          }),
        )
      } catch {
        // Ignore tracking failures
      } finally {
        if (isActive) setIsTrackingLoading(false)
      }
    }

    loadTracking()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [selectedPeriod, powerMoveIds])

  const periodData = myPowerMoves.reduce(
    (acc, pm) => {
      const { target, actual } = getTargetActualForPeriod(pm, selectedPeriod)
      if (!target) return acc
      const safeActual = Math.max(actual || 0, 0)
      return {
        completed: acc.completed + Math.min(safeActual, target),
        total: acc.total + target,
        target: acc.target + target,
      }
    },
    { completed: 0, total: 0, target: 0 },
  )

  const executionPercentage = periodData.total > 0 ? Math.round((periodData.completed / periodData.total) * 100) : 0

  const handleCompletePowerMove = async (id: string) => {
    let trackingPayload: { powerMoveId: string; period: TimePeriod; target: number; actual: number; completedById?: string } | null = null

    setPowerMoves((prev) =>
      prev.map((pm) => {
        if (pm.id !== id) return pm
        const { target, actual } = getTargetActualForPeriod(pm, selectedPeriod)
        const actualField = getActualFieldForPeriod(pm, selectedPeriod)
        const nextActual = Math.min((actual || 0) + 1, target)
        trackingPayload = {
          powerMoveId: pm.id,
          period: selectedPeriod,
          target,
          actual: nextActual,
          completedById: effectiveUserId || undefined,
        }
        return { ...pm, [actualField]: nextActual }
      }),
    )

    if (!trackingPayload || trackingPayload.target <= 0) return

    try {
      await fetch("/api/power-move-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingPayload),
      })

      if (trackingPayload.period === "today") {
        await fetch("/api/power-move-tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...trackingPayload,
            period: "this-week",
          }),
        })
      }

    }
    catch {
      // Ignore tracking failures to avoid blocking UI
    }
  }

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case "today":
        return "Today"
      case "this-week":
        return "This Week"
      case "this-month":
        return "This Month"
      case "this-quarter":
        return "This Quarter"
    }
  }

  const getExecutionStatus = () => {
    if (executionPercentage >= 70) return "on-track"
    if (executionPercentage >= 50) return "at-risk"
    return "needs-momentum"
  }

  const executionStatus = getExecutionStatus()

  const completedPowerMoves = myPowerMoves.filter((pm) => {
    const { target, actual } = getTargetActualForPeriod(pm, selectedPeriod)
    return target > 0 && (actual ?? 0) >= target
  }).length

  const weeklyMomentumDisplay = periodData.total > 0 ? `${executionPercentage}%` : '—'
  const consistencyDisplay = periodData.total > 0 ? `${executionPercentage}%` : '—'
  const targetsOnPaceDisplay = myPowerMoves.length > 0
    ? `${completedPowerMoves} / ${myPowerMoves.length}` : '_'
   

  console.log("My Targets on Pace:", targetsOnPaceDisplay);
  const executionTrendLabel = executionPercentage >= 60 ? 'Rising' : executionPercentage >= 30 ? 'Stable' : 'Falling'

  // Calculate today's power moves
  const todayPowerMoves = myPowerMoves.filter((pm) => {
    const { target } = getTargetActualForPeriod(pm, "today")
    return target > 0
  })
  const todayCompletedCount = todayPowerMoves.filter((pm) => {
    const { actual, target } = getTargetActualForPeriod(pm, "today")
    return actual >= target
  }).length

  if (isLoadingData || isUserLoading || isTrackingLoading) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <p className="text-sm text-stone-500">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <section className='px-4 sm:px-6 lg:px-8 pb-8 space-y-8' aria-labelledby='personal-dashboard-heading'>
      {/* HERO SECTION - Premium 3-Column Execution Cockpit */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'>
        
        {/* LEFT COLUMN - USER IDENTITY */}
        <div className='flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-sm border border-stone-200/60 hover:shadow-md transition-shadow'>
          {/* Large Avatar */}
          <div className='relative mb-6'>
            <div className='h-24 w-24 rounded-full overflow-hidden border-3 border-stone-200 shadow-md bg-stone-100'>
              <Image
                src={displayAvatar || '/placeholder.svg'}
                alt={displayName}
                width={96}
                height={96}
                className='h-full w-full object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-stone-100')
                }}
              />
            </div>
            {displayStreak > 0 && (
              <div className='absolute -bottom-2 -right-2 bg-orange-500 text-white text-sm font-black rounded-full h-8 w-8 flex items-center justify-center shadow-lg border-2 border-white'>
                <Flame className='h-4 w-4' />
              </div>
            )}
          </div>
          
          {/* User Info */}
          <h2 className='text-2xl font-black text-stone-900 tracking-tight'>{displayName} </h2>
          <p className='text-sm font-semibold text-stone-600 mt-2'>
            {displayRole}
          </p>
          <p className='text-xs text-stone-500 mt-1'>
            {displayBrands} {displayBrands === 1 ? 'Brand' : 'Brands'}
          </p>
          
          {/* Streak Badge */}
          {displayStreak > 0 && (
            <div className='mt-4 px-4 py-2 bg-orange-50 rounded-full'>
              <p className='text-xs font-bold text-orange-700'>
                🔥 {displayStreak} Day Execution Streak
              </p>
              <p className='text-xs text-orange-600 mt-1'>Keep the momentum going</p>
            </div>
          )}
        </div>

        {/* CENTER COLUMN - EXECUTION SCORE (HERO) */}
        <div className={cn(
          'flex flex-col items-center justify-center p-8 rounded-2xl shadow-md border-2 transition-all',
          executionStatus === 'on-track' 
            ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300'
            : executionStatus === 'at-risk'
            ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-300'
            : 'bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-300'
        )}>
          <p className='text-xs font-bold uppercase tracking-widest text-stone-600 mb-4'>
            {getPeriodLabel(selectedPeriod)} Score_test  
          </p>
          
          {/* Giant Circular Score */}
          <div className='relative w-40 h-40 flex items-center justify-center mb-6'>
            <svg className='w-full h-full -rotate-90' viewBox='0 0 100 100'>
              <circle
                cx='50'
                cy='50'
                r='45'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                className='text-stone-200'
              />
              <circle
                cx='50'
                cy='50'
                r='45'
                fill='none'
                stroke={executionStatus === 'on-track' ? '#22C55E' : executionStatus === 'at-risk' ? '#F59E0B' : '#EF4444'}
                strokeWidth='3'
                strokeDasharray={`${2.83 * 45 * (executionPercentage / 100)} ${2.83 * 45}`}
                strokeLinecap='round'
                className='transition-all duration-700'
              />
            </svg>
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <div className='text-5xl font-black' style={{
                color: executionStatus === 'on-track' ? '#22C55E' : executionStatus === 'at-risk' ? '#F59E0B' : '#EF4444'
              }}>
                {executionPercentage}
              </div>
              <div className='text-sm font-semibold text-stone-500'>/100</div>
            </div>
          </div>

          {/* Status Label */}
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold',
            executionStatus === 'on-track' 
              ? 'bg-emerald-200 text-emerald-900'
              : executionStatus === 'at-risk'
              ? 'bg-amber-200 text-amber-900'
              : 'bg-rose-200 text-rose-900'
          )}>
            {executionStatus === 'on-track' ? <CheckCircle2 className='h-4 w-4' /> : <AlertCircle className='h-4 w-4' />}
            {executionStatus === 'on-track' ? 'ON TRACK' : executionStatus === 'at-risk' ? 'NEEDS MOMENTUM' : 'AT RISK'}
          </div>

          {/* Detail Stats */}
          <div className='mt-6 pt-6 border-t-2 border-stone-200/40 w-full text-center'>
            <div className='text-3xl font-black text-stone-900 tabular-nums'>
              {periodData.completed} <span className='text-stone-400'>/</span> {periodData.total}
            </div>
            <p className='text-xs font-semibold text-stone-600 mt-2 uppercase tracking-wide'>
              Power Move Actions Complete
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN - TODAY'S FOCUS */}
        <div className='p-8 bg-white rounded-2xl shadow-sm border border-stone-200/60'>
          <div className='flex items-center gap-2 mb-6'>
            <h3 className='text-base font-black text-stone-900 uppercase tracking-wide'>Today&apos;s Focus</h3>
            <span className='text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
              {todayPowerMoves.length - todayCompletedCount}/{todayPowerMoves.length}      </span>
          </div>
          
          {/* Top 3 Power Moves */}
          <div className='space-y-3'>
            {todayPowerMoves.slice(0, 3).length === 0 ? (
              <p className='text-xs text-stone-500 text-center py-4'>No power moves for today</p>
            ) : (
              todayPowerMoves.slice(0, 3).map((pm, index) => {
                const { target, actual } = getTargetActualForPeriod(pm, 'today')
                const isCompleted = actual >= target
                return (
                  <div
                    key={pm.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border transition-all',
                      isCompleted
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    )}
                  >
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => handleCompletePowerMove(pm.id)}
                      className='mt-1'
                      disabled={isCompleted}
                    />
                    <div className='flex-1 min-w-0'>
                      <p className={cn(
                        'text-sm font-semibold text-stone-900 truncate',
                        isCompleted && 'line-through text-stone-500'
                      )}>
                        {pm.name}
                      </p>
                      <p className='text-xs text-stone-500 mt-0.5'>{actual}/{target} completed</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          {todayPowerMoves.length > 3 && (
            <p className='text-xs text-stone-500 text-center pt-2 font-semibold'>
              +{todayPowerMoves.length - 3} more today
            </p>
          )}
        </div>
      </div>

      {/* TIME PERIOD SELECTOR */}
      <div className='flex justify-between items-center px-6 py-4 bg-white rounded-xl border border-stone-200/60 shadow-sm'>
        <p className='text-sm font-semibold text-stone-600 uppercase tracking-wide'>Time Period</p>
        <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as TimePeriod)}>
          <SelectTrigger className='w-40 bg-stone-50 border-stone-200'>
            <Calendar className='h-4 w-4 mr-2 text-stone-500' />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='today'>Today</SelectItem>
            <SelectItem value='this-week'>This Week</SelectItem>
            <SelectItem value='this-month'>This Month</SelectItem>
            <SelectItem value='this-quarter'>This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* MOMENTUM STRIP - 4 KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Weekly Momentum */}
        <div className='bg-white p-6 rounded-xl border border-stone-200/60 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <p className='text-xs font-bold text-stone-500 uppercase tracking-wide'>Weekly Momentum</p>
          </div>
          <p className='text-3xl font-black text-stone-900'>{weeklyMomentumDisplay}</p>
          <p className='text-xs text-stone-500 mt-2 font-semibold'>vs last week</p>
        </div>

        {/* Consistency */}
        <div className='bg-white p-6 rounded-xl border border-stone-200/60 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <p className='text-xs font-bold text-stone-500 uppercase tracking-wide'>Consistency</p>
          </div>
          <p className='text-3xl font-black text-emerald-600'>{consistencyDisplay}</p>
          <p className='text-xs text-stone-500 mt-2 font-semibold'>Great consistency</p>
        </div>

        {/* Targets On Pace */}
        <div className='bg-white p-6 rounded-xl border border-stone-200/60 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <p className='text-xs font-bold text-stone-500 uppercase tracking-wide'>Targets On Pace_TEST</p>
          </div>
          <p className='text-3xl font-black text-amber-600'>{targetsOnPaceDisplay}</p>
          <p className='text-xs text-stone-500 mt-2 font-semibold'>On track</p>
        </div>

        {/* Execution Trend */}
        <div className='bg-white p-6 rounded-xl border border-stone-200/60 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <p className='text-xs font-bold text-stone-500 uppercase tracking-wide'>Execution Trend</p>
          </div>
          <p className='text-3xl font-black text-blue-600'>{executionTrendLabel}</p>
          <p className='text-xs text-stone-500 mt-2 font-semibold'>Last 7 days</p>
        </div>
      </div>

      POWER MOVES SECTION - Horizontal Cards Grid_TEST
      <div>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-lg font-black uppercase tracking-wide text-stone-900'>Power Moves</h2>
            <p className='text-xs text-stone-500 mt-1'>Lead Measures - Recurring Actions</p>
          </div>
          <div className='flex items-center gap-3'>
            <p className='text-sm font-semibold text-stone-600'>
              {myPowerMoves.length} active
            </p>
          </div>
        </div>

        {myPowerMoves.length === 0 ? (
          <div className='bg-white p-8 rounded-xl border border-stone-200/60 text-center'>
            <p className='text-sm text-stone-500'>No power moves yet for this period.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
            {myPowerMoves.map((pm, index) => {
              const { target, actual } = getTargetActualForPeriod(pm, selectedPeriod)
              const percentage = target > 0 ? Math.round((actual / target) * 100) : 0
              const isCompleted = actual >= target
              const isPrimary = index < 2

              // Color icons based on index
              const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-red-500', 'bg-cyan-500']
              const bgColor = colors[index % colors.length]

              return (
                <div
                  key={pm.id}
                  className='bg-white rounded-xl border border-stone-200/60 shadow-sm p-5 hover:shadow-md transition-all flex flex-col'
                >
                  {/* Icon and Header */}
                  <div className='flex items-start justify-between mb-4'>
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg', bgColor)}>
                      {pm.name?.[0]?.toUpperCase() || '○'}
                    </div>
                    {isPrimary && (
                      <span className='text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded'>
                        Primary
                      </span>
                    )}
                  </div>

                  {/* Title and Frequency */}
                  <h3 className='text-sm font-bold text-stone-900 mb-1 line-clamp-2'>{pm.name}</h3>
                  <p className='text-xs text-stone-500 font-semibold mb-3'>{pm.frequency}</p>

                  {/* Progress */}
                  <div className='mb-4'>
                    <div className='flex justify-between items-center mb-1'>
                      <span className='text-xs font-semibold text-stone-600'>{actual}/{target}</span>
                      <span className={cn(
                        'text-xs font-bold px-2 py-0.5 rounded-full',
                        isCompleted ? 'bg-emerald-100 text-emerald-700' : percentage > 0 ? 'bg-amber-100 text-amber-700' : 'bg-stone-200 text-stone-700'
                      )}>
                        {percentage}%
                      </span>
                    </div>
                    <div className='h-1.5 bg-stone-200 rounded-full overflow-hidden'>
                      <div
                        className={cn(
                          'h-full transition-all duration-500',
                          isCompleted ? 'bg-emerald-600' : percentage > 0 ? 'bg-amber-500' : 'bg-stone-300'
                        )}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    size='sm'
                    onClick={() => handleCompletePowerMove(pm.id)}
                    disabled={isCompleted}
                    className={cn(
                      'w-full text-xs font-bold mt-auto',
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    )}
                  >
                    {isCompleted ? '✓ Done' : 'Complete'}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </section>
  )
}
