'use client'

import { useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Zap,
  Network,
  GitCommitHorizontal,
  ChevronRight,
  BellOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { INCIDENTS_DATA, CandidateCause } from '@/lib/mock-data'
import { serviceNodes, dependencyEdges, getNodeById, getUpstream, getDownstream } from '@/lib/graph'

const severityConfig = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30', label: 'Critical' },
  high: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', label: 'High' },
  medium: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20', label: 'Medium' },
}

const statusConfig = {
  open: { label: 'Investigating', class: 'bg-destructive/10 text-destructive border-destructive/20' },
  investigating: { label: 'Monitoring', class: 'bg-warning/10 text-warning border-warning/20' },
  resolved: { label: 'Resolved', class: 'bg-success/10 text-success border-success/20' },
}

const healthMock: Record<string, 'healthy' | 'warning' | 'critical'> = {
  'api-gateway': 'warning',
  'auth-service': 'critical',
  'user-service': 'healthy',
  'payment-service': 'warning',
  'notification-service': 'healthy',
  'analytics-engine': 'healthy',
  'database': 'warning',
  'redis-cache': 'healthy',
  'kafka-queue': 'healthy',
}

const healthConfig = {
  healthy: { dot: 'bg-success', border: 'border-success/30', bg: 'bg-success/10', text: 'text-success' },
  warning: { dot: 'bg-warning', border: 'border-warning/30', bg: 'bg-warning/10', text: 'text-warning' },
  critical: { dot: 'bg-destructive', border: 'border-destructive/30', bg: 'bg-destructive/10', text: 'text-destructive' },
}

interface CandidateRowProps {
  cause: CandidateCause
  rank: number
  localConfirmed: boolean | null
  onConfirm: (value: boolean | null) => void
}

