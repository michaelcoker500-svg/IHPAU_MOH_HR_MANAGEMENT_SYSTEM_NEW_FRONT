import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/app/auth-context'
import { formatDateTime } from '@/lib/utils'

export default function ProfilePage() {
  const { user, organization } = useAuth()
  if (!user) return null

  return (
    <div>
      <PageHeader title="My Profile" />
      <Card>
        <CardBody className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:text-left">
          <Avatar name={user.avatarInitials} size="lg" />
          <div>
            <p className="text-lg font-semibold text-ink-900">{user.name}</p>
            <p className="text-sm text-ink-500">{user.email}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge tone="brand">{user.roleLabel}</Badge>
              <Badge tone="neutral">{organization.shortName}</Badge>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Account Details" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><p className="text-xs text-ink-500">Organization</p><p className="text-sm font-medium text-ink-800">{organization.name}</p></div>
          <div><p className="text-xs text-ink-500">Last Login</p><p className="text-sm font-medium text-ink-800">{formatDateTime(user.lastLogin)}</p></div>
          <div><p className="text-xs text-ink-500">Timezone</p><p className="text-sm font-medium text-ink-800">{organization.timezone}</p></div>
          <div><p className="text-xs text-ink-500">Account Status</p><Badge tone="success">Active</Badge></div>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Security" subtitle="Password and notification preferences" />
        <CardBody className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" disabled>Change Password</Button>
          <Button variant="outline" size="sm" disabled>Notification Preferences</Button>
        </CardBody>
      </Card>
    </div>
  )
}
