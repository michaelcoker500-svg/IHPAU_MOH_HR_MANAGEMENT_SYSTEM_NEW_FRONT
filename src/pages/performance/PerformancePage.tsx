import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { PermissionGate } from '@/components/shared/PermissionGate'
import { useAuth } from '@/app/auth-context'
import { useToast } from '@/app/toast-context'
import { performanceCycles, goals as seedGoals, reviews } from '@/data/seed'
import { employeeName } from '@/hooks/useLookup'
import { formatDate } from '@/lib/utils'
import type { Goal } from '@/types'

export default function PerformancePage() {
  const { user, can } = useAuth()
  const { toast } = useToast()
  const [tab, setTab] = useState('goals')
  const [goals, setGoals] = useState<Goal[]>(seedGoals)
  const [editGoal, setEditGoal] = useState<Goal | null>(null)
  const [progressInput, setProgressInput] = useState('')

  const visibleGoals = can('performance.manage') || user?.role === 'MANAGER' ? goals : goals.filter((g) => g.employeeId === user?.employeeId)

  function saveProgress() {
    if (!editGoal) return
    const value = Number(progressInput)
    if (Number.isNaN(value)) {
      toast({ title: 'Please enter a valid number', variant: 'error' })
      return
    }
    setGoals((prev) => prev.map((g) => (g.id === editGoal.id ? { ...g, current: value, status: value >= g.target ? 'COMPLETED' : g.status } : g)))
    setEditGoal(null)
    toast({ title: 'Goal progress updated', variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="Performance" subtitle="Goals, cycles, and reviews" />
      <Card>
        <div className="px-2 pt-2 sm:px-3">
          <Tabs
            tabs={[
              { key: 'cycles', label: 'Cycles', count: performanceCycles.length },
              { key: 'goals', label: 'Goals', count: visibleGoals.length },
              { key: 'reviews', label: 'Reviews', count: reviews.length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <CardBody>
          {tab === 'cycles' && (
            <div className="divide-y divide-ink-100">
              {performanceCycles.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{c.name}</p>
                    <p className="text-xs text-ink-500">{formatDate(c.startDate)} – {formatDate(c.endDate)}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}

          {tab === 'goals' && (
            <div className="space-y-3">
              {visibleGoals.map((g) => (
                <div key={g.id} className="rounded-lg border border-ink-100 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-800">{g.title}</p>
                      <p className="text-xs text-ink-500">{employeeName(g.employeeId)} · Due {formatDate(g.dueDate)}</p>
                    </div>
                    <StatusBadge status={g.status} />
                  </div>
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(100, (g.current / g.target) * 100)}%` }} />
                    </div>
                    <span className="shrink-0 text-xs text-ink-500">{g.current}/{g.target}{g.unit === '%' ? '%' : ` ${g.unit}`}</span>
                    <PermissionGate permission="performance.manage">
                      <Button size="sm" variant="ghost" onClick={() => { setEditGoal(g); setProgressInput(String(g.current)) }}>Update</Button>
                    </PermissionGate>
                  </div>
                </div>
              ))}
              {visibleGoals.length === 0 && <p className="py-8 text-center text-sm text-ink-400">No goals assigned.</p>}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="divide-y divide-ink-100">
              {reviews.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{employeeName(r.employeeId)}</p>
                    <p className="text-xs text-ink-500">{r.type} review · Rating {r.rating}/5</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        open={!!editGoal}
        onClose={() => setEditGoal(null)}
        title="Update Goal Progress"
        description={editGoal?.title}
        footer={<><Button variant="outline" onClick={() => setEditGoal(null)}>Cancel</Button><Button onClick={saveProgress}>Save</Button></>}
      >
        <Input label={`Current progress (previous: ${editGoal?.current})`} type="number" value={progressInput} onChange={(e) => setProgressInput(e.target.value)} />
      </Modal>
    </div>
  )
}
