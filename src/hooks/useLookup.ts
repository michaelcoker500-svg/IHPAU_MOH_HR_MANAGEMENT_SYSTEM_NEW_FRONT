import { useMemo } from 'react'
import { departments, positions, locations, employees } from '@/data/seed'

export function useLookups() {
  return useMemo(() => {
    const deptById = Object.fromEntries(departments.map((d) => [d.id, d]))
    const posById = Object.fromEntries(positions.map((p) => [p.id, p]))
    const locById = Object.fromEntries(locations.map((l) => [l.id, l]))
    const empById = Object.fromEntries(employees.map((e) => [e.id, e]))
    return { deptById, posById, locById, empById }
  }, [])
}

export function employeeName(id: string | null | undefined) {
  if (!id) return '—'
  const emp = employees.find((e) => e.id === id)
  return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown'
}
