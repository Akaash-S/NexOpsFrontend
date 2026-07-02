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

function ServicesPageContent() {
  const searchParams = useSearchParams()
  const isEmpty = searchParams?.get('empty') === 'true'
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<string | null>(
    searchParams?.get('selected') || null
  )

  useEffect(() => {
    const selected = searchParams?.get('selected')
    if (selected) {
      setSelectedService(selected)
    }
  }, [searchParams])

  useEffect(() => {
    if (isEmpty) {
      setLoading(false)
      return
    }

    async function loadServices() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const repos = await apiFetch('/repos')
        
        const mapped = repos.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          team: repo.owner || '@team-platform',
          health: Math.round(repo.healthScore || 100),
          status: (repo.status === 'passing' || repo.ciStatus === 'passing' || repo.status === 'success') ? 'healthy' : (repo.status === 'failing' || repo.ciStatus === 'failing' ? 'critical' : 'warning'),
          deployments: 14,
          dependencies: [],
          dependents: [],
          lastDeployed: repo.lastCommitAt ? new Date(repo.lastCommitAt).toLocaleDateString() : 'N/A',
          owner: repo.owner || '@team-platform',
          criticality: repo.name.includes('gateway') || repo.name.includes('auth') || repo.name.includes('payment') ? 'critical' : 'medium',
          changeFailureRate: 0,
          deploymentFrequency: 'daily',
          mttr: '15m',
          incidents30d: repo.issueCount || 0
        }))
        setServices(mapped)
      } catch (err) {
        console.error("Failed to load services:", err)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [isEmpty])

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'health-asc',
  })

  const filteredServices = services
    .filter((service) => {
      // Search
      const searchMatch = service.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        service.team.toLowerCase().includes(filters.search.toLowerCase());
      if (!searchMatch) return false;

      // Status Filter
      if (filters.status !== 'all' && service.status !== filters.status) return false;

      return true;
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

  const selectedServiceData = services.find((s) => s.id === selectedService) as any

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

        <ServiceFilters filters={filters} setFilters={setFilters} />

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

