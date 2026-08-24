import { NavLink, Outlet } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Overview', href: '/recruitment' },
  { label: 'Jobs', href: '/recruitment/jobs' },
  { label: 'Candidates', href: '/recruitment/candidates' },
  { label: 'Pipeline', href: '/recruitment/applications' },
  { label: 'Interviews', href: '/recruitment/interviews' },
  { label: 'Offers', href: '/recruitment/offers' },
]

export default function RecruitmentLayout() {
  return (
    <div>
      <PageHeader title="Recruitment" subtitle="Manage job openings, candidates, and the hiring pipeline" />
      <div className="scrollbar-thin mb-5 flex gap-1 overflow-x-auto border-b border-ink-200">
        {TABS.map((tab) => (
          <NavLink
            key={tab.href}
            to={tab.href}
            end={tab.href === '/recruitment'}
            className={({ isActive }) => cn('relative shrink-0 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium', isActive ? 'text-brand-700' : 'text-ink-500 hover:text-ink-800')}
          >
            {({ isActive }: any) => (
              <>
                {tab.label}
                {isActive && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600" />}
              </>
            )}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}
