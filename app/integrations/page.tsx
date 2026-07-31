'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { PageContent, PageHeader } from '@/components/layout'
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, AlertTriangle, Loader2, RefreshCw, Link2, Unlink, ExternalLink, ShieldCheck, Lock } from 'lucide-react'
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
  terms_acknowledged?: boolean
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
  const [showPdForm, setShowPdForm] = useState(false)
  const [pdToken, setPdToken] = useState('')
  const [connectingPd, setConnectingPd] = useState(false)
  const [pdError, setPdError] = useState<string | null>(null)

  // Terms Acknowledgment Gate Modal State
  const [showTermsGateModal, setShowTermsGateModal] = useState(false)
  const [termsAcceptedCheckbox, setTermsAcceptedCheckbox] = useState(false)
  const [acknowledgingTerms, setAcknowledgingTerms] = useState(false)
  const [pendingAction, setPendingAction] = useState<'github' | 'pagerduty' | null>(null)

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
        status: status.pagerduty.connected ? 'connected' : 'disconnected',
        health: status.pagerduty.connected ? 'healthy' : 'warning',
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

  const executeConnectGithub = async () => {
    try {
      const { apiFetch } = await import('@/lib/api-client')
      const res = await apiFetch('/integrations/github/oauth-url') as { url: string }
      window.location.href = res.url
    } catch (err: any) {
      if (err?.status === 403 || err?.message?.includes('Terms of Service')) {
        setPendingAction('github')
        setShowTermsGateModal(true)
        return
      }
      console.error('Failed to get GitHub OAuth URL:', err)
      alert('Failed to start GitHub connection. Please try again.')
    }
  }

  const handleConnectGithub = async () => {
    if (status && !status.terms_acknowledged) {
      setPendingAction('github')
      setShowTermsGateModal(true)
      return
    }
    await executeConnectGithub()
  }

  const executeConnectPagerDuty = async () => {
    if (!pdToken.trim()) {
      setPdError('API Token cannot be empty')
      return
    }
    setPdError(null)
    setConnectingPd(true)
    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/integrations/pagerduty/connect', {
        method: 'POST',
        body: JSON.stringify({ token: pdToken.trim() })
      })
      const data = await apiFetch('/integrations/status') as StatusResponse
      setStatus(data)
      setShowPdForm(false)
      setPdToken('')
    } catch (err: any) {
      if (err?.status === 403 || err?.message?.includes('Terms of Service')) {
        setPendingAction('pagerduty')
        setShowTermsGateModal(true)
        return
      }
      console.error('Failed to connect PagerDuty:', err)
      setPdError(err instanceof Error ? err.message : 'Connection failed. Invalid token or network issue.')
    } finally {
      setConnectingPd(false)
    }
  }

  const handleConnectPagerDuty = async () => {
    if (status && !status.terms_acknowledged) {
      setPendingAction('pagerduty')
      setShowTermsGateModal(true)
      return
    }
    await executeConnectPagerDuty()
  }

  const handleConfirmAcknowledgment = async () => {
    if (!termsAcceptedCheckbox) return
    setAcknowledgingTerms(true)
    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/integrations/terms/acknowledge', { method: 'POST' })

      setStatus(prev => prev ? { ...prev, terms_acknowledged: true } : prev)
      setShowTermsGateModal(false)
      setTermsAcceptedCheckbox(false)

      const actionToResume = pendingAction
      setPendingAction(null)
      if (actionToResume === 'github') {
        await executeConnectGithub()
      } else if (actionToResume === 'pagerduty') {
        setShowPdForm(true)
      }
    } catch (err) {
      console.error('Failed to acknowledge terms:', err)
      alert('Failed to record agreement. Please try again.')
    } finally {
      setAcknowledgingTerms(false)
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

  const handleDisconnectPagerDuty = async () => {
    if (!confirm('Disconnect PagerDuty? This will delete the registered webhook subscription and clear credentials.')) return
    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/integrations/pagerduty/disconnect', { method: 'DELETE' })
      const data = await apiFetch('/integrations/status') as StatusResponse
      setStatus(data)
    } catch (err) {
      console.error('Disconnect failed:', err)
      alert('Failed to disconnect PagerDuty. Please try again.')
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
        <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-lg text-destructive flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 space-y-2 bg-card border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Available</span>
          <div className="text-2xl font-bold text-foreground">{integrations.length}</div>
          <p className="text-xs text-muted-foreground">Providers ready for setup</p>
        </Card>
        <Card className="p-4 space-y-2 bg-card border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Connections</span>
          <div className="text-2xl font-bold text-success">{connectedCount}</div>
          <p className="text-xs text-muted-foreground">Currently operational</p>
        </Card>
        <Card className="p-4 space-y-2 bg-card border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Disconnected</span>
          <div className="text-2xl font-bold text-muted-foreground">{disconnectedCount}</div>
          <p className="text-xs text-muted-foreground font-mono">Awaiting setup</p>
        </Card>
        <Card className="p-4 space-y-2 bg-card border-border">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Latest Sync</span>
          <div className="text-2xl font-bold text-foreground">{formatTimeAgo(latestSyncAll)}</div>
          <p className="text-xs text-muted-foreground">Across all integrations</p>
        </Card>
      </div>

      {/* Terms Acknowledgment Banner (if not yet acknowledged) */}
      {status && !status.terms_acknowledged && (
        <div className="mb-6 p-4 rounded-xl border border-warning/30 bg-warning/10 text-foreground flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-warning shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-warning">Terms & Privacy Acknowledgment Required:</span>{' '}
              A one-time agreement is required before connecting integrations. Read the{' '}
              <Link href="/terms" target="_blank" prefetch={false} className="underline hover:text-primary font-medium">Terms of Service</Link>{' '}
              and{' '}
              <Link href="/privacy" target="_blank" prefetch={false} className="underline hover:text-primary font-medium">Privacy Notice</Link>.
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-warning/40 text-warning hover:bg-warning/20 font-semibold shrink-0"
            onClick={() => setShowTermsGateModal(true)}
          >
            Review & Agree
          </Button>
        </div>
      )}

      {/* Filter and Control Bar */}
      <IntegrationFilters
        filters={filters}
        setFilters={setFilters}
      />

      {/* Integration Cards List */}
      <div className="mt-6">
        {filteredAndSortedIntegrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAndSortedIntegrations.map((integration) => {
              const statusBadgeVariant = integration.status === 'connected' ? 'secondary' : 'outline'

              return (
                <Card key={integration.id} className="p-6 border-border bg-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{integration.name}</h3>
                          <Badge
                            variant={statusBadgeVariant}
                            className={cn('capitalize', integration.status === 'connected' && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20')}
                          >
                            {integration.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mt-1">
                          {integration.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 p-3 rounded bg-muted/40 border border-border/50">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Config</span>
                        <span className="font-mono text-xs text-foreground">{integration.config}</span>
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

                    {integration.id === 'pagerduty' && showPdForm && integration.status === 'disconnected' && (
                      <div className="space-y-3 mb-6 p-4 border border-border bg-background rounded-lg animate-in fade-in duration-200">
                        <div className="text-xs text-muted-foreground">
                          Enter your PagerDuty REST API Key. You can generate one in PagerDuty under{" "}
                          <a
                            href="https://support.pagerduty.com/main/docs/api-access-keys"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-0.5"
                          >
                            Integrations → API Access Keys
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </a>.
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            placeholder="e.g. y_NbAkKc..."
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={pdToken}
                            onChange={(e) => setPdToken(e.target.value)}
                          />
                          <Button
                            size="sm"
                            className="h-9 px-4 font-semibold"
                            onClick={handleConnectPagerDuty}
                            disabled={connectingPd}
                          >
                            {connectingPd ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              'Submit'
                            )}
                          </Button>
                        </div>
                        {pdError && (
                          <div className="text-xs text-destructive flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {pdError}
                          </div>
                        )}
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
                    {integration.id === 'pagerduty' && integration.status === 'connected' && (
                      <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={handleDisconnectPagerDuty}>
                        <Unlink className="w-3.5 h-3.5" />
                        Disconnect
                      </Button>
                    )}
                    {integration.id === 'pagerduty' && integration.status === 'disconnected' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1.5"
                        onClick={() => {
                          if (status && !status.terms_acknowledged) {
                            setPendingAction('pagerduty')
                            setShowTermsGateModal(true)
                            return
                          }
                          setShowPdForm(!showPdForm)
                          setPdError(null)
                        }}
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        {showPdForm ? 'Cancel' : 'Connect PagerDuty'}
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

      {/* Terms Acknowledgment Modal */}
      {showTermsGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> One-Time Workspace Requirement
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Pilot Program Agreement & Privacy Notice
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before connecting GitHub or PagerDuty to ingest operational data into your workspace, please acknowledge the NexOps Pilot Agreement and Privacy Notice.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-border/60 bg-muted/30 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={termsAcceptedCheckbox}
                  onChange={(e) => setTermsAcceptedCheckbox(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <label htmlFor="terms-checkbox" className="text-sm font-medium leading-relaxed cursor-pointer select-none">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" prefetch={false} className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5">
                    Pilot Program Agreement
                    <ExternalLink className="w-3 h-3 text-primary/80" />
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank" prefetch={false} className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5">
                    Privacy Notice
                    <ExternalLink className="w-3 h-3 text-primary/80" />
                  </Link>.
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTermsGateModal(false)
                  setPendingAction(null)
                  setTermsAcceptedCheckbox(false)
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="font-semibold px-6 gap-2"
                disabled={!termsAcceptedCheckbox || acknowledgingTerms}
                onClick={handleConfirmAcknowledgment}
              >
                {acknowledgingTerms ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContent>
  )
}
