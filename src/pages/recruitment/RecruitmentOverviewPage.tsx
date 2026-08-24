import { useNavigate } from 'react-router-dom'
import { Briefcase, Users, CalendarClock, FileCheck } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { jobOpenings, applications, candidates, interviews, offers, departments } from '@/data/seed'

export default function RecruitmentOverviewPage() {
  const navigate = useNavigate()
  const openJobs = jobOpenings.filter((j) => j.status === 'OPEN')

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Open Positions" value={openJobs.length} icon={Briefcase} tone="brand" onClick={() => navigate('/recruitment/jobs')} />
        <StatCard label="Total Candidates" value={candidates.length} icon={Users} tone="info" onClick={() => navigate('/recruitment/candidates')} />
        <StatCard label="Interviews Scheduled" value={interviews.filter((i) => i.status === 'SCHEDULED').length} icon={CalendarClock} tone="warning" onClick={() => navigate('/recruitment/interviews')} />
        <StatCard label="Offers Extended" value={offers.length} icon={FileCheck} tone="success" onClick={() => navigate('/recruitment/offers')} />
      </div>

      <Card className="mt-4">
        <CardHeader title="Open Job Openings" action={<button onClick={() => navigate('/recruitment/jobs')} className="text-xs font-medium text-brand-600 hover:underline">View all</button>} />
        <CardBody className="p-0">
          <div className="divide-y divide-ink-100">
            {openJobs.slice(0, 6).map((job) => (
              <div key={job.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-800">{job.title}</p>
                  <p className="text-xs text-ink-500">{departments.find((d) => d.id === job.departmentId)?.name} · {applications.filter((a) => a.jobId === job.id).length} applicants</p>
                </div>
                <StatusBadge status={job.status} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
