'use client'

import { useState } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { IncidentTabs } from '@/components/incidents/incident-tabs'
import { IncidentDrawer } from '@/components/incidents/incident-drawer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockIncidents } from '@/lib/mock-data'

// Transform mock incidents to page format
const transformIncidents = () => {
  return mockIncidents.map((inc) => ({
    id: inc.id,
    title: inc.title,
    severity: (inc.severity === 'low' ? 'medium' : inc.severity) as 'critical' | 'high' | 'medium',
    status: (inc.status === 'investigating' ? 'open' : inc.status === 'monitoring' ? 'investigating' : 'resolved') as 'resolved' | 'open' | 'investigating',
    startTime: new Date(inc.startedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    duration: '45m',
    lead: inc.assignee,
    affectedServices: [inc.service],
    affectedClusters: ['prod-us-east-1'],
    rootCause: 'Investigation in progress',
    impactedUsers: inc.affectedUsers,
    relatedDeployments: [],
    relatedAlerts: Math.floor(Math.random() * 5) + 1,
    timeline: inc.timeline.map((event) => ({
      time: new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      event: event.action,
      status: 'info' as const,
    })),
    resolutionNotes: inc.description,
  }));
};

const INCIDENTS = transformIncidents();

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all')

  const filteredIncidents = INCIDENTS.filter(
    (inc) => statusFilter === 'all' || inc.status === statusFilter
  )

  const selectedIncidentData = INCIDENTS.find((i) => i.id === selectedIncident) as any
  const openCount = INCIDENTS.filter((i) => i.status === 'open' || i.status === 'investigating').length
  const criticalCount = INCIDENTS.filter((i) => i.severity === 'critical').length
  const totalIncidents = INCIDENTS.length
  const avgMTTR = '18m'

  return (
    <>
      
      <>
        <PageContent>
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
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{totalIncidents}</div>
            </Card>
          </div>

          {/* Incident Tabs */}
          <IncidentTabs
            incidents={filteredIncidents}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
            onStatusFilterChange={setStatusFilter}
          />
        </PageContent>
      </>

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
