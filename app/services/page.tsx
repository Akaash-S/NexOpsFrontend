'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageContent, PageHeader, EmptyState } from '@/components/layout'
import { ServiceCatalog } from '@/components/services/service-catalog'
import { ServiceDetailsDrawer } from '@/components/services/service-details-drawer'
import { ServiceFilters } from '@/components/services/service-filters'
import { SERVICES_DATA } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Network } from 'lucide-react'

function ServicesPageContent() {
  const searchParams = useSearchParams()
  const isEmpty = searchParams?.get('empty') === 'true'
  const [services] = useState(() => isEmpty ? [] : SERVICES_DATA)
  const [selectedService, setSelectedService] = useState<string | null>(null)

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

