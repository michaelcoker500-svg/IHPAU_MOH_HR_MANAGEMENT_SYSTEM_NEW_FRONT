import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardBody } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { PermissionGate } from '@/components/shared/PermissionGate'
import { useAuth } from '@/app/auth-context'
import { ORGANIZATION } from '@/app/auth-context'

export default function SettingsPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('general')

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'account', label: 'Account' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'organization', label: 'Organization' },
    { key: 'security', label: 'Security' },
    { key: 'appearance', label: 'Appearance' },
  ]

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your preferences and account configuration" />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      <Card className="mt-4">
        <CardBody>
          {tab === 'general' && <p className="text-sm text-ink-500">General preferences will appear here. This section is a placeholder — <Badge tone="warning">Coming Soon</Badge></p>}
          {tab === 'account' && <p className="text-sm text-ink-500">Signed in as {user?.email}. Account editing requires backend integration — <Badge tone="warning">Requires Backend Integration</Badge></p>}
          {tab === 'notifications' && <p className="text-sm text-ink-500">Notification delivery preferences — <Badge tone="warning">Coming Soon</Badge></p>}
          {tab === 'organization' && (
            <PermissionGate permission="admin.manage" fallback={<p className="text-sm text-ink-500">Only administrators can view organization settings.</p>}>
              <p className="text-sm text-ink-800">{ORGANIZATION.name}</p>
              <p className="text-sm text-ink-500">{ORGANIZATION.country} · {ORGANIZATION.timezone}</p>
            </PermissionGate>
          )}
          {tab === 'security' && <p className="text-sm text-ink-500">Password policy and session management — <Badge tone="warning">Requires Backend Integration</Badge></p>}
          {tab === 'appearance' && <p className="text-sm text-ink-500">Theme customization — <Badge tone="warning">Coming Soon</Badge></p>}
        </CardBody>
      </Card>
    </div>
  )
}
