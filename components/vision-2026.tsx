'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChevronDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusConfig } from '@/lib/status-system'

type MonthlyPlanRow = {
  month: string
  plannedWS: number
  plannedSM: number
  plannedTotal: number
  actualWS: number
  actualSM: number
  actualTotal: number
}

type MonthlyAdditionRow = {
  month: string
  wsAdditions: number
  smAdditions: number
}

type PhaseRow = {
  phase: string
  title: string
  subtitle: string
  bullets: string[]
  outcome: string
}

const monthlyData: MonthlyPlanRow[] = []
const monthlyAdditions: MonthlyAdditionRow[] = []
const phaseData: PhaseRow[] = []

const getPricingAssumption = (_isAdmin: boolean) => {
  return {
    unitValue: null as number | null,
    currency: 'INR',
    churnAssumption: null as number | null,
  }
}

type Vision2026Props = {
  isAdmin?: boolean
  year?: number
  unitValue?: number | null
  currency?: string
  churnAssumption?: number | null
  monthlyData?: MonthlyPlanRow[]
  monthlyAdditions?: MonthlyAdditionRow[]
  phaseData?: PhaseRow[]
  oneGoalStatement?: string
  goalBullets?: string[]
}

const computeStatus = (actualTotal: number, plannedTotal: number) => {
  const executionPercentage = computeExecutionPercentage(actualTotal, plannedTotal);
  if (executionPercentage >= 90) {
    return 'green';
  } else if (executionPercentage >= 75) {
    return 'yellow';
  } else {
    return 'red';
  }
}

const computeExecutionPercentage = (actualTotal: number, plannedTotal: number) => {
  return plannedTotal > 0 ? Math.round((actualTotal / plannedTotal) * 100) : 0;
}

