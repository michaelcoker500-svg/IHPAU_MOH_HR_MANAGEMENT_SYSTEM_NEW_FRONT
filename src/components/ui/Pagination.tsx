import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export function Pagination({ page, totalPages, total, pageSize, onPageChange }: { page: number; totalPages: number; total: number; pageSize: number; onPageChange: (p: number) => void }) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-ink-100 px-4 py-3 sm:flex-row sm:px-5">
      <p className="text-xs text-ink-500">
        Showing <span className="font-medium text-ink-700">{start}-{end}</span> of <span className="font-medium text-ink-700">{total}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft size={14} />
        </Button>
        <span className="px-2 text-xs font-medium text-ink-600">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}
