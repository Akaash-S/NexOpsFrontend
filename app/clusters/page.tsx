'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { ClusterTable } from '@/components/clusters/cluster-table'
import { ClusterFilters } from '@/components/clusters/cluster-filters'
import { ClusterIntelligenceDrawer } from '@/components/clusters/cluster-intelligence-drawer'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const CLUSTER_DATA = [
  {
    id: 'prod-us-east-1',
    name: 'Production US-East',
    region: 'us-east-1',
    provider: 'aws',
    health: 98,
    status: 'healthy',
    nodes: 24,
    services: 42,
    incidents: 0,
    lastSync: '2 minutes ago',
    capacity: 87,
    version: '1.27.5',
    criticalDeps: 3,
  },
  {
    id: 'prod-eu-west-1',
    name: 'Production EU-West',
    region: 'eu-west-1',
    provider: 'aws',
    health: 94,
    status: 'healthy',
    nodes: 18,
    services: 38,
    incidents: 1,
    lastSync: '5 minutes ago',
    capacity: 72,
    version: '1.27.5',
    criticalDeps: 2,
  },
  {
    id: 'staging-us-west-2',
    name: 'Staging US-West',
    region: 'us-west-2',
    provider: 'aws',
    health: 78,
    status: 'warning',
    nodes: 12,
    services: 28,
    incidents: 3,
    lastSync: '1 minute ago',
    capacity: 65,
    version: '1.26.8',
    criticalDeps: 1,
  },
  {
    id: 'dev-multi-region',
    name: 'Development Multi-Region',
    region: 'multi',
    provider: 'gke',
    health: 85,
    status: 'healthy',
    nodes: 8,
    services: 15,
    incidents: 2,
    lastSync: '3 minutes ago',
    capacity: 54,
    version: '1.27.3',
    criticalDeps: 0,
  },
  {
    id: 'edge-global',
    name: 'Edge CDN Network',
    region: 'global',
    provider: 'custom',
    health: 92,
    status: 'healthy',
    nodes: 64,
    services: 8,
    incidents: 0,
    lastSync: '10 seconds ago',
    capacity: 91,
    version: '2.1.0',
    criticalDeps: 5,
  },
]

export default function ClustersPage() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    region: 'all',
    provider: 'all',
    search: '',
  })

  const filteredClusters = CLUSTER_DATA.filter((cluster) => {
    if (filters.status !== 'all' && cluster.status !== filters.status) return false
    if (filters.region !== 'all' && cluster.region !== filters.region) return false
    if (filters.provider !== 'all' && cluster.provider !== filters.provider) return false
    if (filters.search && !cluster.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const selectedClusterData = CLUSTER_DATA.find((c) => c.id === selectedCluster)

  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <div className="flex items-center justify-between">
            <PageHeader
              title="Clusters"
              description="Infrastructure health and deployment status across regions"
            />
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Cluster
            </Button>
          </div>

          {/* Filters */}
          <ClusterFilters filters={filters} setFilters={setFilters} />

          {/* Cluster Table */}
          <div className="mt-8">
            <ClusterTable
              clusters={filteredClusters}
              selectedCluster={selectedCluster}
              onSelectCluster={setSelectedCluster}
            />
          </div>
        </Section>
      </PageLayout>

      {/* Intelligence Drawer */}
      {selectedClusterData && (
        <ClusterIntelligenceDrawer
          cluster={selectedClusterData}
          onClose={() => setSelectedCluster(null)}
        />
      )}
    </>
  )
}
