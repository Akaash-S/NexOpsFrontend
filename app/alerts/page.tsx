'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { AlertsList } from '@/components/alerts/alerts-list'
import { AlertDrawer } from '@/components/alerts/alert-drawer'
import { AlertFilters } from '@/components/alerts/alert-filters'
import { Card } from '@/components/ui/card'

const ALERTS_DATA = [
  {
    id: 'alert-001',
    title: 'High CPU usage on API Gateway',
    severity: 'critical',
    status: 'firing',
    cluster: 'prod-us-east-1',
    services: ['api-gateway', 'rate-limiter'],
    value: '94%',
    threshold: '80%',
    createdAt: '5 minutes ago',
    duration: '5m',
    correlatedAlerts: 2,
    suggestedActions: ['Scale up API Gateway', 'Check for runaway processes'],
  },
  {
    id: 'alert-002',
    title: 'Database connection pool exhausted',
    severity: 'high',
    status: 'firing',
    cluster: 'prod-us-east-1',
    services: ['database', 'api-gateway', 'search-service'],
    value: '98%',
    threshold: '90%',
    createdAt: '12 minutes ago',
    duration: '12m',
    correlatedAlerts: 3,
    suggestedActions: ['Increase pool size', 'Review long-running queries'],
  },
  {
    id: 'alert-003',
    title: 'Error rate spike on Search Service',
    severity: 'high',
    status: 'firing',
    cluster: 'prod-eu-west-1',
    services: ['search-service', 'elasticsearch'],
    value: '8.5%',
    threshold: '2%',
    createdAt: '8 minutes ago',
    duration: '8m',
    correlatedAlerts: 1,
    suggestedActions: ['Check Elasticsearch health', 'Review recent deployments'],
  },
  {
    id: 'alert-004',
    title: 'Memory leak detected',
    severity: 'medium',
    status: 'firing',
    cluster: 'staging-us-west-2',
    services: ['notification-service'],
    value: '92%',
    threshold: '85%',
    createdAt: '1 hour ago',
    duration: '1h',
    correlatedAlerts: 0,
    suggestedActions: ['Investigate memory usage trends', 'Review recent code changes'],
  },
  {
    id: 'alert-005',
    title: 'Disk space low',
    severity: 'medium',
    status: 'resolved',
    cluster: 'dev-multi-region',
    services: ['data-warehouse'],
    value: '78%',
    threshold: '80%',
    createdAt: '2 hours ago',
    duration: '30m',
    correlatedAlerts: 0,
    suggestedActions: ['Clean up old logs'],
  },
]

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredAlerts = ALERTS_DATA.filter((alert) => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false
    return true
  })

  const selectedAlertData = ALERTS_DATA.find((a) => a.id === selectedAlert)
  const firingCount = ALERTS_DATA.filter((a) => a.status === 'firing').length
  const criticalCount = ALERTS_DATA.filter((a) => a.severity === 'critical' && a.status === 'firing').length

  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader
            title="Alerts"
            description="Operational signals with correlation, impact analysis, and intelligent routing"
          />

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active Alerts</div>
              <div className="text-2xl font-bold text-warning">{firingCount}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Critical</div>
              <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Correlated Clusters</div>
              <div className="text-2xl font-bold">3</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">MTTR (avg)</div>
              <div className="text-2xl font-bold">18m</div>
            </Card>
          </div>

          {/* Filters */}
          <AlertFilters
            severityFilter={severityFilter}
            statusFilter={statusFilter}
            onSeverityChange={setSeverityFilter}
            onStatusChange={setStatusFilter}
          />

          {/* Alerts List */}
          <AlertsList
            alerts={filteredAlerts}
            selectedAlert={selectedAlert}
            onSelectAlert={setSelectedAlert}
          />
        </Section>
      </PageLayout>

      {/* Alert Drawer */}
      {selectedAlertData && (
        <AlertDrawer
          alert={selectedAlertData}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </>
  )
}
