'use client'

import { useState } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { ServiceCatalog } from '@/components/services/service-catalog'
import { ServiceDetailsDrawer } from '@/components/services/service-details-drawer'
import { ServiceFilters } from '@/components/services/service-filters'
import { SERVICES_DATA } from '@/lib/mock-data'

export default function ServicesPage() {
  const [services] = useState(SERVICES_DATA)
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
