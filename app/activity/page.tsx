'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { PageContent, PageHeader, EmptyState } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Activity as ActivityIcon,
  Search,
  RefreshCw,
  Zap,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Terminal,
  Code2,
  GitBranch,
  Radio,
  Copy,
  Check,
  Clock,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { apiFetch } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { useAppState } from '@/lib/hooks/use-app-state'

interface EventItem {
  id: string
  type: string
  repo_id?: string
  source: string
  payload?: any
  processed: boolean
  message?: string
  severity?: 'info' | 'warning' | 'critical' | string
  timestamp: string
}

function SourceBadge({ source }: { source: string }) {
  const s = source.toLowerCase()
  if (s.includes('github')) {
    return (
      <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 gap-1 text-[11px]">
        <GitBranch className="w-3 h-3" />
        GitHub
      </Badge>
    )
  }
  if (s.includes('pagerduty') || s.includes('alert')) {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 text-[11px]">
        <Radio className="w-3 h-3" />
        PagerDuty
      </Badge>
    )
  }
  if (s.includes('automation') || s.includes('engine')) {
    return (
      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 text-[11px]">
        <Zap className="w-3 h-3" />
        Automation
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 gap-1 text-[11px]">
      <Terminal className="w-3 h-3" />
      {source}
    </Badge>
  )
}

