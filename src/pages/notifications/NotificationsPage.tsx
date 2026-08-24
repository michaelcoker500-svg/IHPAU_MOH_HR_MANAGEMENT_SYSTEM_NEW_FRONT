import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCheck } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/app/auth-context'
import { notificationService } from '@/services'
import type { AppNotification } from '@/types'
import { timeAgo, cn } from '@/lib/utils'

const CATEGORIES = ['All', 'HR', 'LEAVE', 'ATTENDANCE', 'PERFORMANCE', 'TRAINING', 'RECRUITMENT', 'SYSTEM']

export default function NotificationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<AppNotification[]>([])
  const [tab, setTab] = useState('All')

  useEffect(() => {
    if (user) notificationService.forEmployee(user.id).then(setItems)
  }, [user])

  const filtered = tab === 'All' ? items : items.filter((n) => n.category === tab)

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Stay up to date with HR activity"
        actions={<Button variant="outline" size="sm" onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}><CheckCheck size={15} /> Mark all read</Button>}
      />
      <Tabs tabs={CATEGORIES.map((c) => ({ key: c, label: c === 'All' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase() }))} active={tab} onChange={setTab} />
      <Card className="mt-4">
        <CardBody className="p-0">
          {filtered.length === 0 ? (
            <EmptyState title="No notifications" description="You're all caught up." />
          ) : (
            <div className="divide-y divide-ink-100">
              {filtered.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setItems((prev) => prev.map((it) => (it.id === n.id ? { ...it, read: true } : it)))
                    if (n.link) navigate(n.link)
                  }}
                  className={cn('flex w-full items-start gap-3 px-5 py-3.5 text-left hover:bg-ink-50', !n.read && 'bg-brand-50/30')}
                >
                  <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-brand-500')} />
                  <div className="min-w-0 flex-1">
                    <p className={cn('text-sm', n.read ? 'text-ink-700' : 'font-medium text-ink-900')}>{n.title}</p>
                    <p className="mt-0.5 text-sm text-ink-500">{n.message}</p>
                    <p className="mt-1 text-xs text-ink-400">{timeAgo(n.createdAt)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
