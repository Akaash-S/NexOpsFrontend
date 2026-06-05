'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Plus, ShieldAlert } from 'lucide-react'
import { INTEGRATIONS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'
import { IntegrationFilters } from '@/components/integrations/integration-filters'
import { ConnectIntegrationDrawer } from '@/components/integrations/connect-integration-drawer'

export default function IntegrationsPage() {
  const { setConnectIntegrationOpen } = useAppState()
  const [integrations, setIntegrations] = useState<any[]>(INTEGRATIONS_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    health: 'all',
    sortBy: 'name-asc',
  })

  const filteredAndSortedIntegrations = useMemo(() => {
    return integrations
      .filter((int) => {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          int.name.toLowerCase().includes(searchLower) ||
          int.config.toLowerCase().includes(searchLower)
        
        let matchesStatus = true
        if (filters.status !== 'all') matchesStatus = int.status === filters.status

        let matchesHealth = true
        if (filters.health !== 'all') matchesHealth = int.health === filters.health
        
        return matchesSearch && matchesStatus && matchesHealth
      })
      .sort((a, b) => {
        const healthWeight: Record<string, number> = { 'healthy': 3, 'warning': 2, 'error': 1 }
        switch (filters.sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'health-asc':
            return healthWeight[b.health] - healthWeight[a.health]
          case 'health-desc':
            return healthWeight[a.health] - healthWeight[b.health]
          default:
            return 0
        }
      })
  }, [integrations, filters])

  const handleCreateSuccess = (newInt: any) => {
    setIntegrations([newInt, ...integrations])
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const disconnectedCount = integrations.filter(i => i.status === 'disconnected').length
  const issuesCount = integrations.filter(i => i.health !== 'healthy').length

  return (
    <>
      <PageContent>
        <PageHeader
          title="Integrations"
          description="Enterprise integration hub for GitHub, Kubernetes, cloud providers, monitoring, and collaboration platforms"
        />

        {/* Action Button */}
        <div className="mb-8 flex justify-between items-center">
          <Button className="gap-2" onClick={() => setConnectIntegrationOpen(true)}>
            <Plus className="w-4 h-4" />
            Connect Tool
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Connected</div>
            <div className="text-2xl font-bold text-success">{connectedCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Disconnected</div>
            <div className={disconnectedCount > 0 ? "text-2xl font-bold text-destructive" : "text-2xl font-bold"}>
              {disconnectedCount}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Health Issues</div>
            <div className={issuesCount > 0 ? "text-2xl font-bold text-warning" : "text-2xl font-bold text-success"}>
              {issuesCount}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Last Sync</div>
            <div className="text-2xl font-bold">Just now</div>
          </Card>
        </div>

        {/* Filters */}
        <IntegrationFilters filters={filters} setFilters={setFilters} />

        {/* Integrations Grid */}
        <div className="mb-8">
          {filteredAndSortedIntegrations.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              {filteredAndSortedIntegrations.map((integration) => {
                return (
                  <Card key={integration.id} className="p-6 hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {integration.name[0]}
                        </div>
                        <h3 className="font-semibold text-lg">{integration.name}</h3>
                      </div>
                      {integration.health === 'healthy' ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : integration.health === 'warning' ? (
                        <AlertCircle className="w-5 h-5 text-warning" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>

                    <div className="space-y-3 mb-6 bg-muted/20 p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                          variant="outline"
                          className={
                            integration.status === 'connected'
                              ? 'bg-success/10 text-success border-success/20'
                              : 'bg-destructive/10 text-destructive border-destructive/20'
                          }
                        >
                          {integration.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Configuration</span>
                        <span className="font-semibold truncate max-w-[200px]">{integration.config}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Last Sync</span>
                        <span className="text-xs text-muted-foreground">{integration.lastSync}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Configure
                      </Button>
                      {integration.status === 'connected' && (
                        <Button size="sm" variant="secondary" className="flex-1">
                          Sync Now
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
              <ShieldAlert className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
              <p>No integrations found matching your criteria.</p>
            </div>
          )}
        </div>
      </PageContent>

      <ConnectIntegrationDrawer onSuccess={handleCreateSuccess} />
    </>
  )
}
