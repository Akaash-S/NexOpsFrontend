'use client'

import { useState, useMemo, useEffect } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, AlertTriangle, Loader2, RefreshCw, Link2, Unlink, ExternalLink } from 'lucide-react'
import { IntegrationFilters } from '@/components/integrations/integration-filters'
import { CardSkeleton } from '@/components/loading-state'

interface IntegrationStatus {
  connected: boolean
  config: string
  synced_repos_count?: number
  latest_sync_at?: string | null
  note?: string
}

interface StatusResponse {
  github: IntegrationStatus
  pagerduty: IntegrationStatus
}

interface IntegrationCard {
  id: string
  name: string
  description: string
  status: 'connected' | 'disconnected'
  health: 'healthy' | 'warning' | 'error'
  config: string
  note?: string
  synced_repos_count: number
  latest_sync_at: string | null
}

function formatTimeAgo(iso: string | null): string {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function IntegrationsPage() {
  const [status, setStatus] = useState<StatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    health: 'all',
    sortBy: 'name-asc',
  })

  useEffect(() => {
    async function loadStatus() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const data = await apiFetch('/integrations/status') as StatusResponse
        setStatus(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load integration status')
      } finally {
        setLoading(false)
      }
    }
    loadStatus()
  }, [])

  const integrations: IntegrationCard[] = useMemo(() => {
    if (!status) return []
    return [
      {
        id: 'github',
        name: 'GitHub',
        description: 'Synchronizes repositories, structures, codeowners and nexops.yaml configs.',
        status: status.github.connected ? 'connected' : 'disconnected',
        health: status.github.connected ? 'healthy' : 'warning',
        config: status.github.config,
        synced_repos_count: status.github.synced_repos_count ?? 0,
        latest_sync_at: status.github.latest_sync_at ?? null,
      },
      {
        id: 'pagerduty',
        name: 'PagerDuty',
        description: 'Ingests real-time alert logs and triggers incidents correlating them to changes.',
        status: 'disconnected',
        health: 'warning',
        config: status.pagerduty.config,
        note: status.pagerduty.note,
        synced_repos_count: 0,
        latest_sync_at: null,
      },
    ]
  }, [status])

  const filteredAndSortedIntegrations = useMemo(() => {
    return integrations
      .filter((int) => {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          int.name.toLowerCase().includes(searchLower) ||
          int.description.toLowerCase().includes(searchLower)

        let matchesStatus = true
        if (filters.status !== 'all') matchesStatus = int.status === filters.status

        let matchesHealth = true
        if (filters.health !== 'all') matchesHealth = int.health === filters.health

        return matchesSearch && matchesStatus && matchesHealth
      })
      .sort((a, b) => {
        const healthWeight: Record<string, number> = { healthy: 3, warning: 2, error: 1 }
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

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const disconnectedCount = integrations.filter(i => i.status === 'disconnected').length
  const issuesCount = integrations.filter(i => i.health !== 'healthy').length

  const handleConnectGithub = async () => {
    try {
      const { apiFetch } = await import('@/lib/api-client')
      const { url } = await apiFetch('/integrations/github/oauth-url')
      window.location.href = url
    } catch (err) {
      console.error('Failed to get GitHub OAuth URL:', err)
      alert('Failed to start GitHub connection. Please try again.')
    }
  }

  const handleSyncNow = async () => {
    setSyncing(true)
    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/integrations/sync', {
        method: 'POST',
        body: JSON.stringify({
          provider: 'github',
          token: 'use_stored_token',
          workspaceId: 'default-workspace',
        }),
      })
      const data = await apiFetch('/integrations/status') as StatusResponse
      setStatus(data)
    } catch (err) {
      console.error('Sync failed:', err)
      alert('Sync failed. Please try again.')
    } finally {
      setSyncing(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Disconnect GitHub? Existing repo data will be preserved but future syncs will stop.')) return
    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/integrations/github/disconnect', { method: 'POST' })
      const data = await apiFetch('/integrations/status') as StatusResponse
      setStatus(data)
    } catch (err) {
      console.error('Disconnect failed:', err)
      alert('Failed to disconnect. Please try again.')
    }
  }

  const latestSyncAll = integrations
    .map(i => i.latest_sync_at)
    .filter(Boolean)
    .sort()
    .reverse()[0] ?? null

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="Integrations"
          description="Connection status for data sources that feed the correlation engine"
        />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <CardSkeleton className="h-64" />
          <CardSkeleton className="h-64" />
        </div>
      </PageContent>
    )
  }

  if (error) {
    return (
      <PageContent>
        <PageHeader
          title="Integrations"
          description="Connection status for data sources that feed the correlation engine"
        />
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-sm font-semibold">Failed to load integration status</p>
          <p className="text-xs text-muted-foreground">{error}</p>
          <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <PageHeader
        title="Integrations"
        description="Connection status for data sources that feed the correlation engine"
      />

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Connected</div>
          <div className="text-2xl font-bold text-success">{connectedCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Disconnected</div>
          <div className={disconnectedCount > 0 ? 'text-2xl font-bold text-destructive' : 'text-2xl font-bold'}>
            {disconnectedCount}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Health Issues</div>
          <div className={issuesCount > 0 ? 'text-2xl font-bold text-warning' : 'text-2xl font-bold text-success'}>
            {issuesCount}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Last Sync</div>
          <div className="text-2xl font-bold">{formatTimeAgo(latestSyncAll)}</div>
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
                            : 'bg-muted text-muted-foreground border-border'
                        }
                      >
                        {integration.status === 'connected' ? 'Connected' : (integration.note || 'Disconnected')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Configuration</span>
                      <span className="font-semibold truncate max-w-[200px]">{integration.config}</span>
                    </div>
                    {integration.id === 'github' && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Synced Repos</span>
                          <span className="font-semibold">{integration.synced_repos_count}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Last Sync</span>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(integration.latest_sync_at)}</span>
                        </div>
                      </>
                    )}
                    {integration.id === 'pagerduty' && integration.note && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{integration.note}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {integration.id === 'github' && integration.status === 'connected' && (
                      <>
                        <Button size="sm" variant="secondary" className="flex-1 gap-1.5" onClick={handleSyncNow} disabled={syncing}>
                          {syncing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          {syncing ? 'Syncing...' : 'Sync Now'}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={handleDisconnect}>
                          <Unlink className="w-3.5 h-3.5" />
                          Disconnect
                        </Button>
                      </>
                    )}
                    {integration.id === 'github' && integration.status === 'disconnected' && (
                      <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={handleConnectGithub}>
                        <Link2 className="w-3.5 h-3.5" />
                        Connect GitHub
                      </Button>
                    )}
                    {integration.id === 'pagerduty' && (
                      <Button size="sm" variant="outline" className="flex-1" disabled>
                        Configure
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
            <p>No integrations found matching your criteria.</p>
          </div>
        )}
      </div>
    </PageContent>
  )
}
