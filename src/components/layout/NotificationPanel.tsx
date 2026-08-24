import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { useAuth } from '@/app/auth-context'
import { notificationService } from '@/services'
import type { AppNotification } from '@/types'
import { timeAgo, cn } from '@/lib/utils'

const CATEGORY_DOT: Record<AppNotification['category'], string> = {
  HR: 'bg-brand-500', LEAVE: 'bg-info-500', ATTENDANCE: 'bg-accent-500',
  PERFORMANCE: 'bg-success-500', TRAINING: 'bg-warning-500', RECRUITMENT: 'bg-danger-500', SYSTEM: 'bg-ink-400',
}

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<AppNotification[]>([])

  useEffect(() => {
    if (user) notificationService.forEmployee(user.id).then(setItems)
  }, [user])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = document.getElementById('notification-panel')
      if (el && !el.contains(e.target as Node)) onClose()
    }
    if (open) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open, onClose])

  if (!open) return null

  const unreadCount = items.filter((n) => !n.read).length

  return (
    <div id="notification-panel" className="absolute right-0 top-full z-40 mt-2 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl border border-ink-200 bg-white shadow-elevated sm:w-96">
      <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
        <p className="text-sm font-semibold text-ink-900">Notifications {unreadCount > 0 && <span className="text-brand-600">({unreadCount})</span>}</p>
        <button
          onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          <CheckCheck size={13} /> Mark all read
        </button>
      </div>
      <div className="scrollbar-thin max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-400">You're all caught up.</p>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setItems((prev) => prev.map((it) => (it.id === n.id ? { ...it, read: true } : it)))
                if (n.link) navigate(n.link)
                onClose()
              }}
              className={cn('flex w-full items-start gap-3 border-b border-ink-50 px-4 py-3 text-left last:border-0 hover:bg-ink-50', !n.read && 'bg-brand-50/30')}
            >
              <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', n.read ? 'bg-transparent' : CATEGORY_DOT[n.category])} />
              <div className="min-w-0 flex-1">
                <p className={cn('text-sm', n.read ? 'font-normal text-ink-700' : 'font-medium text-ink-900')}>{n.title}</p>
                <p className="mt-0.5 truncate text-xs text-ink-500">{n.message}</p>
                <p className="mt-1 text-[11px] text-ink-400">{timeAgo(n.createdAt)}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export function NotificationBell() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (user) notificationService.forEmployee(user.id).then((items) => setUnread(items.filter((n) => !n.read).length))
  }, [user])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />}
      </button>
      <NotificationPanel open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
