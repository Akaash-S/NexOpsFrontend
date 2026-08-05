'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageContent, PageHeader, EmptyState } from '@/components/layout'
import { ServiceCatalog } from '@/components/services/service-catalog'
import { ServiceDetailsDrawer } from '@/components/services/service-details-drawer'
import { ServiceFilters } from '@/components/services/service-filters'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Network, Loader2 } from 'lucide-react'
import { formatISTShort } from '@/lib/utils'

function ServicesPageContent() {
  const searchParams = useSearchParams()
  const isEmpty = searchParams?.get('empty') === 'true'
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<string | null>(
    searchParams?.get('selected') || searchParams?.get('id') || null
  )

  useEffect(() => {
    const selected = searchParams?.get('selected') || searchParams?.get('id')
    if (selected) {
      setSelectedService(selected)
    }
  }, [searchParams])

  async function loadServices() {
    try {
      const { apiFetch } = await import('@/lib/api-client')
      const [repos, topology, deployments, incidents] = await Promise.all([
        apiFetch('/repos'),
        apiFetch('/dependencies/topology'),
        apiFetch('/deployments'),
        apiFetch('/incidents')
      ]) as [any[], any, any[], any[]]

      const activeIncidents = (incidents || []).filter((inc: any) => inc.status !== 'resolved')
      const nowMs = Date.now()
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
      
      const mapped = repos.map((repo: any) => {
        // Find dependencies (upstream) and dependents (downstream)
        const repoDepEdges = (topology?.edges || []).filter((e: any) => e.source === repo.id)
        const repoDeps = repoDepEdges.map((e: any) => {
          const targetNode = topology?.nodes?.find((n: any) => n.id === e.target)
          return targetNode?.name || e.target
        })
        const repoDepIds = repoDepEdges.map((e: any) => e.target)

        const repoDependentEdges = (topology?.edges || []).filter((e: any) => e.target === repo.id)
        const repoDependents = repoDependentEdges.map((e: any) => {
          const sourceNode = topology?.nodes?.find((n: any) => n.id === e.source)
          return sourceNode?.name || e.source
        })

        // Filter deployments for this repo
        const repoDeploys = (deployments || []).filter((d: any) => d.repo_id === repo.id)
        const deploymentsCount = repoDeploys.length
        
        let lastDeployedStr = 'N/A'
        if (repoDeploys.length > 0) {
          const sortedDeploys = [...repoDeploys].sort((a: any, b: any) => 
            new Date(b.deployed_at || b.created_at).getTime() - new Date(a.deployed_at || a.created_at).getTime()
          )
          lastDeployedStr = formatISTShort(sortedDeploys[0].deployed_at || sortedDeploys[0].created_at)
        } else if (repo.lastCommitAt) {
          lastDeployedStr = formatISTShort(repo.lastCommitAt)
        }

        const failedDeploys = repoDeploys.filter((d: any) => d.status === 'failed' || d.status === 'rolled_back' || d.status === 'failure' || d.status === 'error').length
        const cfr = deploymentsCount > 0 ? Math.round((failedDeploys / deploymentsCount) * 100) : 0

        // Calculate Real PagerDuty/NexOps Incidents for this repo
        const repoIncidents = (incidents || []).filter((inc: any) => {
          const isDirect = inc.root_cause_repo_id === repo.id || inc.repo_id === repo.id
          const causes = inc.candidateCauses || inc.candidate_causes || []
          const isCandidate = causes.some((c: any) => c.repo_id === repo.id)
          return isDirect || isCandidate
        })

        const incidents30dCount = repoIncidents.filter((inc: any) => {
          const createdTime = new Date(inc.created_at).getTime()
          return (nowMs - createdTime) <= thirtyDaysMs
        }).length

        // Active Incidents Impact
        const directActiveIncident = activeIncidents.find((inc: any) => 
          inc.root_cause_repo_id === repo.id || inc.repo_id === repo.id
        )

        const candidateActiveIncident = activeIncidents.find((inc: any) => {
          const causes = inc.candidateCauses || inc.candidate_causes || []
          return causes.some((c: any) => c.repo_id === repo.id && c.score >= 40)
        })

        const upstreamActiveIncident = activeIncidents.find((inc: any) => 
          repoDepIds.includes(inc.root_cause_repo_id) || repoDepIds.includes(inc.repo_id)
        )

        // Health & Status Calculation
        // Source of truth: actual DB health_score (backend sends snake_case since by_alias is not set globally)
        const storedHealth = Math.round(repo.health_score ?? repo.healthScore ?? 100)

        let health = storedHealth
        let status: 'healthy' | 'warning' | 'critical' | 'disconnected' = 'healthy'

        if (repo.status === 'disconnected') {
          status = 'disconnected'
          health = 0
        } else if (directActiveIncident) {
          status = 'critical'
          health = Math.min(storedHealth, directActiveIncident.severity === 'critical' || directActiveIncident.severity === 'error' ? 25 : 35)
        } else if (candidateActiveIncident) {
          status = 'warning'
          health = Math.min(storedHealth, 55)
        } else if (upstreamActiveIncident) {
          status = 'warning'
          health = Math.min(storedHealth, 68)
        } else {
          // No active incident — use stored health as-is and derive status from it
          status = storedHealth >= 80 ? 'healthy' : storedHealth >= 50 ? 'warning' : 'critical'
          health = storedHealth
        }

        // Calculate 100% real MTTR strictly from resolved incidents in the database
        const resolvedRepoIncidents = repoIncidents.filter((inc: any) => inc.status === 'resolved' || inc.resolved_at)
        let mttrDisplay = 'N/A'

        if (resolvedRepoIncidents.length > 0) {
          const totalDurationMs = resolvedRepoIncidents.reduce((acc: number, inc: any) => {
            const start = new Date(inc.created_at).getTime()
            const end = new Date(inc.resolved_at || inc.updated_at || nowMs).getTime()
            return acc + Math.max(60000, end - start)
          }, 0)
          const avgMinutes = Math.round(totalDurationMs / (resolvedRepoIncidents.length * 60000))
          if (avgMinutes >= 60) {
            const hours = (avgMinutes / 60).toFixed(1)
            mttrDisplay = `${hours}h`
          } else {
            mttrDisplay = `${Math.max(1, avgMinutes)}m`
          }
        }

        return {
          id: repo.id,
          name: repo.name,
          team: repo.owner || '@team-platform',
          health: health,
          status: status,
          deployments: deploymentsCount,
          rawDeployments: repoDeploys,
          dependencies: repoDeps,
          dependents: repoDependents,
          lastDeployed: lastDeployedStr,
          owner: repo.owner || '@team-platform',
          criticality: repo.name.includes('gateway') || repo.name.includes('auth') || repo.name.includes('payment') || repo.name.includes('protype') ? 'critical' : 'medium',
          changeFailureRate: cfr,
          deploymentFrequency: deploymentsCount > 10 ? 'multiple-daily' : (deploymentsCount > 3 ? 'daily' : (deploymentsCount > 0 ? 'weekly' : 'none')),
          mttr: mttrDisplay,
          incidents30d: incidents30dCount,
          activeIncident: directActiveIncident || candidateActiveIncident || upstreamActiveIncident || null
        }
      })
      setServices(mapped)
    } catch (err) {
      console.error("Failed to load services:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isEmpty) {
      setLoading(false)
      return
    }

    loadServices()

    const handleRefresh = () => {
      loadServices()
    }

    window.addEventListener('nexops:incident.created', handleRefresh)
    window.addEventListener('nexops:incident.updated', handleRefresh)
    window.addEventListener('nexops:incident.resolved', handleRefresh)

    return () => {
      window.removeEventListener('nexops:incident.created', handleRefresh)
      window.removeEventListener('nexops:incident.updated', handleRefresh)
      window.removeEventListener('nexops:incident.resolved', handleRefresh)
    }
  }, [isEmpty])

  const [filters, setFilters] = useState({
    search: '',
    status: 'active',
    sortBy: 'health-asc',
  })

  const activeServicesCount = services.filter((s) => s.status !== 'disconnected').length
  const disconnectedServicesCount = services.filter((s) => s.status === 'disconnected').length

  const filteredServices = services
    .filter((service) => {
      // Search Filter
      const searchMatch =
        service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        service.team.toLowerCase().includes(filters.search.toLowerCase())
      if (!searchMatch) return false

      // Status Filter
      if (filters.status === 'active') {
        if (service.status === 'disconnected') return false
      } else if (filters.status !== 'all' && service.status !== filters.status) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'health-asc':
          return a.health - b.health
        case 'health-desc':
          return b.health - a.health
        case 'incidents-desc':
          return b.incidents30d - a.incidents30d
        case 'deployments-desc':
          return b.deployments - a.deployments
        case 'name-asc':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const selectedServiceData = selectedService
    ? (services.find((s) => 
        s.id === selectedService || 
        s.name === selectedService || 
        (s.id && s.id.toLowerCase() === selectedService.toLowerCase()) ||
        (s.name && s.name.toLowerCase() === selectedService.toLowerCase())
      ) as any)
    : null

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="Services"
          description="Service catalog — read-only, derived from connected source-of-truth systems"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </PageContent>
    )
  }

  if (services.length === 0) {
    return (
      <PageContent>
        <PageHeader
          title="Services"
          description="Service catalog — read-only, derived from connected source-of-truth systems"
        />
        <div className="flex items-center justify-center min-h-[50vh] border border-dashed border-border rounded-xl bg-card/20 p-8 mt-6">
          <EmptyState
            icon={<Network className="w-12 h-12 text-muted-foreground/60" />}
            title="No Services Monitored"
            description="Connect a repository or workspace to start tracking services, health, and deployments automatically."
            action={
              <Button asChild>
                <Link href="/settings?tab=workspace">Connect GitHub</Link>
              </Button>
            }
          />
        </div>
      </PageContent>
    )
  }

  return (
    <>
      <PageContent>
        <PageHeader
          title="Services"
          description="Service catalog — read-only, derived from connected source-of-truth systems"
        />

        <ServiceFilters
          filters={filters}
          setFilters={setFilters}
          activeCount={activeServicesCount}
          disconnectedCount={disconnectedServicesCount}
        />

        {/* Service Catalog */}
        <div className="mt-8">
          <ServiceCatalog
            services={filteredServices}
            selectedService={selectedService}
            onSelectService={setSelectedService}
          />
        </div>
      </PageContent>

      {/* Service Details Drawer */}
      {selectedServiceData && (
        <ServiceDetailsDrawer
          service={selectedServiceData}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <PageContent>
        <PageHeader
          title="Services"
          description="Service catalog — read-only, derived from connected source-of-truth systems"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-sm text-muted-foreground animate-pulse">Loading services...</div>
        </div>
      </PageContent>
    }>
      <ServicesPageContent />
    </Suspense>
  )
}

