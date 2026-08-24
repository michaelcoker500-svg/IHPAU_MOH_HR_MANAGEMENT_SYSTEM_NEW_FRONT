import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  key: string
  label: string
  count?: number
}

export function Tabs({ tabs, active, onChange, children }: { tabs: Tab[]; active: string; onChange: (key: string) => void; children?: ReactNode }) {
  const listRef = useRef<HTMLDivElement>(null)
  return (
    <div>
      <div ref={listRef} role="tablist" className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-ink-200 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              'relative shrink-0 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors',
              active === tab.key ? 'text-brand-700' : 'text-ink-500 hover:text-ink-800',
            )}
          >
            {tab.label}
            {tab.count !== undefined && <span className="ml-1.5 text-xs text-ink-400">{tab.count}</span>}
            {active === tab.key && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600" />}
          </button>
        ))}
      </div>
      {children && <div className="pt-4">{children}</div>}
    </div>
  )
}
