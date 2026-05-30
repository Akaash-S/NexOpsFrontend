'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { ServiceCatalog } from '@/components/services/service-catalog'
import { ServiceDetailsDrawer } from '@/components/services/service-details-drawer'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const SERVICES_DATA = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    team: 'Platform',
    health: 98,
    status: 'healthy',
    deployments: 12,
    dependencies: ['auth-service', 'rate-limiter', 'cache-layer'],
    dependents: ['mobile-app', 'web-client', 'partner-api'],
    lastDeployed: '2 hours ago',
    owner: 'Sarah Chen',
    criticality: 'critical',
    changeFailureRate: 2.1,
    deploymentFrequency: 'daily',
    mttr: '15 min',
    incidents30d: 1,
  },
  {
    id: 'auth-service',
    name: 'Authentication Service',
    team: 'Identity',
    health: 99,
    status: 'healthy',
    deployments: 8,
    dependencies: ['database', 'redis', 'secrets-manager'],
    dependents: ['api-gateway', 'admin-panel', 'user-dashboard'],
    lastDeployed: '5 days ago',
    owner: 'Marcus Johnson',
    criticality: 'critical',
    changeFailureRate: 0.8,
    deploymentFrequency: 'weekly',
    mttr: '5 min',
    incidents30d: 0,
  },
  {
    id: 'search-service',
    name: 'Search Service',
    team: 'Data',
    health: 85,
    status: 'warning',
    deployments: 24,
    dependencies: ['elasticsearch', 'kafka', 'cache-layer'],
    dependents: ['api-gateway', 'analytics-dashboard'],
    lastDeployed: '30 minutes ago',
    owner: 'Elena Rodriguez',
    criticality: 'high',
    changeFailureRate: 5.2,
    deploymentFrequency: 'multiple-daily',
    mttr: '45 min',
    incidents30d: 3,
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    team: 'Platform',
    health: 92,
    status: 'healthy',
    deployments: 16,
    dependencies: ['kafka', 'email-provider', 'sms-provider'],
    dependents: ['api-gateway', 'user-dashboard'],
    lastDeployed: '3 hours ago',
    owner: 'James Liu',
    criticality: 'medium',
    changeFailureRate: 3.5,
    deploymentFrequency: 'daily',
    mttr: '30 min',
    incidents30d: 2,
  },
  {
    id: 'analytics-engine',
    name: 'Analytics Engine',
    team: 'Data',
    health: 88,
    status: 'healthy',
    deployments: 20,
    dependencies: ['kafka', 'bigquery', 'data-warehouse'],
    dependents: ['analytics-dashboard', 'reports-api'],
    lastDeployed: '1 hour ago',
    owner: 'Lisa Wang',
    criticality: 'medium',
    changeFailureRate: 4.1,
    deploymentFrequency: 'daily',
    mttr: '60 min',
    incidents30d: 1,
  },
]

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = SERVICES_DATA.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.team.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedServiceData = SERVICES_DATA.find((s) => s.id === selectedService)

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
