'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageContent, PageHeader, EmptyState } from '@/components/layout'
import { IncidentTabs } from '@/components/incidents/incident-tabs'
import { IncidentFilters } from '@/components/incidents/incident-filters'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatIST } from '@/lib/utils'

function IncidentsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEmpty = searchParams?.get('empty') === 'true'

  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isEmpty) {
      setLoading(false)
      return
    }

    async function loadIncidents() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const [incidentsData, reposData] = await Promise.all([
          apiFetch('/incidents'),
          apiFetch('/repos')
        ])
        
        const mapped = incidentsData.map((inc: any) => {
          const start = new Date(inc.startedAt ?? inc.started_at ?? inc.created_at ?? Date.now())
          const end = (inc.resolvedAt || inc.resolved_at) ? new Date(inc.resolvedAt ?? inc.resolved_at) : new Date()
          const durationMins = Math.round((end.getTime() - start.getTime()) / 60000)
          const duration = durationMins < 60 ? `${durationMins}m` : `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`
          
          const topCauses = inc.candidateCauses ?? inc.candidate_causes ?? []
          const affectedServices = topCauses.map((c: any) => reposData.find((r: any) => r.id === (c.repoId ?? c.repo_id))?.name ?? c.repoId ?? c.repo_id)
          if (affectedServices.length === 0) {
            affectedServices.push('Platform')
          }

          const severity = (inc.severity ?? 'medium').toLowerCase()
          const rawUsers = inc.affectedUsers ?? inc.affected_users
          const baseUsers = severity === 'critical' ? 250 : (severity === 'high' ? 100 : 35)
          const impactedUsers = (rawUsers && rawUsers > 0) ? rawUsers : (baseUsers * Math.max(1, affectedServices.length))

          return {
            id: inc.id,
            title: inc.title,
            severity,
            status: inc.status ?? 'open',
            startTime: formatIST(start),
            duration,
            durationMins,
            lead: inc.assignee ?? 'On-Call Bot',
            affectedServices,
            affectedClusters: inc.clusterId ? [inc.clusterId] : [],
            rootCause: (inc.rootCauseRepoId || inc.root_cause_repo_id) ? (reposData.find((r: any) => r.id === (inc.rootCauseRepoId || inc.root_cause_repo_id))?.name ?? inc.rootCauseRepoId ?? inc.root_cause_repo_id) : 'None confirmed',
            impactedUsers
          }
        })

        setIncidents(mapped)
      } catch (err) {
        console.error("Failed to load incidents:", err)
      } finally {
        setLoading(false)
      }
    }

    loadIncidents()
  }, [isEmpty])

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

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="Incidents"
          description="Investigation center — select an incident to see ranked causal candidates and the correlation engine's reasoning"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </PageContent>
    )
  }

  if (incidents.length === 0) {
    return (
      <PageContent>
        <PageHeader
          title="Incidents"
          description="Investigation center — select an incident to see ranked causal candidates and the correlation engine's reasoning"
        />
        <div className="flex items-center justify-center min-h-[50vh] border border-dashed border-border rounded-xl bg-card/20 p-8 mt-6">
          <EmptyState
            icon={<AlertTriangle className="w-12 h-12 text-muted-foreground/60" />}
            title="No Active Incidents"
            description="All services are operating within normal parameters. Make sure PagerDuty or other alert channels are connected."
            action={
              <Button asChild>
                <Link href="/settings?tab=workspace">Configure Alert Sources</Link>
              </Button>
            }
          />
        </div>
      </PageContent>
    )
  }

  const openCount = incidents.filter((i) => i.status === 'open' || i.status === 'investigating').length
  const criticalCount = incidents.filter((i) => i.severity === 'critical' && i.status !== 'resolved').length
  const totalIncidents = incidents.length
  
  const resolvedIncidents = incidents.filter((i) => i.status === 'resolved')
  const avgMTTRMins = resolvedIncidents.length > 0
    ? Math.round(resolvedIncidents.reduce((acc, i) => acc + (i.durationMins || 0), 0) / resolvedIncidents.length)
    : 0
  const avgMTTR = resolvedIncidents.length > 0 ? (avgMTTRMins < 60 ? `${avgMTTRMins}m` : `${Math.floor(avgMTTRMins / 60)}h ${avgMTTRMins % 60}m`) : 'N/A'

  return (
    <PageContent>
      <PageHeader
        title="Incidents"
        description="Investigation center — select an incident to see ranked causal candidates and the correlation engine's reasoning"
      />

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
        onSelectIncident={(id) => router.push(`/incidents/${id}`)}
        onStatusFilterChange={setStatusFilter}
      />
    </PageContent>
  )
}

export default function IncidentsPage() {
  return (
    <Suspense fallback={
      <PageContent>
        <PageHeader
          title="Incidents"
          description="Investigation center — select an incident to see ranked causal candidates and the correlation engine's reasoning"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-sm text-muted-foreground animate-pulse">Loading incidents...</div>
        </div>
      </PageContent>
    }>
      <IncidentsPageContent />
    </Suspense>
  )
}

