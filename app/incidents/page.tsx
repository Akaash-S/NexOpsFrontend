'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { IncidentTabs } from '@/components/incidents/incident-tabs'
import { IncidentDrawer } from '@/components/incidents/incident-drawer'
import { IncidentFilters } from '@/components/incidents/incident-filters'
import { DeclareIncidentDrawer } from '@/components/incidents/declare-incident-drawer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import { INCIDENTS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function IncidentsPage() {
  const { setDeclareIncidentOpen } = useAppState()
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  
  const [incidents, setIncidents] = useState<any[]>(INCIDENTS_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    severity: 'all',
    sortBy: 'date-desc',
  })
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('open')

  // Filter and Sort Logic
  const filteredAndSortedIncidents = useMemo(() => {
    return incidents
      .filter((inc) => {
        const matchesSearch =
          inc.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          inc.affectedServices.some((s: string) => s.toLowerCase().includes(filters.search.toLowerCase())) ||
          inc.id.toLowerCase().includes(filters.search.toLowerCase())
        const matchesSeverity = filters.severity === 'all' || inc.severity === filters.severity
        const matchesStatus = statusFilter === 'all' || inc.status === statusFilter
        return matchesSearch && matchesSeverity && matchesStatus
      })
      .sort((a, b) => {
        const severityWeight: Record<string, number> = { critical: 3, high: 2, medium: 1 }
        switch (filters.sortBy) {
          case 'severity-desc':
            return severityWeight[b.severity] - severityWeight[a.severity]
          case 'severity-asc':
            return severityWeight[a.severity] - severityWeight[b.severity]
          case 'duration-desc':
            return b.durationMins - a.durationMins
          case 'duration-asc':
            return a.durationMins - b.durationMins
          case 'impact-desc':
            return b.impactedUsers - a.impactedUsers
          case 'impact-asc':
            return a.impactedUsers - b.impactedUsers
          case 'date-desc':
            return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          case 'date-asc':
            return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          default:
            return 0
        }
      })
  }, [incidents, filters, statusFilter])

  const selectedIncidentData = incidents.find((i) => i.id === selectedIncident) as any
  const openCount = incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length
  const criticalCount = incidents.filter((i) => i.severity === 'critical' && i.status !== 'resolved').length
  const totalIncidents = incidents.length
  const avgMTTR = '18m'

  const handleIncidentDeclared = (newIncidentMock: any) => {
    setIncidents([newIncidentMock, ...incidents])
  }

  return (
    <>
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Incidents"
            description="Operational investigation center with timeline, root cause analysis, and incident intelligence"
          />
          <Button onClick={() => setDeclareIncidentOpen(true)} variant="destructive" className="gap-2">
            <ShieldAlert className="w-4 h-4" />
            Declare Incident
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active Incidents</div>
            <div className="text-2xl font-bold text-warning">{openCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Active Critical</div>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg MTTR</div>
            <div className="text-2xl font-bold">{avgMTTR}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Reports</div>
            <div className="text-2xl font-bold">{totalIncidents}</div>
          </Card>
        </div>

        {/* Filters */}
        <IncidentFilters filters={filters} setFilters={setFilters} />

        {/* Incident Tabs */}
        <IncidentTabs
          incidents={filteredAndSortedIncidents}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
          onStatusFilterChange={setStatusFilter}
        />
      </PageContent>

      {/* Incident Drawer */}
      {selectedIncidentData && (
        <IncidentDrawer
          incident={selectedIncidentData}
          onClose={() => setSelectedIncident(null)}
        />
      )}

      {/* Declare Incident Wizard */}
      <DeclareIncidentDrawer onSuccess={handleIncidentDeclared} />
    </>
  )
}
