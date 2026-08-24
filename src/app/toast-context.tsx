import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const VARIANT_STYLES: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: 'border-success-500/30 bg-success-50 text-success-600' },
  error: { icon: XCircle, classes: 'border-danger-500/30 bg-danger-50 text-danger-600' },
  warning: { icon: AlertTriangle, classes: 'border-warning-500/30 bg-warning-50 text-warning-600' },
  info: { icon: Info, classes: 'border-info-500/30 bg-info-50 text-info-600' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => dismiss(id), 5000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((t) => {
          const style = VARIANT_STYLES[t.variant]
          const Icon = style.icon
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                'animate-in slide-in-from-bottom-2 fade-in flex items-start gap-3 rounded-xl border px-4 py-3 shadow-elevated backdrop-blur-sm',
                'bg-white/95',
                style.classes,
              )}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-ink-600">{t.description}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="shrink-0 rounded p-0.5 text-ink-400 hover:text-ink-700" aria-label="Dismiss notification">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