function SeverityBadge({ severity }: { severity?: string }) {
  const s = (severity || 'info').toLowerCase()
  if (s === 'critical' || s === 'error') {
    return (
      <Badge variant="outline" className="bg-destructive/15 text-destructive border-destructive/30 text-[10px] uppercase font-mono">
        Critical
      </Badge>
    )
  }
  if (s === 'warning' || s === 'high') {
    return (
      <Badge variant="outline" className="bg-warning/15 text-warning border-warning/30 text-[10px] uppercase font-mono">
        Warning
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-info/10 text-info border-info/20 text-[10px] uppercase font-mono">
      Info
    </Badge>
  )
}

function PayloadModal({ event, open, onClose }: { event: EventItem | null; open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  if (!event) return null

  const jsonStr = JSON.stringify(event.payload || event, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-6">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between gap-2 pr-6">
            <div>
              <DialogTitle className="text-base flex items-center gap-2 font-mono">
                <Code2 className="w-4 h-4 text-primary" />
                Event Detail Payload
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 font-mono">
                ID: {event.id} · Type: {event.type}
              </DialogDescription>
            </div>
            <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5 text-xs shrink-0">
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-3">
          <div className="bg-card border border-border/80 rounded-lg p-4 font-mono text-xs overflow-x-auto text-foreground/90 leading-relaxed">
            <pre>{jsonStr}</pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ActivityPageContent() {
  const router = useRouter()
  const { showExtendedNavigation } = useAppState()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [selectedPayloadEvent, setSelectedPayloadEvent] = useState<EventItem | null>(null)

  const fetchEvents = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    try {
      const data = await apiFetch('/events?limit=100')
      setEvents(data || [])
    } catch (err) {
      console.error('Failed to fetch event stream:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Live Auto-Refresh (Poll every 8s if autoRefresh enabled)
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      fetchEvents()
    }, 8000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchSearch =
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.type.toLowerCase().includes(search.toLowerCase()) ||
        e.source.toLowerCase().includes(search.toLowerCase()) ||
        (e.message && e.message.toLowerCase().includes(search.toLowerCase())) ||
        (e.repo_id && e.repo_id.toLowerCase().includes(search.toLowerCase()))

      const matchSource =
        sourceFilter === 'all' || e.source.toLowerCase().includes(sourceFilter.toLowerCase())
      const matchSeverity =
        severityFilter === 'all' || (e.severity || 'info').toLowerCase() === severityFilter.toLowerCase()

      return matchSearch && matchSource && matchSeverity
    })
  }, [events, search, sourceFilter, severityFilter])

  const totalEvents = events.length
  const criticalCount = events.filter((e) => (e.severity || '').toLowerCase() === 'critical').length
  const githubEventsCount = events.filter((e) => e.source.toLowerCase().includes('github')).length
  const automationCount = events.filter((e) => e.source.toLowerCase().includes('automation') || e.processed).length

  if (!showExtendedNavigation) {
    return (
      <PageContent>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shadow-lg shadow-warning/5">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md">
            <h2 className="text-xl font-bold text-foreground">Activity Stream Gated</h2>
            <p className="text-sm text-muted-foreground">
              Activity Stream is gated behind the <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded border border-border">show_extended_navigation</code> workspace flag.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 text-xs font-medium border-primary/30 text-primary hover:bg-primary/5 mt-2"
            onClick={() => router.push('/settings?tab=workspace')}
          >
            Manage Workspace Settings
          </Button>
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <div className="flex items-center justify-between mb-2">
        <PageHeader
          title="Activity & Event Stream"
          description="Real-time audit log of incoming webhooks, platform telemetry, and automation engine executions"
        />

        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="gap-2 text-xs"
          >
            <span className={cn('w-2 h-2 rounded-full', autoRefresh ? 'bg-success animate-pulse' : 'bg-muted-foreground')} />
            {autoRefresh ? 'Live Polling On' : 'Polling Paused'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchEvents(true)}
            disabled={refreshing}
            className="gap-2 text-xs"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground font-medium">Total Telemetry Events</div>
          <div className="text-2xl font-bold text-foreground mt-1">{totalEvents}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Ingested workspace events</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground font-medium">GitHub Webhooks</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{githubEventsCount}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Pushes, PRs & deployments</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground font-medium">Automations Executed</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{automationCount}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Processed by rule engine</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground font-medium">Critical Alerts</div>
          <div className={cn('text-2xl font-bold mt-1', criticalCount > 0 ? 'text-destructive' : 'text-success')}>
            {criticalCount}
          </div>
          <div className="text-[11px] text-muted-foreground mt-0.5">Requiring operational review</div>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search event type, repo, payload message..."
            className="pl-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-40 text-xs">
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="github">GitHub</SelectItem>
            <SelectItem value="pagerduty">PagerDuty</SelectItem>
            <SelectItem value="automation">Automation</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-40 text-xs">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-muted-foreground ml-auto">
          Showing <strong>{filteredEvents.length}</strong> of {events.length} events
        </span>
      </div>

      {/* Event List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <ActivityIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="font-semibold text-base">No Matching Events Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            No telemetry events match your current filter settings or no events have been ingested yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((evt) => {
            const timeStr = evt.timestamp ? new Date(evt.timestamp).toLocaleString() : 'Just now'
            return (
              <Card
                key={evt.id}
                className="p-4 hover:border-border/80 transition-colors flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="mt-0.5 p-2 rounded-lg bg-secondary/50 shrink-0">
                    <ActivityIcon className="w-4 h-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-semibold text-foreground">{evt.type}</span>
                      <SourceBadge source={evt.source} />
                      <SeverityBadge severity={evt.severity} />
                      {evt.repo_id && (
                        <Badge variant="secondary" className="text-[10px] font-mono">
                          {evt.repo_id}
                        </Badge>
                      )}
                      {evt.processed && (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          Processed
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground truncate font-sans">
                      {evt.message || (evt.payload ? JSON.stringify(evt.payload).slice(0, 120) : 'No payload message provided')}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {timeStr}
                      </span>
                      <span>·</span>
                      <span className="font-mono">ID: {evt.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedPayloadEvent(evt)}
                  className="gap-1 text-xs shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <Code2 className="w-3.5 h-3.5 text-primary" />
                  <span>Payload</span>
                </Button>
              </Card>
            )
          })}
        </div>
      )}

      {/* Payload Modal */}
      <PayloadModal
        event={selectedPayloadEvent}
        open={!!selectedPayloadEvent}
        onClose={() => setSelectedPayloadEvent(null)}
      />
    </PageContent>
  )
}

export default function ActivityPage() {
  return (
    <Suspense
      fallback={
        <PageContent>
          <PageHeader
            title="Activity & Event Stream"
            description="Real-time audit log of incoming webhooks, platform telemetry, and automation engine executions"
          />
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </PageContent>
      }
    >
      <ActivityPageContent />
    </Suspense>
  )
}