export function Vision2026({
  isAdmin = false,
  year,
  unitValue,
  currency,
  churnAssumption,
  monthlyData: monthlyDataProp,
  monthlyAdditions: monthlyAdditionsProp,
  phaseData: phaseDataProp,
  oneGoalStatement,
  goalBullets,
}: Vision2026Props) {
  const [selectedQuarter, setSelectedQuarter] = useState('Q2')
  const [showFinancials, setShowFinancials] = useState(false)
  const [editingMonth, setEditingMonth] = useState<string | null>(null)
  const [monthlyDataState, setMonthlyDataState] = useState(monthlyDataProp ?? monthlyData)
  const [monthlyAdditionsState] = useState(monthlyAdditionsProp ?? monthlyAdditions)
  const [phaseDataState] = useState(phaseDataProp ?? phaseData)
  const pricingDefaults = getPricingAssumption(isAdmin)
  const pricing = {
    unitValue: unitValue !== undefined ? unitValue : pricingDefaults.unitValue,
    currency: currency ?? pricingDefaults.currency,
    churnAssumption: churnAssumption !== undefined ? churnAssumption : pricingDefaults.churnAssumption,
  }

  const currentYear = year ?? new Date().getFullYear()
  const nextYear = currentYear + 1
  const yearRange = `Apr–Dec ${currentYear}`
  const heroHeading = `${currentYear} — Foundation Year`
  const goalStatement = oneGoalStatement ?? `Exit ${currentYear} with a calm, system-led business at target monthly revenue`
  const unitValueLabel = pricing.unitValue ? `₹${pricing.unitValue.toLocaleString()}/month` : 'Target unit value'
  const defaultGoalBullets = goalBullets ?? [
    '✓ Revenue compounds because clients stay (zero churn)',
    `✓ Each client brings ${unitValueLabel} without heroic effort`,
    '✓ Systems run the business, not chaos.',
  ]

  const quarters = {
    Q2: { label: 'Q2 (Apr–Jun)', theme: 'First Proof' },
    Q3: { label: 'Q3 (Jul–Sep)', theme: 'Momentum Rising' },
    Q4: { label: 'Q4 (Oct–Dec)', theme: 'Authority Peak' },
  }

  const currentQuarter = quarters[selectedQuarter as keyof typeof quarters]

  // Compute execution percentage and status
  const chartData = monthlyDataState.map((m) => ({
    month: m.month,
    plannedTotal: m.plannedTotal,
    actualTotal: m.actualTotal,
    plannedRevenue: pricing.unitValue !== null ? m.plannedTotal * pricing.unitValue : 0,
    actualRevenue: pricing.unitValue !== null ? m.actualTotal * pricing.unitValue : 0,
  }))

  return (
    <div className='space-y-8 pb-12'>
      {/* SECTION 1: Hero Strip */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
        <div>
          <h1 className='text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight'>{heroHeading}</h1>
          <p className='text-lg font-semibold text-stone-700 mt-2'>
            Build authority before scale. Systems before speed. Leaders before growth.
          </p>
        </div>

        {/* Status Capsule */}
        <div className='flex flex-col gap-3 p-4 bg-stone-50 rounded-lg border border-stone-200'>
          <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
            <SelectTrigger className='w-40 bg-white border-stone-300'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Q2'>Q2 (Apr–Jun)</SelectItem>
              <SelectItem value='Q3'>Q3 (Jul–Sep)</SelectItem>
              <SelectItem value='Q4'>Q4 (Oct–Dec)</SelectItem>
            </SelectContent>
          </Select>

          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-stone-600 mb-1'>Theme</p>
            <p className='text-sm font-black text-stone-900'>{currentQuarter.theme}</p>
          </div>

          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-stone-600 mb-2'>Confidence</p>
            <div className='flex gap-2'>
              {(['green', 'yellow', 'red'] as const).map((level) => (
                <button
                  key={level}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 transition-all',
                    level === 'green' && 'bg-emerald-500 border-emerald-600',
                    level === 'yellow' && 'bg-amber-400 border-amber-500',
                    level === 'red' && 'bg-rose-500 border-rose-600',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: The One Goal */}
      <Card className='border-l-4 border-l-emerald-500 bg-emerald-50'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-stone-900'>The ONE Goal</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-2xl font-semibold text-emerald-900'>
            {goalStatement}
          </div>
          <div className='space-y-2'>
            {defaultGoalBullets.map((bullet, idx) => (
              <p key={idx} className='text-sm font-semibold text-stone-800'>
                {bullet}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Year Flow / Phases */}
      <div>
        <h2 className='text-2xl font-black text-stone-900 mb-4'>Execution Phases</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {phaseData.length === 0 ? (
            <Card className='border border-dashed border-stone-300 bg-white'>
              <CardContent className='py-10 text-center text-sm text-stone-500'>
                No execution phases yet.
              </CardContent>
            </Card>
          ) : (
            phaseData.map((phase, idx) => (
              <Card key={idx} className='border-l-4 border-l-stone-400'>
                <CardHeader className='pb-3'>
                  <div className='text-xs font-black uppercase tracking-wider text-stone-600'>{phase.phase}</div>
                  <CardTitle className='text-lg font-black text-stone-900'>{phase.title}</CardTitle>
                  <p className='text-sm font-semibold text-stone-700 mt-1'>{phase.subtitle}</p>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <ul className='space-y-2'>
                    {phase.bullets.map((bullet, i) => (
                      <li key={i} className='text-sm font-semibold text-stone-700 flex gap-2'>
                        <span>•</span> {bullet}
                      </li>
                    ))}
                  </ul>
                  <div className='pt-2 border-t border-stone-200'>
                    <p className='text-sm font-bold text-stone-900'>Outcome: {phase.outcome}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* SECTION 4: Rules of Revenue */}
      <Card className='bg-stone-100 border-stone-300'>
        <CardHeader>
          <CardTitle className='text-2xl font-black text-stone-900'>Rules of Revenue</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='p-4 bg-white rounded-lg border border-stone-300'>
              <p className='text-xs font-black uppercase tracking-wider text-stone-600 mb-2'>Unit Value</p>
              <p className='text-2xl font-black text-stone-900'>
                {isAdmin && showFinancials && pricing.unitValue ? `₹${pricing.unitValue.toLocaleString()}` : 'Hidden'}
              </p>
            </div>
            <div className='p-4 bg-white rounded-lg border border-stone-300'>
              <p className='text-xs font-black uppercase tracking-wider text-stone-600 mb-2'>Currency</p>
              <p className='text-2xl font-black text-stone-900'>INR (₹)</p>
            </div>
            <div className='p-4 bg-white rounded-lg border border-stone-300'>
              <p className='text-xs font-black uppercase tracking-wider text-stone-600 mb-2'>Churn Assumption</p>
              <p className='text-2xl font-black text-stone-900'>
                {pricing.churnAssumption !== null && pricing.churnAssumption !== undefined ? `${pricing.churnAssumption}%` : 'Hidden'}
              </p>
            </div>
            <div className='p-4 bg-white rounded-lg border border-stone-300'>
              <p className='text-xs font-black uppercase tracking-wider text-stone-600 mb-2'>Formula</p>
              <p className='text-sm font-semibold text-stone-800'>Active Clients × Unit Value = Monthly Revenue</p>
            </div>
          </div>

          {isAdmin && (
            <div className='pt-4 border-t border-stone-300'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowFinancials(!showFinancials)}
                className='font-bold'
              >
                {showFinancials ? 'Hide' : 'Show'} Financials
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 5: Plan vs Actual Scoreboard */}
      <div>
        <h2 className='text-2xl font-black text-stone-900 mb-4'>Plan vs Actual ({yearRange})</h2>

        {/* Scoreboard Table */}
        <div className='overflow-x-auto border rounded-lg bg-white'>
          <table className='w-full text-sm'>
            <thead className='bg-stone-100 border-b-2 border-stone-300'>
              <tr>
                <th className='px-4 py-3 text-left font-black text-stone-900 text-xs'>Month</th>
                <th className='px-4 py-3 text-center font-black text-stone-900 text-xs'>Planned WS</th>
                <th className='px-4 py-3 text-center font-black text-stone-900 text-xs'>Planned SM</th>
                <th className='px-4 py-3 text-center font-black text-stone-900 text-xs'>Planned Total</th>
                <th className='px-4 py-3 text-center font-black text-stone-900 text-xs'>Actual WS</th>
                <th className='px-4 py-3 text-center font-black text-stone-900 text-xs'>Actual SM</th>
                <th className='px-4 py-3 text-center font-black text-stone-900 text-xs'>Actual Total</th>
                <th className='px-4 py-3 text-center font-black text-stone-900 text-xs'>Status</th>
                {showFinancials && isAdmin && (
                  <>
                    <th className='px-4 py-3 text-center font-black text-stone-900 text-xs'>Planned Rev</th>
                    <th className='px-4 py-3 text-center font-black text-stone-900 text-xs'>Actual Rev</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {monthlyDataState.length === 0 ? (
                <tr>
                  <td colSpan={showFinancials && isAdmin ? 10 : 8} className='px-4 py-8 text-center text-sm text-stone-500'>
                    No plan data yet.
                  </td>
                </tr>
              ) : (
                monthlyDataState.map((row) => {
                  const percentage = computeExecutionPercentage(row.actualTotal, row.plannedTotal)
                  const statusConfig = getStatusConfig(percentage)
                  const statusColor = statusConfig.bg

                  return (
                    <tr key={row.month} className={cn('border-b border-stone-200 hover:bg-stone-50', statusColor)}>
                      <td className='px-4 py-3 font-semibold text-stone-900'>{row.month}</td>
                      <td className='px-4 py-3 text-center font-medium text-stone-800'>{row.plannedWS}</td>
                      <td className='px-4 py-3 text-center font-medium text-stone-800'>{row.plannedSM}</td>
                      <td className='px-4 py-3 text-center font-semibold text-stone-900'>{row.plannedTotal}</td>
                      <td className='px-4 py-3 text-center font-medium text-stone-800'>{row.actualWS}</td>
                      <td className='px-4 py-3 text-center font-medium text-stone-800'>{row.actualSM}</td>
                      <td className='px-4 py-3 text-center font-semibold text-stone-900'>{row.actualTotal}</td>
                      <td className='px-4 py-3 text-center'>
                        <Badge className={cn('font-semibold', statusConfig.badge)}>
                          {statusConfig.status}
                        </Badge>
                      </td>
                      {showFinancials && isAdmin && (
                        <>
                          <td className='px-4 py-3 text-center font-medium text-stone-800'>
                            {pricing.unitValue !== null ? `₹${(row.plannedTotal * pricing.unitValue).toLocaleString()}` : '—'}
                          </td>
                          <td className='px-4 py-3 text-center font-medium text-stone-800'>
                            {pricing.unitValue !== null ? `₹${(row.actualTotal * pricing.unitValue).toLocaleString()}` : '—'}
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Monthly Additions Mini Table */}
        <div className='mt-6'>
          <h3 className='text-lg font-bold text-stone-900 mb-3'>Monthly New Client Additions</h3>
          <div className='overflow-x-auto border rounded-lg bg-white'>
            <table className='w-full text-sm'>
              <thead className='bg-stone-100 border-b-2 border-stone-300'>
                <tr>
                  <th className='px-4 py-3 text-left font-black text-stone-900'>Month</th>
                  <th className='px-4 py-3 text-center font-black text-stone-900'>Warrior Systems</th>
                  <th className='px-4 py-3 text-center font-black text-stone-900'>Story Marketing</th>
                </tr>
              </thead>
              <tbody>
                {monthlyAdditions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className='px-4 py-8 text-center text-sm text-stone-500'>
                      No monthly additions yet.
                    </td>
                  </tr>
                ) : (
                  monthlyAdditions.map((row) => (
                    <tr key={row.month} className='border-b border-stone-200 hover:bg-stone-50'>
                      <td className='px-4 py-3 font-bold text-stone-900'>{row.month}</td>
                      <td className='px-4 py-3 text-center font-semibold text-stone-800'>{row.wsAdditions}</td>
                      <td className='px-4 py-3 text-center font-semibold text-stone-800'>{row.smAdditions}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className='space-y-6'>
        <div>
          <h3 className='text-xl font-black text-stone-900 mb-4'>Active Clients: Plan vs Actual</h3>
          <Card>
            <CardContent className='pt-6'>
              {chartData.length === 0 ? (
                <div className='py-16 text-center text-sm text-stone-500'>No chart data yet.</div>
              ) : (
                <ResponsiveContainer width='100%' height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#d1d5db' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                    <Line type='monotone' dataKey='plannedTotal' stroke='#6366f1' name='Planned' strokeWidth={2} />
                    <Line type='monotone' dataKey='actualTotal' stroke='#10b981' name='Actual' strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {showFinancials && isAdmin && (
          <div>
            <h3 className='text-xl font-black text-stone-900 mb-4'>Monthly Revenue: Plan vs Actual</h3>
            <Card>
              <CardContent className='pt-6'>
                {chartData.length === 0 ? (
                  <div className='py-16 text-center text-sm text-stone-500'>No chart data yet.</div>
                ) : (
                  <ResponsiveContainer width='100%' height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#d1d5db' />
                      <XAxis dataKey='month' />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                        }}
                        formatter={(value) => [`₹${(value as number).toLocaleString()}`, '']}
                      />
                      <Legend />
                      <Line type='monotone' dataKey='plannedRevenue' stroke='#6366f1' name='Planned' strokeWidth={2} />
                      <Line type='monotone' dataKey='actualRevenue' stroke='#10b981' name='Actual' strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* SECTION 6: Why This Year */}
      <Card className='border-l-4 border-l-blue-500 bg-blue-50'>
        <CardHeader>
          <CardTitle className='text-2xl font-black text-stone-900'>Why This Year Is Designed This Way</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <p className='text-sm font-semibold text-stone-800'>
            ✓ Slow, deliberate onboarding prevents burnout and ensures system mastery
          </p>
          <p className='text-sm font-semibold text-stone-800'>
            ✓ Documentation and proof points build authority and attract ideal clients
          </p>
          <p className='text-sm font-semibold text-stone-800'>
            ✓ Zero churn + high unit value = calm, sustainable revenue
          </p>
          <p className='text-sm font-semibold text-stone-800'>
            ✓ Foundation in {currentYear} enables exponential growth in {nextYear} without compromise
          </p>
          <div className='pt-4 border-t border-blue-200'>
            <p className='text-lg font-black text-blue-900'>We will not sacrifice calm for speed.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
