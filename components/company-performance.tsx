'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Hardcoded 2026 targets - Alan Mulally BPR Foundation
const TOTAL_PLANNED_CLIENTS = 40
const REVENUE_PER_CLIENT = 30000
const WARRIOR_SYSTEMS_TARGET = 30
const STORY_MARKETING_TARGET = 10
const TARGET_MRR = TOTAL_PLANNED_CLIENTS * REVENUE_PER_CLIENT
const plannedFeeBaseline = REVENUE_PER_CLIENT

type ClientOrigin = 'Existing' | 'Planned' | 'Bonus'

interface Client {
  id: string
  name: string
  monthlyFee: number
  brand: 'Warrior Systems' | 'Story Marketing'
  joinMonth: string
  origin: ClientOrigin
  status: 'active' | 'dropped'
  dropMonth?: string
  dropReason?: string
}

interface BPRNote {
  quarter: string
  verdict: string
  whatWentWrong: string
  decisionMade: string
  nextChanges: string
}

export function CompanyPerformance() {
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Client A', monthlyFee: 50000, brand: 'Warrior Systems', joinMonth: 'Jan 2026', origin: 'Existing', status: 'active' },
    { id: '2', name: 'Client B', monthlyFee: 75000, brand: 'Story Marketing', joinMonth: 'Feb 2026', origin: 'Existing', status: 'active' },
    { id: '3', name: 'Client C', monthlyFee: 60000, brand: 'Warrior Systems', joinMonth: 'Feb 2026', origin: 'Existing', status: 'active' },
  ])

  const [newClient, setNewClient] = useState({
    name: '',
    monthlyFee: '',
    brand: 'Warrior Systems' as 'Warrior Systems' | 'Story Marketing',
    joinMonth: '',
    origin: 'Planned' as ClientOrigin,
  })

  const [baselineCutoffMonth, setBaselineCutoffMonth] = useState('Mar 2026')
  
  // Determine current quarter (for demo: Q1 2026)
  const currentQuarter = 'Q1'
  const currentYear = 2026

  // Calculations
  const activeClients = clients.filter((c) => c.status === 'active')
  const droppedClients = clients.filter((c) => c.status === 'dropped')

  const existingActive = activeClients.filter((c) => c.origin === 'Existing')
  const plannedActive = activeClients.filter((c) => c.origin === 'Planned')
  const bonusActive = activeClients.filter((c) => c.origin === 'Bonus')

  const wsActive = activeClients.filter((c) => c.brand === 'Warrior Systems').length
  const smActive = activeClients.filter((c) => c.brand === 'Story Marketing').length

  const currentMRR = activeClients.reduce((sum, c) => sum + c.monthlyFee, 0)
  const activeRetentionRate = clients.length > 0 ? Math.round((activeClients.length / clients.length) * 100) : 0
  const droppedCount = droppedClients.length

  const clientProgressPercent = (plannedActive.length / TOTAL_PLANNED_CLIENTS) * 100
  const getStatus = () => {
    if (plannedActive.length >= TOTAL_PLANNED_CLIENTS * 0.9) return 'On Track'
    if (plannedActive.length >= TOTAL_PLANNED_CLIENTS * 0.7) return 'Slightly Behind'
    return 'Behind'
  }

  // Quarterly plan - Q1 has no planned targets (baseline only)
  const quarterlyPlans = [
    { quarter: 'Q1', plannedClients: 0, plannedRevenue: 0 },
    { quarter: 'Q2', plannedClients: 10, plannedRevenue: 10 * plannedFeeBaseline },
    { quarter: 'Q3', plannedClients: 20, plannedRevenue: 20 * plannedFeeBaseline },
    { quarter: 'Q4', plannedClients: 30, plannedRevenue: 30 * plannedFeeBaseline },
  ]

  // PATCH 3: DYNAMIC BASELINE CALCULATION
  const getMonthNumber = (month: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const basePart = month.split(' ')[0]
    return months.indexOf(basePart) + 1
  }

  const baselineCutoffMonthNum = getMonthNumber(baselineCutoffMonth)
  const baselineClients = activeClients.filter((c) => c.origin === 'Existing' && getMonthNumber(c.joinMonth) <= baselineCutoffMonthNum)
  const baselineRevenue = baselineClients.reduce((sum, c) => sum + c.monthlyFee, 0)

  // PATCH 4: QUARTERLY GROWTH TABLE IGNORES BASELINE
  const getQuarterFromMonth = (month: string) => {
    const q1 = ['Jan', 'Feb', 'Mar']
    const q2 = ['Apr', 'May', 'Jun']
    const q3 = ['Jul', 'Aug', 'Sep']
    const q4 = ['Oct', 'Nov', 'Dec']
    if (q1.some((m) => month.includes(m))) return 0
    if (q2.some((m) => month.includes(m))) return 1
    if (q3.some((m) => month.includes(m))) return 2
    if (q4.some((m) => month.includes(m))) return 3
    return 0
  }

  const actualQuarterlyData = quarterlyPlans.map((plan, idx) => {
    const clientsInQuarter = activeClients.filter((c) => getQuarterFromMonth(c.joinMonth) === idx)
    // PATCH 4: Only count Planned clients for growth evaluation
    const plannedInQuarter = clientsInQuarter.filter((c) => c.origin === 'Planned')
    const bonusInQuarter = clientsInQuarter.filter((c) => c.origin === 'Bonus')
    const existingInQuarter = clientsInQuarter.filter((c) => c.origin === 'Existing')
    
    return {
      quarter: plan.quarter,
      plannedClients: plan.plannedClients,
      actualPlannedClients: plannedInQuarter.length,
      actualExistingClients: existingInQuarter.length,
      actualBonusClients: bonusInQuarter.length,
      totalActualClients: clientsInQuarter.length,
      plannedRevenue: plan.plannedRevenue,
      actualRevenue: clientsInQuarter.reduce((sum, c) => sum + c.monthlyFee, 0),
    }
  })

  const getStatusForQuarter = (idx: number) => {
    const planned = actualQuarterlyData[idx].plannedClients
    const actual = actualQuarterlyData[idx].actualPlannedClients
    if (idx === 0) return 'baseline' // Q1 is baseline
    // For future quarters (no actual data yet), return 'upcoming'
    if (actual === 0 && planned > 0) return 'upcoming'
    if (actual >= planned * 0.9) return 'green'
    if (actual >= planned * 0.7) return 'yellow'
    return 'red'
  }

  // Calculate current quarter status for display
  const quarterIndex = ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(currentQuarter)
  const currentQuarterData = actualQuarterlyData[quarterIndex]
  const planned = currentQuarterData.plannedClients
  const actual = currentQuarterData.actualPlannedClients

  // Status determination - at component level so it's accessible everywhere
  let status: string
  let statusBg: string
  let statusText: string
  let statusMessage: string

  if (quarterIndex === 0) {
    // Q1 baseline - no planned target
    status = 'BASELINE'
    statusBg = 'bg-stone-50 border-stone-300'
    statusText = 'text-stone-900'
    statusMessage = 'Q1 is baseline period. Planned growth begins Q2.'
  } else if (actual >= planned) {
    status = 'WINNING'
    statusBg = 'bg-emerald-50 border-emerald-300'
    statusText = 'text-emerald-900'
    statusMessage = `${actual} new planned clients acquired vs ${planned} target`
  } else {
    status = 'AT RISK'
    statusBg = 'bg-amber-50 border-amber-300'
    statusText = 'text-amber-900'
    statusMessage = `${actual} new planned clients acquired vs ${planned} target — Gap: ${planned - actual}`
  }

  const addClient = () => {
    if (newClient.name && newClient.monthlyFee && newClient.joinMonth) {
      // PATCH 1: Auto-derive origin from join month, but allow override
      const derivedOrigin: ClientOrigin = (newClient.joinMonth.includes('Jan') || newClient.joinMonth.includes('Feb') || newClient.joinMonth.includes('Mar')) ? 'Existing' : 'Planned'
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name,
        monthlyFee: parseInt(newClient.monthlyFee),
        brand: newClient.brand,
        joinMonth: newClient.joinMonth,
        origin: newClient.origin !== 'Planned' ? newClient.origin : derivedOrigin,
        status: 'active',
      }
      setClients([...clients, client])
      setNewClient({ name: '', monthlyFee: '', brand: 'Warrior Systems', joinMonth: '', origin: 'Planned' })
    }
  }

  // PATCH 1: Derive quarter from join month
  const getDerivedQuarter = (month: string) => {
    if (!month) return '—'
    const q1 = ['Jan', 'Feb', 'Mar']
    const q2 = ['Apr', 'May', 'Jun']
    const q3 = ['Jul', 'Aug', 'Sep']
    const q4 = ['Oct', 'Nov', 'Dec']
    if (q1.some((m) => month.includes(m))) return 'Q1'
    if (q2.some((m) => month.includes(m))) return 'Q2'
    if (q3.some((m) => month.includes(m))) return 'Q3'
    if (q4.some((m) => month.includes(m))) return 'Q4'
    return '—'
  }

  const removeClient = (id: string) => {
    setClients(clients.filter((c) => c.id !== id))
  }

  const toggleClientStatus = (id: string) => {
    setClients(
      clients.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'dropped' : 'active', dropMonth: c.status === 'active' ? new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : undefined } : c))
    )
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
    return `₹${value.toLocaleString()}`
  }

  const statusConfig = {
    green: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'On Track' },
    yellow: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'At Risk' },
    red: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'Behind' },
    baseline: { bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700', badge: 'Baseline' },
    upcoming: { bg: 'bg-stone-100', border: 'border-stone-200', text: 'text-stone-600', badge: 'Upcoming' },
  }

  const originColors = {
    Existing: 'bg-blue-100 text-blue-800',
    Planned: 'bg-emerald-100 text-emerald-800',
    Bonus: 'bg-amber-100 text-amber-800',
  }

  return (
    <div className='space-y-8 max-w-7xl mx-auto px-4'>
      {/* PAGE HEADER */}
      <div className='space-y-2'>
        <h1 className='text-4xl lg:text-5xl font-black text-stone-900 tracking-tight'>Company Performance</h1>
        <p className='text-lg font-semibold text-stone-700'>Quarterly execution tracking — Warrior Systems & Story Marketing</p>
      </div>

      {/* SECTION 1: QUARTER SCORE — DOMINANT, FULL-WIDTH CARD (THE ONLY VERDICT) */}
      <Card className={cn('border-2 border-l-4 shadow-md', statusBg)}>
        <CardContent className='pt-8'>
          <div className='space-y-8'>
            <div>
              <p className={cn('text-xs font-black uppercase tracking-wider mb-3', statusText)}>
                Q{currentQuarter[1]} {currentYear} — Company Score
              </p>
              <h2 className={cn('text-6xl font-black mb-6', statusText)}>{status}</h2>
            </div>

            <div className='grid grid-cols-3 gap-12'>
              <div>
                <p className='text-xs font-bold uppercase tracking-wider text-stone-600 mb-2'>Planned New Clients</p>
                <p className='text-5xl font-black text-stone-900'>{planned}</p>
              </div>
              <div>
                <p className='text-xs font-bold uppercase tracking-wider text-stone-600 mb-2'>Actual New Clients</p>
                <p className='text-5xl font-black text-stone-900'>{actual}</p>
              </div>
              <div className='flex flex-col justify-end'>
                <p className='text-xs font-bold uppercase tracking-wider text-stone-600 mb-2'>Status</p>
                <Badge className={cn('font-black text-base w-fit', 
                  status === 'WINNING' ? 'bg-emerald-100 text-emerald-800' :
                  status === 'AT RISK' ? 'bg-amber-100 text-amber-800' :
                  'bg-stone-100 text-stone-800'
                )}>
                  {status}
                </Badge>
              </div>
            </div>

            <p className={cn('text-sm font-bold pt-4 border-t', statusText)}>{statusMessage}</p>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: CONTEXT ROW (Not a Verdict) */}
      <div>
        <p className='text-xs font-black uppercase tracking-wider text-stone-500 mb-3 px-2'>Context (Not a Verdict)</p>
        <div className='grid grid-cols-3 gap-4'>
          {/* Year Trajectory Card */}
          <Card className='border-2 border-stone-200 bg-stone-50'>
            <CardContent className='pt-6'>
              <p className='text-xs font-bold uppercase tracking-wider text-stone-600 mb-3'>2026 Year Trajectory</p>
              <div className='text-4xl font-black text-stone-900 mb-2'>
                {activeClients.length} <span className='text-stone-400 text-2xl'>/ {TOTAL_PLANNED_CLIENTS}</span>
              </div>
              <p className='text-xs font-semibold text-stone-600'>Active clients vs year-end target</p>
              <div className='h-2 bg-stone-300 rounded-full overflow-hidden mt-3'>
                <div
                  className='h-full bg-stone-500 transition-all'
                  style={{ width: `${Math.min((activeClients.length / TOTAL_PLANNED_CLIENTS) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Brand Split Card */}
          <Card className='border-2 border-stone-200 bg-stone-50'>
            <CardContent className='pt-6'>
              <p className='text-xs font-bold uppercase tracking-wider text-stone-600 mb-3'>Warrior Systems</p>
              <div className='text-4xl font-black text-stone-900 mb-2'>
                {wsActive} <span className='text-stone-400 text-2xl'>/ {WARRIOR_SYSTEMS_TARGET}</span>
              </div>
              <p className='text-xs font-semibold text-stone-600'>Active clients (Brand)</p>
              <div className='h-2 bg-stone-300 rounded-full overflow-hidden mt-3'>
                <div
                  className='h-full bg-stone-600 transition-all'
                  style={{ width: `${Math.min((wsActive / WARRIOR_SYSTEMS_TARGET) * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Monthly Run-Rate Card */}
          <Card className='border-2 border-stone-200 bg-stone-50'>
            <CardContent className='pt-6'>
              <p className='text-xs font-bold uppercase tracking-wider text-stone-600 mb-3'>Monthly Run-Rate</p>
              <div className='text-4xl font-black text-stone-900 mb-2'>
                {formatCurrency(currentMRR)}
              </div>
              <p className='text-xs font-semibold text-stone-600'>Current MRR from active clients</p>
              <p className='text-xs text-stone-500 mt-3'>Target: {formatCurrency(TARGET_MRR)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION 3: FOUNDER VERDICT (Narrative) */}
      <Card className='border-2 border-stone-200 bg-white'>
        <CardContent className='pt-6'>
          <p className='text-xs font-black uppercase tracking-wider text-stone-500 mb-2'>Founder Verdict</p>
          <p className='text-base font-semibold text-stone-800 italic'>
            {status === 'WINNING' 
              ? 'We are executing on our quarterly growth plan. Maintain focus on bottleneck removal and client fulfillment.'
              : status === 'AT RISK'
              ? 'We are behind on quarterly targets. Immediate action required to close the gap.'
              : 'Q1 serves as our baseline. We establish operational foundations this quarter.'}
          </p>
        </CardContent>
      </Card>

      {/* SECTION 4: DETAILED TABLES (Review Tools) */}
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl font-black text-stone-900'>2026 Goals — Quarterly & Monthly</CardTitle>
          <p className='text-sm font-semibold text-stone-600 mt-2'>Track planned vs actual new client acquisition across quarters and months</p>
          {/* Baseline information in collapsible section */}
          <details className='mt-4 cursor-pointer'>
            <summary className='text-sm font-semibold text-stone-700 bg-stone-50 px-3 py-2 rounded-lg hover:bg-stone-100'>
              Planning Rules
            </summary>
            <div className='mt-3 text-sm font-semibold text-stone-600 bg-stone-50 px-3 py-2 rounded-lg'>
              Q1 Baseline: {baselineClients.length} Existing + {bonusActive.filter((c) => getQuarterFromMonth(c.joinMonth) === 0).length} Bonus = {baselineClients.length + bonusActive.filter((c) => getQuarterFromMonth(c.joinMonth) === 0).length} Active (Cutoff: {baselineCutoffMonth})
            </div>
          </details>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='quarterly' className='w-full'>
            <TabsList className='grid w-full grid-cols-2 mb-6'>
              <TabsTrigger value='quarterly' className='font-bold'>Quarterly</TabsTrigger>
              <TabsTrigger value='monthly' className='font-bold'>Monthly</TabsTrigger>
            </TabsList>

            {/* QUARTERLY TAB */}
            <TabsContent value='quarterly' className='space-y-4'>
              {/* Q1 BASELINE ROW */}
              <div className='bg-stone-50 border border-stone-200 p-4 rounded-lg mb-4'>
                <p className='text-sm font-bold text-stone-900'>Q1 Baseline: {actualQuarterlyData[0]?.actualExistingClients || 0} Existing + {actualQuarterlyData[0]?.actualBonusClients || 0} Bonus = {actualQuarterlyData[0]?.totalActualClients || 0} Total Active</p>
              </div>

              {/* Q2-Q4 QUARTERLY TABLE */}
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b-2 border-stone-300'>
                      <th className='text-left py-3 px-4 font-black text-stone-900'>Quarter</th>
                      <th className='text-center py-3 px-4 font-black text-stone-900'>Planned New Clients (Total)</th>
                      <th className='text-center py-3 px-4 font-black text-stone-900'>Actual New Clients (Total)</th>
                      <th className='text-center py-3 px-4 font-black text-stone-900'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actualQuarterlyData.slice(1).map((data, idx) => {
                      const quarterNum = idx + 1
                      const quarterLetter = ['Q2', 'Q3', 'Q4'][idx]
                      const currentQuarterNum = ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(currentQuarter)
                      
                      // Determine quarter status: completed/current = WON/LOST, future = PLANNED
                      let status: string
                      let badge: string
                      let bgColor: string
                      
                      if (quarterNum <= currentQuarterNum) {
                        // Completed or current quarter - show WON/LOST
                        const actual = data.actualPlannedClients
                        const planned = data.plannedClients
                        if (actual >= planned) {
                          status = 'green'
                          badge = 'WON'
                          bgColor = 'bg-emerald-50'
                        } else {
                          status = 'red'
                          badge = 'LOST'
                          bgColor = 'bg-rose-50'
                        }
                      } else {
                        // Future quarter - show PLANNED
                        status = 'upcoming'
                        badge = 'Planned'
                        bgColor = 'bg-stone-50'
                      }

                      return (
                        <tr key={idx + 1} className={cn('border-b border-stone-200', bgColor)}>
                          <td className='py-4 px-4 font-bold text-stone-900'>{quarterLetter}</td>
                          <td className='py-4 px-4 text-center font-black text-stone-900'>{data.plannedClients}</td>
                          <td className='py-4 px-4 text-center font-black text-stone-900'>{data.actualPlannedClients}</td>
                          <td className='py-4 px-4 text-center'>
                            <Badge className={cn(
                              'font-black',
                              status === 'green' ? 'bg-emerald-100 text-emerald-800' :
                              status === 'red' ? 'bg-rose-100 text-rose-800' :
                              'bg-stone-100 text-stone-700'
                            )}>
                              {badge}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* MONTHLY TAB */}
            <TabsContent value='monthly' className='space-y-4'>
              {/* PATCH 5: Context line about realistic targets */}
              <p className='text-xs font-semibold text-stone-600 italic mb-4'>
                Monthly targets reflect onboarding capacity and momentum. Variation across months is intentional.
              </p>

              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b-2 border-stone-300'>
                      <th className='text-left py-3 px-4 font-black text-stone-900'>Month</th>
                      <th className='text-center py-3 px-4 font-black text-stone-900'>Planned New Clients (Total)</th>
                      <th className='text-center py-3 px-4 font-black text-stone-900'>Actual New Clients (Total)</th>
                      <th className='text-center py-3 px-4 font-black text-stone-900'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // PATCH 3: Realistic monthly distribution that rolls up to quarterly targets
                      const monthlyTargets: { [key: string]: number } = {
                        'Apr': 2,
                        'May': 3,
                        'Jun': 5,
                        'Jul': 6,
                        'Aug': 7,
                        'Sep': 7,
                        'Oct': 8,
                        'Nov': 10,
                        'Dec': 12,
                      }

                      return Object.entries(monthlyTargets).map(([month, plannedCount]) => {
                        const actualInMonth = activeClients.filter((c) => c.joinMonth.includes(month) && c.origin === 'Planned').length

                        // PATCH 4: Realistic status logic
                        let status: 'upcoming' | 'green' | 'yellow' | 'red' = 'upcoming'
                        const currentMonth = new Date().getMonth()
                        const monthNum = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month)

                        if (monthNum <= currentMonth) {
                          if (actualInMonth >= plannedCount) status = 'green'
                          else if (actualInMonth === plannedCount - 1) status = 'yellow'
                          else status = 'red'
                        }

                        const config = statusConfig[status as keyof typeof statusConfig]

                        return (
                          <tr key={month} className={cn('border-b border-stone-200', config.bg)}>
                            <td className='py-4 px-4 font-bold text-stone-900'>{month}</td>
                            <td className='py-4 px-4 text-center font-black text-stone-900'>{plannedCount}</td>
                            <td className='py-4 px-4 text-center font-black text-stone-900'>{actualInMonth}</td>
                            <td className='py-4 px-4 text-center'>
                              <Badge className={cn('font-black', config.text, 'border')}>{config.badge}</Badge>
                            </td>
                          </tr>
                        )
                      })
                    })()}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* SECTION 4: CLIENT BOOK (Active + Dropped) */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl font-black text-stone-900'>Client Book</CardTitle>
          <Button asChild className='font-bold'>
            <a href='/admin?tab=company-performance'>Open Admin → Client Management</a>
          </Button>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* QUARTER SUMMARY LINE (NEW) */}
          <div className='text-xs font-black uppercase tracking-wider text-stone-600 px-4 py-2'>
            {currentQuarter} {currentYear} clients added: <span className='text-stone-900'>{plannedActive.length}</span> / <span className='text-stone-700'>{['Q1', 'Q2', 'Q3', 'Q4'].indexOf(currentQuarter) === 0 ? 0 : [0, 10, 20, 30][['Q1', 'Q2', 'Q3', 'Q4'].indexOf(currentQuarter)]}</span>
          </div>
          
          <div className='text-sm font-semibold text-stone-700 bg-stone-50 px-4 py-3 rounded-lg'>
            Active: <span className='font-black text-stone-900'>{activeClients.length}</span> | Dropped: <span className='font-black text-stone-900'>{droppedCount}</span> | Net: <span className='font-black text-emerald-700'>+{activeClients.length}</span>
          </div>

          <Tabs defaultValue='active' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='active' className='font-bold'>
                Active ({activeClients.length})
              </TabsTrigger>
              <TabsTrigger value='dropped' className='font-bold'>
                Dropped ({droppedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value='active' className='space-y-4'>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b-2 border-stone-300'>
                      <th className='text-left py-3 px-4 font-black text-stone-900'>Client Name</th>
                      <th className='text-left py-3 px-4 font-black text-stone-900'>Brand</th>
                      <th className='text-left py-3 px-4 font-black text-stone-900'>Join Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeClients.map((client) => (
                      <tr key={client.id} className='border-b border-stone-200 hover:bg-stone-50'>
                        <td className='py-4 px-4 font-semibold text-stone-900'>{client.name}</td>
                        <td className='py-4 px-4 text-sm font-semibold text-stone-700'>{client.brand}</td>
                        <td className='py-4 px-4 text-sm font-semibold text-stone-700'>{client.joinMonth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value='dropped' className='space-y-4'>
              {droppedClients.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='border-b-2 border-stone-300'>
                        <th className='text-left py-3 px-4 font-black text-stone-900'>Client Name</th>
                        <th className='text-left py-3 px-4 font-black text-stone-900'>Brand</th>
                        <th className='text-left py-3 px-4 font-black text-stone-900'>Dropped Month</th>
                        <th className='text-left py-3 px-4 font-black text-stone-900'>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {droppedClients.map((client) => (
                        <tr key={client.id} className='border-b border-stone-200 hover:bg-stone-50'>
                          <td className='py-4 px-4 font-semibold text-stone-900'>{client.name}</td>
                          <td className='py-4 px-4 text-sm font-semibold text-stone-700'>{client.brand}</td>
                          <td className='py-4 px-4 text-sm font-semibold text-stone-700'>{client.dropMonth || 'Unknown'}</td>
                          <td className='py-4 px-4 text-sm font-semibold text-stone-700'>{client.dropReason || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className='text-sm font-semibold text-stone-600 text-center py-8'>No dropped clients yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
