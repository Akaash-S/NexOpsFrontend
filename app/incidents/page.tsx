'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { IncidentTabs } from '@/components/incidents/incident-tabs'
import { IncidentDrawer } from '@/components/incidents/incident-drawer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const INCIDENTS = [
  {
    id: 'inc-001',
    title: 'API Gateway Outage',
    severity: 'critical',
    status: 'open',
    startTime: '2 hours ago',
    duration: '2h 15m',
    lead: 'Sarah Chen',
    affectedServices: ['api-gateway', 'rate-limiter', 'auth-service'],
    affectedClusters: ['prod-us-east-1'],
    rootCause: 'Database connection pool exhaustion',
    impactedUsers: 5234,
    relatedDeployments: ['deploy-001'],
    relatedAlerts: 5,
    timeline: [
      { time: '14:32', event: 'Alert triggered: High API errors', status: 'info' },
      { time: '14:35', event: 'Investigation started', status: 'info' },
      { time: '14:42', event: 'Root cause identified', status: 'success' },
      { time: '14:55', event: 'Mitigation applied', status: 'success' },
    ],
    resolutionNotes: 'Increased database connection pool and optimized query performance',
  },
  {
    id: 'inc-002',
    title: 'Search Service Degradation',
    severity: 'high',
    status: 'investigating',
    startTime: '45 minutes ago',
    duration: '45m',
    lead: 'Marcus Johnson',
    affectedServices: ['search-service', 'elasticsearch'],
    affectedClusters: ['prod-eu-west-1'],
    rootCause: 'Under investigation',
    impactedUsers: 1234,
    relatedDeployments: ['deploy-002'],
    relatedAlerts: 3,
    timeline: [
      { time: '16:15', event: 'Performance degradation detected', status: 'warning' },
      { time: '16:18', event: 'Escalated to on-call', status: 'warning' },
    ],
    resolutionNotes: '',
  },
  {
    id: 'inc-003',
    title: 'Authentication Service Intermittent Failures',
    severity: 'medium',
    status: 'resolved',
    startTime: '5 days ago',
    duration: '3h 20m',
    lead: 'Elena Rodriguez',
    affectedServices: ['auth-service'],
    affectedClusters: ['prod-us-east-1', 'prod-eu-west-1'],
    rootCause: 'Third-party OAuth provider timeout',
    impactedUsers: 342,
    relatedDeployments: [],
    relatedAlerts: 2,
    timeline: [
      { time: '10:15', event: 'Errors detected in auth logs', status: 'warning' },
      { time: '10:22', event: 'Issue reproduced', status: 'warning' },
      { time: '11:32', event: 'Fallback mechanism activated', status: 'success' },
      { time: '13:35', event: 'Incident resolved', status: 'success' },
    ],
    resolutionNotes: 'Added timeout handling and fallback authentication method',
  },
]

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all')

  const filteredIncidents = INCIDENTS.filter(
    (inc) => statusFilter === 'all' || inc.status === statusFilter
  )

  const selectedIncidentData = INCIDENTS.find((i) => i.id === selectedIncident)
  const openCount = INCIDENTS.filter((i) => i.status === 'open' || i.status === 'investigating').length
  const criticalCount = INCIDENTS.filter((i) => i.severity === 'critical').length
  const avgMTTR = '18m'

  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader
            title="Incidents"
            description="Operational investigation center with timeline, root cause analysis, and incident intelligence"
          />

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Active Incidents</div>
              <div className="text-2xl font-bold text-warning">{openCount}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Critical</div>
              <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Avg MTTR</div>
              <div className="text-2xl font-bold">{avgMTTR}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total This Month</div>
              <div className="text-2xl font-bold">12</div>
            </Card>
          </div>

          {/* Incident Tabs */}
          <IncidentTabs
            incidents={filteredIncidents}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
            onStatusFilterChange={setStatusFilter}
          />
        </Section>
      </PageLayout>

      {/* Incident Drawer */}
      {selectedIncidentData && (
        <IncidentDrawer
          incident={selectedIncidentData}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </>
  )
}
