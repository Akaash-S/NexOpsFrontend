'use client'

import { useState, useEffect } from 'react'
import { PageContent, PageHeader, Grid, MetricCard, EmptyState } from '@/components/layout'
import { HealthOverview } from '@/components/dashboard/health-overview'
import { ActiveIncidents } from '@/components/dashboard/active-incidents'
import { RecentChanges } from '@/components/dashboard/recent-changes'
import { Recommendations } from '@/components/dashboard/recommendations'
import { ImpactMap } from '@/components/dashboard/impact-map'
import { Activity, AlertTriangle, GitCommitHorizontal, Search } from 'lucide-react'
import { CardSkeleton } from '@/components/loading-state'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const [incidents, setIncidents] = useState<any[]>([])
  const [deployments, setDeployments] = useState<any[]>([])

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const [summaryData, incidentsData, deploymentsData] = await Promise.all([
          apiFetch('/analytics/dashboard/summary'),
          apiFetch('/incidents'),
          apiFetch('/deployments'),
        ])
        setSummary(summaryData)
        setIncidents(incidentsData)
        setDeployments(deploymentsData)
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  // Listen for realtime incident creation
  useEffect(() => {
    const handleIncidentCreated = (e: Event) => {
      const customEvent = e as CustomEvent
      const detail = customEvent.detail
      if (detail && detail.incident) {
        const newIncident = {
          ...detail.incident,
          candidateCauses: detail.candidate_causes || []
        }
        setIncidents((prev) => {
          if (prev.some((i) => i.id === newIncident.id)) return prev
          return [newIncident, ...prev]
        })
      }
    }

    window.addEventListener('nexops:incident.created', handleIncidentCreated)
    return () => {
      window.removeEventListener('nexops:incident.created', handleIncidentCreated)
    }
  }, [])

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="Dashboard"
          description="Correlation engine — active incidents with ranked causal candidates, change blast radius, and dependency topology"
        />
        <Grid columns={4} className="mb-6">
          <CardSkeleton className="h-32" />
          <CardSkeleton className="h-32" />
          <CardSkeleton className="h-32" />
          <CardSkeleton className="h-32" />
        </Grid>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <CardSkeleton className="h-96" />
            <CardSkeleton className="h-64" />
          </div>
          <div className="space-y-6">
            <CardSkeleton className="h-96" />
            <CardSkeleton className="h-64" />
          </div>
        </div>
      </PageContent>
    )
  }

  // Active Incidents
  const activeIncidents = incidents.filter(i => i.status !== 'resolved')
  const activeCount = activeIncidents.length
  const investigatingCount = activeIncidents.filter(i => i.status === 'investigating').length

  // Unconfirmed Candidates
  let unconfirmedCandidatesCount = 0
  activeIncidents.forEach(incident => {
    const causes = incident.candidateCauses || incident.candidate_causes || []
    causes.forEach((cause: any) => {
      if (cause.confirmed === null) {
        unconfirmedCandidatesCount++
      }
    })
  })

  // Changes in last 24h
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentDeploys = deployments.filter(d => new Date(d.deployedAt || d.created_at) >= last24h)
  const recentCount = recentDeploys.length
  const failedDeploysCount = recentDeploys.filter(d => d.status === 'failed').length

  // Services Healthy (healthScore >= 90)
  const repos = summary?.repos || []
  const totalServices = repos.length
  const healthyServices = repos.filter((r: any) => (r.healthScore || r.health_score || 0) >= 90).length
  const degradedOrCritical = totalServices - healthyServices

  return (
    <PageContent>
      <PageHeader
        title="Dashboard"
        description="Correlation engine — active incidents with ranked causal candidates, change blast radius, and dependency topology"
      />

      {/* Top-level signal cards */}
      <Grid columns={4} className="mb-6">
        <MetricCard
          label="Active Incidents"
          value={activeCount}
          change={`${investigatingCount} investigating`}
          trend={activeCount > 0 ? "down" : "up"}
          icon={<AlertTriangle className="w-6 h-6 text-destructive" />}
          href="/incidents"
        />
        <MetricCard
          label="Unconfirmed Candidates"
          value={unconfirmedCandidatesCount}
          change={unconfirmedCandidatesCount > 0 ? "Awaiting human review" : "All reviewed"}
          icon={<Search className="w-6 h-6 text-warning" />}
          href="/incidents"
        />
        <MetricCard
          label="Changes (24h)"
          value={recentCount}
          change={`${failedDeploysCount} failed`}
          icon={<GitCommitHorizontal className="w-6 h-6 text-primary" />}
          href="/recent-changes"
        />
        <MetricCard
          label="Services Healthy"
          value={`${healthyServices}/${totalServices}`}
          change={`${degradedOrCritical} degraded or critical`}
          trend={degradedOrCritical > 0 ? "down" : "up"}
          icon={<Activity className="w-6 h-6 text-success" />}
          href="/services"
        />
      </Grid>

      {/* Primary layout: Incidents + Causal Review (2/3) + Dependency Graph (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: the two core correlation widgets — primary real estate */}
        <div className="lg:col-span-2 space-y-6">
          <ActiveIncidents />
          <Recommendations />
        </div>

        {/* Right: dependency graph + recent changes preview */}
        <div className="space-y-6">
          <ImpactMap />
          <RecentChanges />
        </div>
      </div>

      {/* Bottom: Health Overview — deprioritized, reduced visual weight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthOverview />
      </div>
    </PageContent>
  )
}
