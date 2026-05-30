'use client'

import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

const INTEGRATIONS = [
  {
    id: 'int-1',
    name: 'GitHub',
    status: 'connected',
    lastSync: '5 minutes ago',
    health: 'healthy',
    config: 'nexops-org/repositories',
  },
  {
    id: 'int-2',
    name: 'Kubernetes',
    status: 'connected',
    lastSync: '1 minute ago',
    health: 'healthy',
    config: '4 clusters',
  },
  {
    id: 'int-3',
    name: 'Slack',
    status: 'connected',
    lastSync: '2 minutes ago',
    health: 'healthy',
    config: '#nexops-incidents',
  },
  {
    id: 'int-4',
    name: 'PagerDuty',
    status: 'connected',
    lastSync: '10 minutes ago',
    health: 'warning',
    config: '2 services',
  },
  {
    id: 'int-5',
    name: 'AWS',
    status: 'connected',
    lastSync: '3 minutes ago',
    health: 'healthy',
    config: '12 regions',
  },
  {
    id: 'int-6',
    name: 'Datadog',
    status: 'disconnected',
    lastSync: '3 days ago',
    health: 'error',
    config: 'Not configured',
  },
  {
    id: 'int-7',
    name: 'GitLab',
    status: 'connected',
    lastSync: '45 minutes ago',
    health: 'healthy',
    config: 'nexops-group',
  },
  {
    id: 'int-8',
    name: 'Jira',
    status: 'connected',
    lastSync: '1 hour ago',
    health: 'healthy',
    config: 'NexOps project',
  },
]

export default function IntegrationsPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader
            title="Integrations"
            description="Enterprise integration hub for GitHub, Kubernetes, cloud providers, monitoring, and collaboration platforms"
          />

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Connected</div>
              <div className="text-2xl font-bold text-success">7</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Disconnected</div>
              <div className="text-2xl font-bold text-destructive">1</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Health Issues</div>
              <div className="text-2xl font-bold text-warning">1</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Last Sync</div>
              <div className="text-2xl font-bold">1m ago</div>
            </Card>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-2 gap-6">
            {INTEGRATIONS.map((integration) => {
              const statusColor =
                integration.health === 'healthy'
                  ? 'bg-success/10 text-success'
                  : integration.health === 'warning'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-destructive/10 text-destructive'

              return (
                <Card key={integration.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg">{integration.name}</h3>
                    {integration.health === 'healthy' ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : integration.health === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-warning" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant="outline"
                        className={
                          integration.status === 'connected'
                            ? 'bg-success/10 text-success'
                            : 'bg-destructive/10 text-destructive'
                        }
                      >
                        {integration.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Configuration</span>
                      <span className="font-semibold">{integration.config}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync</span>
                      <span className="text-xs text-muted-foreground">{integration.lastSync}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Configure
                    </Button>
                    {integration.status === 'connected' && (
                      <Button size="sm" variant="ghost" className="flex-1">
                        Sync Now
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