function CandidateRow({ cause, rank, localConfirmed, onConfirm }: CandidateRowProps) {
  const node = getNodeById(cause.service)
  const serviceName = node?.name ?? cause.service
  const confirmed = localConfirmed

  const scoreColor =
    cause.matchScore >= 80 ? 'text-destructive bg-destructive/10 border-destructive/20' :
    cause.matchScore >= 60 ? 'text-warning bg-warning/10 border-warning/20' :
    'text-muted-foreground bg-muted border-border'

  return (
    <div className={cn(
      'rounded-xl border-2 overflow-hidden',
      confirmed === true ? 'border-success/40' :
      confirmed === false ? 'border-border opacity-60' :
      rank === 0 ? 'border-destructive/30' : 'border-border'
    )}>
      {/* Rank header */}
      <div className={cn(
        'flex items-center gap-3 px-5 py-3',
        rank === 0 ? 'bg-destructive/10' : 'bg-muted/30'
      )}>
        <span className="text-xs font-bold text-muted-foreground w-5">#{rank + 1}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{serviceName}</span>
            <span className="text-xs font-mono text-muted-foreground">{cause.deployId}</span>
          </div>
        </div>
        <Badge variant="outline" className={cn('text-sm font-mono font-bold', scoreColor)}>
          {cause.matchScore}/100
        </Badge>
        {confirmed === true && (
          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
            ✓ Confirmed cause
          </Badge>
        )}
        {confirmed === false && (
          <Badge variant="outline" className="text-xs">
            ✗ Ruled out
          </Badge>
        )}
      </div>

      <div className="px-5 py-4 bg-background space-y-4">
        {/* Reasoning — full list, always visible */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Why this is a candidate
          </p>
          <ul className="space-y-2">
            {cause.matchReasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">
                  {i + 1}
                </div>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Service context from graph */}
        {node && (
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Owner:</span>
              <span>{node.owner}</span>
            </div>
            {(node.alertHistory.noisyRuleIds?.length ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <BellOff className="w-3 h-3 text-muted-foreground" />
                <span>{node.alertHistory.noisyRuleIds!.length} alert rule{node.alertHistory.noisyRuleIds!.length > 1 ? 's' : ''} on this service rarely correlate with real incidents</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-semibold">30-day alerts:</span>
              <span>{node.alertHistory.count30d}</span>
            </div>
          </div>
        )}

        {/* Confirm / Reject controls */}
        {confirmed === null ? (
          <div className="flex items-center gap-3 pt-1 border-t border-border">
            <p className="text-sm text-muted-foreground flex-1">Was this the cause of the incident?</p>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-success border-success/20 bg-success/5 hover:bg-success/20"
              onClick={() => onConfirm(true)}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Yes, this caused it
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-muted-foreground hover:bg-muted"
              onClick={() => onConfirm(false)}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              No, not this
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span className={cn('text-sm font-semibold', confirmed ? 'text-success' : 'text-muted-foreground')}>
              {confirmed
                ? '✓ Confirmed as root cause — thank you, this improves future correlations'
                : '✗ Ruled out — this deploy was not the cause'}
            </span>
            <button
              onClick={() => onConfirm(null)}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function IncidentInvestigationPage() {
  const params = useParams()
  const incidentId = params?.id as string

  const incident = INCIDENTS_DATA.find((i) => i.id === incidentId)

  if (!incident) {
    notFound()
  }

  // Track confirmed state per candidate
  const [causeState, setCauseState] = useState<Record<string, boolean | null>>(() => {
    const initial: Record<string, boolean | null> = {}
    incident.candidateCauses.forEach((c: CandidateCause) => {
      initial[c.deployId] = c.confirmed
    })
    return initial
  })

  const handleConfirm = (deployId: string, value: boolean | null) => {
    setCauseState((prev) => ({ ...prev, [deployId]: value }))
  }

  // Build dependency graph slice for this incident's primary service
  const primaryServiceId = incident.affectedServices[0] ?? ''
  const primaryNode = getNodeById(primaryServiceId)
  const upstreamIds = getUpstream(primaryServiceId)
  const downstreamIds = getDownstream(primaryServiceId)
  const graphSliceIds = [primaryServiceId, ...upstreamIds, ...downstreamIds]
  const graphSlice = graphSliceIds.map((id) => getNodeById(id)).filter(Boolean)

  const sev = severityConfig[incident.severity as keyof typeof severityConfig] ?? severityConfig.medium
  const stat = statusConfig[incident.status as keyof typeof statusConfig] ?? statusConfig.open

  const confirmedCount = Object.values(causeState).filter(v => v === true).length
  const pendingCount = incident.candidateCauses.filter(
    (c: CandidateCause) => causeState[c.deployId] === null
  ).length

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-muted/20 px-8 py-5">
        <div className="flex items-start gap-4">
          <Link
            href="/incidents"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            All Incidents
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <span className="text-sm font-mono text-muted-foreground">{incident.id}</span>
              <Badge variant="outline" className={cn('text-xs', sev.text)}>{sev.label}</Badge>
              <Badge variant="outline" className={cn('text-xs', stat.class)}>{stat.label}</Badge>
              {confirmedCount > 0 && (
                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20 gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {confirmedCount} cause confirmed
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-bold">{incident.title}</h1>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Main — Ranked Causal Candidates (primary real estate) */}
          <div className="xl:col-span-2 space-y-6">

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold">Duration</span>
                </div>
                <p className="text-xl font-bold">{incident.duration}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-semibold">Affected Users</span>
                </div>
                <p className="text-xl font-bold">{incident.impactedUsers.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-semibold">Candidates</span>
                </div>
                <p className="text-xl font-bold">
                  {pendingCount > 0 ? (
                    <span className="text-warning">{pendingCount} pending</span>
                  ) : (
                    <span className="text-success">All reviewed</span>
                  )}
                </p>
              </Card>
            </div>

            {/* Ranked candidate causes — the killer feature */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-5 h-5 text-warning" />
                <h2 className="text-lg font-semibold">Ranked Candidate Causes</h2>
                <Badge variant="outline" className="text-xs ml-auto">
                  {incident.candidateCauses.length} candidate{incident.candidateCauses.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {incident.candidateCauses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p>No candidates identified yet for this incident.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {incident.candidateCauses.map((cause: CandidateCause, i: number) => (
                    <CandidateRow
                      key={cause.deployId}
                      cause={cause}
                      rank={i}
                      localConfirmed={causeState[cause.deployId] ?? cause.confirmed}
                      onConfirm={(v) => handleConfirm(cause.deployId, v)}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Incident Timeline</h2>
              <div className="space-y-3">
                {incident.timeline.map((entry: { time: string; event: string }, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-xs font-mono text-muted-foreground w-12 flex-shrink-0 pt-0.5">
                      {entry.time}
                    </div>
                    <div className="flex items-start gap-2 flex-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div className="flex-1 pb-3 border-b border-border last:border-b-0">
                        <p className="text-sm">{entry.event}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right panel — dependency graph slice + meta */}
          <div className="space-y-5">

            {/* Graph slice for this incident */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Network className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Relevant Service Graph</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {primaryNode?.name ?? primaryServiceId} and its direct neighbors
              </p>

              <div className="space-y-2">
                {graphSlice.map((node) => {
                  if (!node) return null
                  const health = healthMock[node.id] ?? 'healthy'
                  const hcfg = healthConfig[health]
                  const isIncidentService = node.id === primaryServiceId
                  const noisyCount = node.alertHistory.noisyRuleIds?.length ?? 0

                  return (
                    <div
                      key={node.id}
                      className={cn(
                        'flex items-start gap-2.5 p-2.5 rounded-lg border',
                        isIncidentService ? cn(hcfg.bg, hcfg.border, 'border-2') : 'border-border bg-muted/20'
                      )}
                    >
                      <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1', hcfg.dot)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('text-xs font-semibold', isIncidentService && hcfg.text)}>
                            {node.name}
                          </span>
                          {isIncidentService && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0">incident service</Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{node.tier}</p>
                        {noisyCount > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <BellOff className="w-2.5 h-2.5 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">{noisyCount} noisy rule{noisyCount > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <Link
                href="/dependencies"
                className="block mt-4 text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
              >
                Full dependency graph →
              </Link>
            </Card>

            {/* Incident meta */}
            <Card className="p-5 space-y-3">
              <h3 className="font-semibold text-sm">Incident Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lead</span>
                  <span className="font-medium">{incident.lead}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Related alerts</span>
                  <span className="font-medium">{incident.relatedAlerts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Started</span>
                  <span className="font-medium">{incident.startTime}</span>
                </div>
              </div>
            </Card>

            {/* Related changes */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <GitCommitHorizontal className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Related Changes</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Candidates reference these deploys as likely causes
              </p>
              <div className="space-y-2">
                {incident.candidateCauses.map((c: CandidateCause) => {
                  const node = getNodeById(c.service)
                  return (
                    <div key={c.deployId} className="flex items-center gap-2 text-xs p-2 rounded border border-border">
                      <GitCommitHorizontal className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="font-mono text-muted-foreground">{c.deployId}</span>
                      <span className="flex-1 truncate">{node?.name ?? c.service}</span>
                      <Badge variant="outline" className="text-[10px]">{c.matchScore}</Badge>
                    </div>
                  )
                })}
              </div>
              <Link
                href="/recent-changes"
                className="block mt-3 text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
              >
                All recent changes →
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
