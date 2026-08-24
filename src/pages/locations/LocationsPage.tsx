import { MapPin } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { locations, employees } from '@/data/seed'

export default function LocationsPage() {
  return (
    <div>
      <PageHeader title="Locations" subtitle="IHPAU office locations across Sierra Leone" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc) => (
          <Card key={loc.id}>
            <CardBody>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <MapPin size={18} />
              </div>
              <p className="text-sm font-semibold text-ink-900">{loc.name}</p>
              <p className="mt-1 text-sm text-ink-500">{loc.address}</p>
              <p className="text-sm text-ink-500">{loc.city}, {loc.country}</p>
              <p className="mt-3 text-xs font-medium text-brand-600">{employees.filter((e) => e.locationId === loc.id).length} employees based here</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  )
}
