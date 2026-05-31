'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Search, Plus, Edit, Trash2, Settings, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Client {
  id: string
  name: string
  monthlyFee: number
  brand: 'Warrior Systems' | 'Story Marketing'
  joinMonth: string
  origin: 'Existing' | 'Planned' | 'Bonus'
  status: 'active' | 'dropped'
}

interface QuarterlyTarget {
  quarter: string
  plannedClients: number
  plannedRevenue: number
}

interface BPRNote {
  quarter: string
  verdict: string
  whatWentWrong: string
  decisionMade: string
  nextChanges: string
}

export function CompanyPerformanceAdmin() {
  const [clients, setClients] = useState<Client[]>([])

  const [quarterlyTargets, setQuarterlyTargets] = useState<QuarterlyTarget[]>([
    { quarter: 'Q1', plannedClients: 0, plannedRevenue: 0 },
    { quarter: 'Q2', plannedClients: 0, plannedRevenue: 0 },
    { quarter: 'Q3', plannedClients: 0, plannedRevenue: 0 },
    { quarter: 'Q4', plannedClients: 0, plannedRevenue: 0 },
  ])

  const [targets, setTargets] = useState({
    total: 0,
    warriorSystems: 0,
    storyMarketing: 0,
    plannedFeeBaseline: 0,
    mrrGoal: 0,
  })
  const [baselineCutoffMonth, setBaselineCutoffMonth] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'dropped'>('all')
  const [newClient, setNewClient] = useState({
    name: '',
    fee: '',
    brand: 'Warrior Systems' as 'Warrior Systems' | 'Story Marketing',
    joinMonth: '',
    origin: 'Planned' as 'Existing' | 'Planned' | 'Bonus',
  })
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [founderVerdict, setFounderVerdict] = useState<string>('')

  const activeClients = clients.filter(c => c.status === 'active')
  const droppedClients = clients.filter(c => c.status === 'dropped')
  const wsCount = activeClients.filter(c => c.brand === 'Warrior Systems').length
  const smCount = activeClients.filter(c => c.brand === 'Story Marketing').length

  const addClient = () => {
    if (newClient.name && newClient.fee && newClient.joinMonth) {
      const client: Client = {
        id: Date.now().toString(),
        name: newClient.name,
        monthlyFee: parseInt(newClient.fee),
        brand: newClient.brand,
        joinMonth: newClient.joinMonth,
        origin: newClient.origin,
        status: 'active',
      }
      setClients([...clients, client])
      setNewClient({ name: '', fee: '', brand: 'Warrior Systems', joinMonth: '', origin: 'Planned' })
    }
  }

  const deleteClient = (id: string) => {
    if (confirm('Are you sure? This will remove the client from the system.')) {
      setClients(clients.filter(c => c.id !== id))
    }
  }

  const toggleClientStatus = (id: string) => {
    setClients(
      clients.map(c =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'dropped' : 'active' } : c
      )
    )
  }

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateQuarterlyTarget = (idx: number, field: 'plannedClients' | 'plannedRevenue', value: number) => {
    const updated = [...quarterlyTargets]
    updated[idx] = { ...updated[idx], [field]: value }
    setQuarterlyTargets(updated)
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(2)}M`
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
    return `₹${value.toLocaleString()}`
  }

  return (
    <div className='space-y-8 max-w-7xl mx-auto px-4'>
      {/* HEADER */}
      <div className='border-b border-stone-200 pb-6'>
        <h1 className='text-4xl font-black text-stone-900 mb-2'>Company Performance Admin</h1>
        <p className='text-lg font-semibold text-stone-600'>Truth Engine — Configure targets, plans, and client reality (admin only)</p>
      </div>

      {/* ADMIN SECTION 1: COMPANY TARGETS CONFIGURATION */}
      <Card className='border-2 border-stone-300 bg-stone-50'>
        <CardHeader>
          <CardTitle className='text-xl font-black text-stone-900 flex items-center gap-2'>
            <Settings className='w-5 h-5' />
            Company Targets Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-3 gap-6'>
            <div className='space-y-2'>
              <label className='text-sm font-black uppercase tracking-wider text-stone-700'>Year-End Active Clients Target (Dec 2026)</label>
              <Input
                type='number'
                value={targets.total}
                onChange={(e) => setTargets({ ...targets, total: parseInt(e.target.value) })}
                className='text-2xl font-black h-14'
              />
              <p className='text-xs font-semibold text-stone-600'>Current Active: {activeClients.length}</p>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-black uppercase tracking-wider text-stone-700'>Year-End Active Target — Warrior Systems</label>
              <Input
                type='number'
                value={targets.warriorSystems}
                onChange={(e) => setTargets({ ...targets, warriorSystems: parseInt(e.target.value) })}
                className='text-2xl font-black h-14'
              />
              <p className='text-xs font-semibold text-stone-600'>Current Active: {wsCount}</p>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-black uppercase tracking-wider text-stone-700'>Year-End Active Target — Story Marketing</label>
              <Input
                type='number'
                value={targets.storyMarketing}
                onChange={(e) => setTargets({ ...targets, storyMarketing: parseInt(e.target.value) })}
                className='text-2xl font-black h-14'
              />
              <p className='text-xs font-semibold text-stone-600'>Current Active: {smCount}</p>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-black uppercase tracking-wider text-stone-700'>Planned Fee Baseline (Monthly)</label>
              <Input
                type='number'
                value={targets.plannedFeeBaseline}
                onChange={(e) => setTargets({ ...targets, plannedFeeBaseline: parseInt(e.target.value) })}
                className='text-2xl font-black h-14'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-black uppercase tracking-wider text-stone-700'>2026 MRR Goal</label>
              <Input
                type='number'
                value={targets.mrrGoal}
                onChange={(e) => setTargets({ ...targets, mrrGoal: parseInt(e.target.value) })}
                className='text-2xl font-black h-14'
              />
              <p className='text-xs font-semibold text-stone-600'>Auto-calculated</p>
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-black uppercase tracking-wider text-stone-700'>Baseline Cutoff Month</label>
              <Input
                type='text'
                placeholder='e.g., Mar 2026'
                value={baselineCutoffMonth}
                onChange={(e) => setBaselineCutoffMonth(e.target.value)}
                className='text-2xl font-black h-14'
              />
              <p className='text-xs font-semibold text-stone-600'>Existing clients with join month ≤ cutoff are counted as baseline (Q1).</p>
            </div>
          </div>
          <div className='bg-amber-50 border border-amber-300 rounded-lg p-4 flex gap-3'>
            <AlertCircle className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5' />
            <div className='text-sm font-semibold text-amber-900'>
              These values are the foundation of all planning. Any changes require board approval and should be rare.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ADMIN SECTION 2: QUARTERLY TARGETS */}
      <Card className='border-2 border-stone-200'>
        <CardHeader>
          <CardTitle className='text-xl font-black text-stone-900'>2026 Quarterly Targets — Growth Planning</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='border-b-2 border-stone-300 hover:bg-transparent'>
                  <TableHead className='font-black text-stone-900'>Quarter</TableHead>
                  <TableHead className='font-black text-stone-900'>Planned NEW Clients</TableHead>
                  <TableHead className='font-black text-stone-900'>Planned Revenue</TableHead>
                  <TableHead className='font-black text-stone-900'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quarterlyTargets.map((qt, idx) => (
                  <TableRow key={idx} className='border-b border-stone-200'>
                    <TableCell className='font-semibold text-stone-900'>{qt.quarter}</TableCell>
                    <TableCell className='font-black text-stone-900'>
                      <Input
                        type='number'
                        value={qt.plannedClients}
                        onChange={(e) => updateQuarterlyTarget(idx, 'plannedClients', parseInt(e.target.value))}
                        className='w-24'
                      />
                    </TableCell>
                    <TableCell className='font-black text-stone-900'>
                      <Input
                        type='number'
                        value={qt.plannedRevenue}
                        onChange={(e) => updateQuarterlyTarget(idx, 'plannedRevenue', parseInt(e.target.value))}
                        className='w-32'
                      />
                    </TableCell>
                    <TableCell className='font-black text-stone-900'>
                      <Button variant='outline' size='sm'>
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className='text-xs font-semibold text-stone-600 italic'>
            Quarterly targets represent NEW clients onboarded in that quarter (not total active clients). Q1 represents baseline with zero planned growth.
          </p>
        </CardContent>
      </Card>

      {/* ADMIN SECTION 3: CLIENT MANAGEMENT (REALITY INPUT) */}
      <Card className='border-2 border-stone-200'>
        <CardHeader>
          <CardTitle className='text-xl font-black text-stone-900'>Client Management</CardTitle>
          <p className='text-sm font-semibold text-stone-600 mt-2'>
            Add, edit, or remove clients. System auto-calculates active clients, run-rate, and quarterly actuals.
          </p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Summary Stats */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='bg-emerald-50 border border-emerald-200 rounded p-4'>
              <p className='text-xs font-bold uppercase tracking-wider text-stone-700 mb-2'>Active Clients</p>
              <p className='text-3xl font-black text-stone-900'>{activeClients.length}</p>
            </div>
            <div className='bg-rose-50 border border-rose-200 rounded p-4'>
              <p className='text-xs font-bold uppercase tracking-wider text-stone-700 mb-2'>Dropped Clients</p>
              <p className='text-3xl font-black text-stone-900'>{droppedClients.length}</p>
            </div>
            <div className='bg-stone-50 border border-stone-200 rounded p-4'>
              <p className='text-xs font-bold uppercase tracking-wider text-stone-700 mb-2'>Current MRR</p>
              <p className='text-2xl font-black text-stone-900'>{formatCurrency(activeClients.reduce((sum, c) => sum + c.monthlyFee, 0))}</p>
            </div>
          </div>

          {/* Add Client Form */}
          <div className='bg-stone-50 border border-stone-200 rounded-lg p-6 space-y-4'>
            <h3 className='text-lg font-black text-stone-900'>Add New Client</h3>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
              <Input placeholder='Client name' value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} className='font-semibold' />
              <Input
                placeholder='Monthly fee (₹)'
                type='number'
                value={newClient.fee}
                onChange={(e) => setNewClient({ ...newClient, fee: e.target.value })}
                className='font-semibold'
              />
              <Input placeholder='Join month (e.g., Jan 2026)' value={newClient.joinMonth} onChange={(e) => setNewClient({ ...newClient, joinMonth: e.target.value })} className='font-semibold' />
              <Select value={newClient.brand} onValueChange={(value: any) => setNewClient({ ...newClient, brand: value })}>
                <SelectTrigger className='font-semibold'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Warrior Systems'>Warrior Systems</SelectItem>
                  <SelectItem value='Story Marketing'>Story Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newClient.origin} onValueChange={(value: any) => setNewClient({ ...newClient, origin: value })}>
                <SelectTrigger className='font-semibold'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Existing'>Existing</SelectItem>
                  <SelectItem value='Planned'>Planned</SelectItem>
                  <SelectItem value='Bonus'>Bonus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addClient} className='gap-2 font-bold'>
              <Plus className='w-4 h-4' />
              Add Client
            </Button>
          </div>

          {/* Search and Filter */}
          <div className='flex gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400' />
              <Input placeholder='Search clients...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='pl-10 font-semibold' />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className='w-[150px] font-semibold'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='dropped'>Dropped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clients Table */}
          <div className='border rounded-lg overflow-x-auto'>
            <Table>
              <TableHeader className='bg-stone-50'>
                <TableRow className='border-b-2 border-stone-300 hover:bg-transparent'>
                  <TableHead className='font-black text-stone-900'>Client Name</TableHead>
                  <TableHead className='font-black text-stone-900'>Monthly Fee</TableHead>
                  <TableHead className='font-black text-stone-900'>Brand</TableHead>
                  <TableHead className='font-black text-stone-900'>Join Month</TableHead>
                  <TableHead className='font-black text-stone-900'>Origin</TableHead>
                  <TableHead className='font-black text-stone-900'>Status</TableHead>
                  <TableHead className='font-black text-stone-900'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className='border-b border-stone-200'>
                    <TableCell className='font-semibold text-stone-900'>{client.name}</TableCell>
                    <TableCell className='font-black text-stone-900'>{formatCurrency(client.monthlyFee)}</TableCell>
                    <TableCell className='font-semibold text-stone-700'>{client.brand}</TableCell>
                    <TableCell className='text-stone-700'>{client.joinMonth}</TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn(
                          'font-black',
                          client.origin === 'Existing' ? 'bg-blue-100 text-blue-800' : client.origin === 'Planned' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {client.origin}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'font-black',
                          client.status === 'active' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 'bg-rose-100 text-rose-800 hover:bg-rose-100'
                        )}
                      >
                        {client.status === 'active' ? 'Active' : 'Dropped'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Button variant='ghost' size='sm' onClick={() => toggleClientStatus(client.id)} className='font-semibold'>
                          {client.status === 'active' ? 'Drop' : 'Restore'}
                        </Button>
                        <Button variant='ghost' size='sm' onClick={() => deleteClient(client.id)}>
                          <Trash2 className='w-4 h-4 text-rose-600' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ADMIN SECTION 4: CEO VERDICT & BPR NOTES */}
      <Card className='border-2 border-stone-200'>
        <CardHeader>
          <CardTitle className='text-xl font-black text-stone-900'>CEO Verdict & Quarterly BPR Notes</CardTitle>
          <p className='text-sm font-semibold text-stone-600 mt-2'>Update verdict and capture quarterly insights (read-only in CEO view)</p>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Founder Verdict */}
          <div className='space-y-3'>
            <label className='text-sm font-black uppercase tracking-wider text-stone-700'>Current Founder Verdict</label>
            <Select value={founderVerdict} onValueChange={(val: string) => setFounderVerdict(val)}>
              <SelectTrigger className='font-bold h-12'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='On Track'>On Track</SelectItem>
                <SelectItem value='Slightly Behind'>Slightly Behind</SelectItem>
                <SelectItem value='At Risk'>At Risk</SelectItem>
              </SelectContent>
            </Select>
            <p className='text-xs font-semibold text-stone-600 italic'>This appears prominently in CEO view. Update when status changes.</p>
          </div>

          {/* BPR Notes by Quarter */}
          <div className='space-y-6 pt-4 border-t border-stone-200'>
            {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, idx) => (
              <div key={quarter} className='space-y-4 pb-6 border-b border-stone-100'>
                <h4 className='text-lg font-black text-stone-900'>{quarter} BPR Notes</h4>
                <div>
                  <label className='text-sm font-bold text-stone-700 block mb-2'>What went wrong this quarter?</label>
                  <Textarea placeholder='Document challenges, obstacles, or missed expectations...' className='font-semibold min-h-20' />
                </div>
                <div>
                  <label className='text-sm font-bold text-stone-700 block mb-2'>What decision was taken?</label>
                  <Textarea placeholder='Describe leadership decisions, pivots, or course corrections...' className='font-semibold min-h-20' />
                </div>
                <div>
                  <label className='text-sm font-bold text-stone-700 block mb-2'>What changes for next quarter?</label>
                  <Textarea placeholder='Outline actions, process changes, or revised targets...' className='font-semibold min-h-20' />
                </div>
              </div>
            ))}
          </div>
          <p className='text-xs font-semibold text-stone-600 italic'>BPR notes create organizational memory and enable CEO to tell the company story at board meetings.</p>
        </CardContent>
      </Card>
    </div>
  )
}
