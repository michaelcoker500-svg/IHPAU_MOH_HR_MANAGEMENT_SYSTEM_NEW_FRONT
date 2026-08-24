import { Link } from 'react-router-dom'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface Crumb {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const last = items[items.length - 1]
  const prev = items[items.length - 2]
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      {/* Mobile: back link to previous crumb only */}
      <div className="flex sm:hidden">
        {prev?.href ? (
          <Link to={prev.href} className="inline-flex items-center gap-1 text-sm font-medium text-ink-600">
            <ChevronLeft size={16} /> {last.label}
          </Link>
        ) : (
          <span className="text-sm font-medium text-ink-600">{last.label}</span>
        )}
      </div>
      {/* Desktop: full chain */}
      <ol className="hidden flex-wrap items-center gap-1.5 text-sm text-ink-500 sm:flex">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-ink-300" />}
            {item.href ? (
              <Link to={item.href} className="hover:text-ink-800">{item.label}</Link>
            ) : (
              <span className="font-medium text-ink-800">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
