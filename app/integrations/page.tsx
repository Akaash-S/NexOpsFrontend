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
  // Detect whether the string already carries timezone info.
  // Handles: trailing Z, +HH:MM, and -HH:MM suffixes.
  // If none found, the server stored a naive UTC datetime — append Z so the
  // browser treats it as UTC instead of local time.
  const hasTz = /Z$|[+-]\d{2}:\d{2}$/.test(iso.trim())
  const normalized = hasTz ? iso : iso + 'Z'
  const ms = new Date(normalized).getTime()
  if (isNaN(ms)) return 'Unknown'           // guard against any future bad values
  const diff = Date.now() - ms
  if (diff < 0) return 'Just now'           // clock skew guard
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
  // Tick every 30s so "X minutes ago" stays live without a page reload
  const [, setTick] = useState(0)

  // Terms Acknowledgment Gate Modal State
  const [showTermsGateModal, setShowTermsGateModal] = useState(false)
  const [termsAcceptedCheckbox, setTermsAcceptedCheckbox] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [acknowledgingTerms, setAcknowledgingTerms] = useState(false)
  const [pendingAction, setPendingAction] = useState<'github' | 'pagerduty' | null>(null)

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const maxScroll = scrollHeight - clientHeight
    if (maxScroll > 0) {
      const pct = Math.min(100, Math.round((scrollTop / maxScroll) * 100))
      setScrollProgress(pct)
      if (maxScroll - scrollTop <= 25) {
        setHasScrolledToBottom(true)
      }
    } else {
      setHasScrolledToBottom(true)
      setScrollProgress(100)
    }
  }

  const openTermsGateModal = (action: 'github' | 'pagerduty') => {
    setPendingAction(action)
    setTermsAcceptedCheckbox(false)
    setHasScrolledToBottom(false)
    setScrollProgress(0)
    setShowTermsGateModal(true)
  }

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

  // Live-refresh the "X minutes ago" label every 30 seconds
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000)
    return () => clearInterval(id)
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
        openTermsGateModal('github')
        return
      }
      console.error('Failed to get GitHub OAuth URL:', err)
      alert('Failed to start GitHub connection. Please try again.')
    }
  }

  const handleConnectGithub = async () => {
    if (status && !status.terms_acknowledged) {
      openTermsGateModal('github')
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
      // Optimistically update UI immediately so the user sees the connected state
      // even before the status re-fetch completes.
      setStatus(prev => prev ? {
        ...prev,
        pagerduty: { ...prev.pagerduty, connected: true, config: 'API Token Connected' }
      } : prev)
      setShowPdForm(false)
      setPdToken('')
      // Then re-fetch authoritative status from backend in the background
      try {
        const data = await apiFetch('/integrations/status') as StatusResponse
        setStatus(data)
      } catch (statusErr) {
        console.warn('Status re-fetch after PagerDuty connect failed (UI already updated optimistically):', statusErr)
      }
    } catch (err: any) {
      if (err?.status === 403 || err?.message?.includes('Terms of Service')) {
        openTermsGateModal('pagerduty')
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
      openTermsGateModal('pagerduty')
      return
    }
    await executeConnectPagerDuty()
  }

  const handleConfirmAcknowledgment = async () => {
    if (!hasScrolledToBottom || !termsAcceptedCheckbox) return
    setAcknowledgingTerms(true)
    try {
      const { apiFetch } = await import('@/lib/api-client')
      await apiFetch('/integrations/terms/acknowledge', { method: 'POST' })

      setStatus(prev => prev ? { ...prev, terms_acknowledged: true } : prev)
      setShowTermsGateModal(false)
      setTermsAcceptedCheckbox(false)
      setHasScrolledToBottom(false)

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
                            openTermsGateModal('pagerduty')
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

      {/* Terms Acknowledgment Modal — Option A (Inline Scroll to Bottom Required) */}
      {showTermsGateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> One-Time Workspace Requirement
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Pilot Program Agreement & Privacy Notice
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scroll to the very bottom of the agreement panel below to review both documents in full and unlock the acknowledgment checkbox.
              </p>
            </div>

            {/* Scroll Indicator & Progress Bar */}
            <div className="flex items-center justify-between text-xs font-mono font-semibold px-1 pt-1">
              <span className={cn('flex items-center gap-1.5', hasScrolledToBottom ? 'text-emerald-500 font-bold' : 'text-amber-500')}>
                {hasScrolledToBottom ? '✓ Document Reviewed (100%)' : `Scroll to bottom to unlock (${scrollProgress}%)`}
              </span>
              <span className="text-muted-foreground text-[11px]">
                {hasScrolledToBottom ? 'Checkbox Unlocked' : 'Checkbox Locked 🔒'}
              </span>
            </div>

            {/* Option A Inline Scroll Panel */}
            <div
              onScroll={handleTermsScroll}
              className="max-h-72 overflow-y-auto border border-border/80 rounded-lg p-5 bg-muted/20 space-y-6 text-xs sm:text-sm text-foreground/90 leading-relaxed scrollbar-thin select-text"
            >
              {/* SECTION 1: PILOT PROGRAM AGREEMENT */}
              <div className="space-y-3">
                <div className="border-b border-border/60 pb-2">
                  <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
                    Part I — Pilot Program Agreement
                  </h4>
                  <p className="text-[11px] text-muted-foreground">Effective Version: v1.0 • NexOps Platform</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-foreground">1. What this covers</p>
                  <p className="text-muted-foreground">
                    This agreement covers your ("Participant") use of NexOps ("the Product"), operated by NexOps Platform ("we", "us"), during an unpaid pilot period. It's meant to set clear, honest expectations for both sides while the product is still early.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-foreground">2. What the pilot is</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><strong>Free of charge:</strong> No payment is requested or expected during the pilot.</li>
                    <li>You connect your GitHub organization and PagerDuty account so NexOps can read deploy and incident data and surface likely causes for incidents.</li>
                    <li>In exchange, we ask for honest feedback and real usage — specifically, using the confirm/reject controls on suggested causes when you have a real incident.</li>
                    <li>Either side can end the pilot at any time, for any reason, with reasonable notice.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-foreground">3. What data we access, and why</p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    <li><strong>GitHub:</strong> repository metadata, deploy/commit history, and CODEOWNERS-derived ownership — used to build the dependency graph and correlation logic.</li>
                    <li><strong>PagerDuty:</strong> incident trigger/acknowledge/resolve events — used to detect incidents and match them against recent deploys.</li>
                    <li>We do not access source code contents, secrets, or repository file contents beyond what's needed for deploy/dependency metadata.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-foreground">4. Liability & Promises</p>
                  <p className="text-muted-foreground">
                    The Product is provided "as is" during the pilot period without warranties of any kind. NexOps surfaces likely cause suggestions with visible reasoning — a human should always confirm a suggested cause before taking production actions.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-foreground">5. Confidentiality & Contact</p>
                  <p className="text-muted-foreground">
                    We will not share your repository names or incident data with third parties. Questions about this agreement: <span className="text-primary underline">akaashgithub21@gmail.com</span>.
                  </p>
                </div>
              </div>

              {/* SECTION 2: PRIVACY NOTICE */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <div className="border-b border-border/60 pb-2">
                  <h4 className="font-bold text-foreground text-sm uppercase tracking-wide">
                    Part II — Privacy Notice
                  </h4>
                  <p className="text-[11px] text-muted-foreground">NexOps Platform Data Protection</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-foreground">1. Data Collection & Usage</p>
                  <p className="text-muted-foreground">
                    We collect account identifiers (name, email), authorized integration metadata, and confirm/reject feedback metrics to compute workspace-specific scoring weights. We do not sell your data or train public AI models on your inputs.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-foreground">2. Security & Retention</p>
                  <p className="text-muted-foreground">
                    We enforce PostgreSQL Row-Level Security (RLS) tenant isolation and Fernet secret encryption. Data is retained for active pilot workspaces and deleted within 30 days upon request or pilot termination.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/40 text-center">
                  <p className="font-bold text-emerald-500 text-xs">
                    --- END OF AGREEMENT & PRIVACY NOTICE ---
                  </p>
                </div>
              </div>
            </div>

            {/* Checkbox Container */}
            <div className={cn(
              'p-3.5 rounded-lg border transition-all duration-200',
              hasScrolledToBottom
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-border/60 bg-muted/20 opacity-75'
            )}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  disabled={!hasScrolledToBottom}
                  checked={termsAcceptedCheckbox}
                  onChange={(e) => setTermsAcceptedCheckbox(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label
                  htmlFor="terms-checkbox"
                  className={cn(
                    'text-xs font-medium leading-relaxed select-none',
                    hasScrolledToBottom ? 'cursor-pointer text-foreground' : 'cursor-not-allowed text-muted-foreground'
                  )}
                >
                  {hasScrolledToBottom ? (
                    <span>
                      I have read and agree to the <strong>Pilot Program Agreement</strong> and <strong>Privacy Notice</strong> above.
                    </span>
                  ) : (
                    <span className="text-amber-500/90 font-medium">
                      🔒 Checkbox disabled — Please scroll to the very bottom of the document box above to enable this checkbox.
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-muted-foreground">
                <Link href="/terms" target="_blank" className="hover:underline text-primary">Open Terms Page</Link> • <Link href="/privacy" target="_blank" className="hover:underline text-primary">Open Privacy Page</Link>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowTermsGateModal(false)
                    setPendingAction(null)
                    setTermsAcceptedCheckbox(false)
                    setHasScrolledToBottom(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="font-semibold px-6 gap-2"
                  disabled={!hasScrolledToBottom || !termsAcceptedCheckbox || acknowledgingTerms}
                  onClick={handleConfirmAcknowledgment}
                >
                  {acknowledgingTerms ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Continue'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContent>
  )
}
