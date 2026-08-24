import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Select } from '@/components/ui/Select'
import { Dropdown } from '@/components/ui/Dropdown'
import { PermissionGate } from '@/components/shared/PermissionGate'
import { useToast } from '@/app/toast-context'
import { applications as seedApplications, candidates, jobOpenings } from '@/data/seed'
import { initials } from '@/lib/utils'
import type { Application, ApplicationStage } from '@/types'

const STAGES: { key: ApplicationStage; label: string }[] = [
  { key: 'APPLIED', label: 'Applied' },
  { key: 'SCREENING', label: 'Screening' },
  { key: 'SHORTLISTED', label: 'Shortlisted' },
  { key: 'INTERVIEW', label: 'Interview' },
  { key: 'OFFER', label: 'Offer' },
  { key: 'HIRED', label: 'Hired' },
]

export default function PipelinePage() {
  const { toast } = useToast()
  const [apps, setApps] = useState<Application[]>(seedApplications.filter((a) => a.stage !== 'REJECTED'))
  const [mobileStage, setMobileStage] = useState<ApplicationStage>('APPLIED')

  function moveStage(app: Application, direction: 1 | -1) {
    const idx = STAGES.findIndex((s) => s.key === app.stage)
    const nextIdx = idx + direction
    if (nextIdx < 0 || nextIdx >= STAGES.length) return
    const nextStage = STAGES[nextIdx].key
    setApps((prev) => prev.map((a) => (a.id === app.id ? { ...a, stage: nextStage } : a)))
    toast({ title: `Moved to ${STAGES[nextIdx].label}`, variant: 'success' })
  }

  function candidateFor(app: Application) {
    return candidates.find((c) => c.id === app.candidateId)
  }

  return (
    <div>
      {/* Desktop kanban */}
      <div className="hidden gap-3 overflow-x-auto pb-2 lg:flex">
        {STAGES.map((stage) => {
          const stageApps = apps.filter((a) => a.stage === stage.key)
          return (
            <div key={stage.key} className="w-64 shrink-0">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{stage.label}</p>
                <span className="text-xs text-ink-400">{stageApps.length}</span>
              </div>
              <div className="space-y-2">
                {stageApps.map((app) => {
                  const candidate = candidateFor(app)
                  if (!candidate) return null
                  return (
                    <Card key={app.id} className="p-3">
                      <div className="flex items-start gap-2.5">
                        <Avatar name={initials(candidate.firstName, candidate.lastName)} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink-900">{candidate.firstName} {candidate.lastName}</p>
                          <p className="truncate text-xs text-ink-500">{jobOpenings.find((j) => j.id === app.jobId)?.title}</p>
                        </div>
                      </div>
                      <PermissionGate permission="recruitment.manage">
                        <div className="mt-2.5 flex justify-end">
                          <Dropdown
                            align="right"
                            trigger={<button className="text-xs font-medium text-brand-600 hover:underline">Move stage</button>}
                            items={[
                              { label: 'Move forward', onClick: () => moveStage(app, 1) },
                              { label: 'Move back', onClick: () => moveStage(app, -1) },
                            ]}
                          />
                        </div>
                      </PermissionGate>
                    </Card>
                  )
                })}
                {stageApps.length === 0 && <p className="rounded-lg border border-dashed border-ink-200 p-3 text-center text-xs text-ink-400">No candidates</p>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile stage selector + list */}
      <div className="lg:hidden">
        <Select value={mobileStage} onChange={(e) => setMobileStage(e.target.value as ApplicationStage)} aria-label="Select pipeline stage">
          {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label} ({apps.filter((a) => a.stage === s.key).length})</option>)}
        </Select>
        <div className="mt-3 space-y-2">
          {apps.filter((a) => a.stage === mobileStage).map((app) => {
            const candidate = candidateFor(app)
            if (!candidate) return null
            return (
              <Card key={app.id} className="p-3">
                <div className="flex items-center gap-2.5">
                  <Avatar name={initials(candidate.firstName, candidate.lastName)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">{candidate.firstName} {candidate.lastName}</p>
                    <p className="truncate text-xs text-ink-500">{jobOpenings.find((j) => j.id === app.jobId)?.title}</p>
                  </div>
                  <PermissionGate permission="recruitment.manage">
                    <button onClick={() => moveStage(app, 1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-600 hover:bg-brand-50" aria-label="Advance stage">
                      <ChevronRight size={16} />
                    </button>
                  </PermissionGate>
                </div>
              </Card>
            )
          })}
          {apps.filter((a) => a.stage === mobileStage).length === 0 && <p className="py-8 text-center text-sm text-ink-400">No candidates in this stage.</p>}
        </div>
      </div>
    </div>
  )
}
