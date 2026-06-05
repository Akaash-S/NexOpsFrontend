'use client'

import { useState } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { ClusterTable } from '@/components/clusters/cluster-table'
import { ClusterFilters } from '@/components/clusters/cluster-filters'
import { ClusterIntelligenceDrawer } from '@/components/clusters/cluster-intelligence-drawer'
import { AddClusterDrawer } from '@/components/clusters/add-cluster-drawer'
import { Button } from '@/components/ui/button'
import { Plus, Server } from 'lucide-react'
import { mockClusters } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'


export default function ClustersPage() {
  const { addNotification, setAddClusterOpen } = useAppState()
  const [clusters, setClusters] = useState(mockClusters)
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    region: 'all',
    provider: 'all',
    search: '',
    sortBy: 'health-asc',
  })

  const filteredClusters = clusters
    .filter((cluster) => {
      if (filters.status !== 'all' && cluster.status !== filters.status) return false
      if (filters.region !== 'all' && cluster.region !== filters.region) return false
      if (filters.provider !== 'all' && cluster.provider !== filters.provider) return false
      if (filters.search && !cluster.name.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'health-asc': return a.health - b.health;
        case 'health-desc': return b.health - a.health;
        case 'capacity-desc': return b.capacity - a.capacity;
        case 'incidents-desc': return b.incidents - a.incidents;
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return 0;
      }
    })

  const selectedClusterData = clusters.find((c) => c.id === selectedCluster)

  const handleClusterAdded = (newCluster: any) => {
    setClusters([newCluster, ...clusters])
  }

  return (
    <>
      
      <>
        <PageContent>
          <div className="flex items-center justify-between">
            <PageHeader
              title="Clusters"
              description="Infrastructure health and deployment status across regions"
            />
            <Button 
              className="gap-2"
              onClick={() => setAddClusterOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Cluster
            </Button>
          </div>

          {/* Filters */}
          <ClusterFilters filters={filters} setFilters={setFilters} />

          {/* Cluster Table or Empty State */}
          <div className="mt-8">
            {clusters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-lg bg-muted/10">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Server className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Clusters Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Get started by creating your first engineering domain to organize services, intelligence, and deployments.
                </p>
                <Button onClick={() => setAddClusterOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Cluster
                </Button>
              </div>
            ) : (
              <ClusterTable
                clusters={filteredClusters}
                selectedCluster={selectedCluster}
                onSelectCluster={setSelectedCluster}
              />
            )}
          </div>
        </PageContent>
      </>

      {/* Intelligence Drawer */}
      {selectedClusterData && (
        <ClusterIntelligenceDrawer
          cluster={selectedClusterData}
          onClose={() => setSelectedCluster(null)}
        />
      )}

      {/* Add Cluster Flow */}
      <AddClusterDrawer onSuccess={handleClusterAdded} />
    </>
  )
}
