'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { AlertsList } from '@/components/alerts/alerts-list'
import { AlertDrawer } from '@/components/alerts/alert-drawer'
import { AlertFilters } from '@/components/alerts/alert-filters'
import { Card } from '@/components/ui/card'
import { mockAlerts } from '@/lib/mock-data'

// Transform mock alerts to page format
const transformAlerts = () => {
  return mockAlerts.map((alert) => {
    const severityMap: { [key: string]: 'critical' | 'high' | 'medium' | 'low' } = {
      'critical': 'critical',
      'warning': 'high',
      'info': 'low',
    };
    return {
      id: alert.id,
      title: alert.title,
      severity: severityMap[alert.severity] || 'medium',
      status: alert.status === 'active' ? 'firing' : 'resolved',
      cluster: 'prod-us-east-1',
      services: [alert.service],
      value: alert.current,
      threshold: alert.threshold,
      createdAt: new Date(alert.createdAt).toLocaleString(),
      duration: '5m',
      correlatedAlerts: Math.floor(Math.random() * 3),
      suggestedActions: [
        `Review ${alert.service} metrics`,
        `Check current load and trends`,
      ],
    };
  });
};

const ALERTS_DATA = transformAlerts();

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredAlerts = ALERTS_DATA.filter((alert) => {
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false
    if (statusFilter !== 'all' && alert.status !== statusFilter) return false
    return true
  })

  const selectedAlertData = ALERTS_DATA.find((a) => a.id === selectedAlert) as any
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
