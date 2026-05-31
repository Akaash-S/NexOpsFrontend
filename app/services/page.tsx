'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { ServiceCatalog } from '@/components/services/service-catalog'
import { ServiceDetailsDrawer } from '@/components/services/service-details-drawer'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { mockServices } from '@/lib/mock-data'

// Transform mock services to the format expected by ServiceCatalog
const SERVICES_DATA = mockServices.map((service) => ({
  id: service.id,
  name: service.name,
  team: service.team,
  health: Math.round(service.uptime),
  status: service.status,
  deployments: Math.floor(Math.random() * 20) + 5,
  dependencies: service.dependencies,
  dependents: [],
  lastDeployed: service.lastDeployed,
  owner: service.owner,
  criticality: service.status === 'down' ? 'critical' : service.status === 'degraded' ? 'high' : 'medium',
  changeFailureRate: service.errorRate * 100,
  deploymentFrequency: 'daily',
  mttr: '15 min',
  incidents30d: service.status === 'down' ? 3 : service.status === 'degraded' ? 1 : 0,
}));



export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = SERVICES_DATA.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.team.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedServiceData = SERVICES_DATA.find((s) => s.id === selectedService) as any

  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <div className="flex items-center justify-between">
            <PageHeader
              title="Services"
              description="Service catalog with health, deployments, and dependency visualization"
            />
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Register Service
            </Button>
          </div>

          {/* Service Catalog */}
          <ServiceCatalog
            services={filteredServices}
            selectedService={selectedService}
            onSelectService={setSelectedService}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </Section>
      </PageLayout>

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
