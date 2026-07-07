'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertTriangle,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronRight,
  Zap,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/hooks/use-app-state'
import { ScoreWithReasoning } from '@/components/score-with-reasoning'

const severityConfig = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20', label: 'Critical' },
  high: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', label: 'High' },
  medium: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20', label: 'Medium' },
  low: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/20', label: 'Low' },
} as const

const statusConfig = {
  investigating: { label: 'Investigating', class: 'bg-destructive/10 text-destructive border-destructive/20' },
  monitoring: { label: 'Monitoring', class: 'bg-warning/10 text-warning border-warning/20' },
  resolved: { label: 'Resolved', class: 'bg-success/10 text-success border-success/20' },
} as const

function calculateDuration(startedAt: string, endedAt?: string): string {
  const start = new Date(startedAt)
  const end = endedAt ? new Date(endedAt) : new Date()
  const diffMins = Math.round((end.getTime() - start.getTime()) / 60000)
  if (diffMins < 60) return `${diffMins}m`
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

interface CandidateCauseRowProps {
  cause: any
  onConfirm: (confirmed: boolean | null) => void
  repos: any[]
}

function CandidateCauseRow({ cause, onConfirm, repos }: CandidateCauseRowProps) {
  const [expanded, setExpanded] = useState(false)
  const repo = repos.find((r) => r.id === cause.repoId)
  const serviceName = repo?.name ?? 'Unknown Service'

  const scoreColor =
    cause.score >= 80 ? 'text-destructive' :
    cause.score >= 60 ? 'text-warning' : 'text-muted-foreground'

  const confirmed = cause._confirmed
  const reasons = typeof cause.reason === 'string' ? cause.reason.split(';').map((r: string) => r.trim()).filter(Boolean) : [cause.reason || '']

  return (
    <div className={cn(
      "rounded border p-3 bg-background/50 hover:bg-background/80 transition-colors",
      confirmed === true ? 'border-success/40 bg-success/5' :
      confirmed === false ? 'opacity-65 border-border bg-muted/5' : 'border-border'
    )}>
      <div className="flex items-start justify-between gap-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="min-w-0">
          <p className="text-xs font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-warning" />
            {serviceName}
            <span className="text-[10px] text-muted-foreground font-mono">{cause.eventId || cause.id.substring(0, 8)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn('text-xs font-mono font-bold', scoreColor)}>
            {Math.round(cause.score)}% match
          </Badge>
          {expanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
      </div>

      {/* Render reasoning inline by default */}
      <div className="mt-2.5">
        <ScoreWithReasoning score={cause.score} reasons={reasons} />
      </div>

      {expanded && (
        <div className="mt-3 space-y-3">

          {/* Confirm / Reject controls */}
          {confirmed === null && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
              <span className="text-xs text-muted-foreground flex-1">Was this the cause?</span>
              <button
                onClick={() => onConfirm(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                Yes
              </button>
              <button
                onClick={() => onConfirm(false)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-colors"
              >
                <ThumbsDown className="w-3 h-3" />
                No
              </button>
            </div>
          )}

          {confirmed !== null && (
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <span className={cn('text-xs font-semibold', confirmed ? 'text-success' : 'text-muted-foreground')}>
                {confirmed ? '✓ Confirmed as root cause' : '✗ Ruled out as cause'}
              </span>
              <button
                onClick={() => onConfirm(null)}
                className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Undo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ActiveIncidents() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { feedbackState, setFeedback } = useAppState()

  useEffect(() => {
    async function loadData() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const [incidentsData, reposData] = await Promise.all([
          apiFetch('/incidents'),
          apiFetch('/repos')
        ])
        setIncidents(incidentsData)
        setRepos(reposData)
      } catch (err) {
        console.error("Failed to load active incidents data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved').slice(0, 3)
  const activeCount = incidents.filter((i) => i.status !== 'resolved').length

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Active Incidents
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {activeCount} active — ranked candidate causes shown per incident
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {activeIncidents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg border-border">
            No active incidents. Systems are stable.
          </div>
        ) : (
          activeIncidents.map((incident) => {
            const severityKey = (incident.severity || 'medium').toLowerCase() as keyof typeof severityConfig
            const statusKey = (incident.status || 'investigating').toLowerCase() as keyof typeof statusConfig
            const sev = severityConfig[severityKey] || severityConfig.medium
            const stat = statusConfig[statusKey] || statusConfig.investigating
            const topCauses = (incident.candidateCauses || incident.candidate_causes || []).slice(0, 3)
            
            // Derive service name from root cause repo or first candidate cause
            const incidentRepo = repos.find(r => r.id === incident.rootCauseRepoId)
            const serviceDisplay = incidentRepo?.name || (topCauses[0] ? (repos.find(r => r.id === topCauses[0].repoId)?.name) : null) || 'Platform'

            return (
              <div
                key={incident.id}
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  sev.bg,
                  sev.border
                )}
              >
                {/* Incident header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono font-semibold text-muted-foreground">{incident.id.substring(0, 8)}</span>
                      <Badge variant="outline" className={cn('text-xs', sev.text)}>{sev.label}</Badge>
                      <Badge variant="outline" className={cn('text-xs', stat.class)}>{stat.label}</Badge>
                    </div>
                    <p className="font-semibold">{incident.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{calculateDuration(incident.startedAt || incident.started_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>{(incident.affectedUsers || incident.affected_users || 0).toLocaleString()} affected</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-xs">{serviceDisplay}</span>
                  </div>
                </div>

                {/* Candidate Causes */}
                {topCauses.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Likely Causes</p>
                    {topCauses.map((cause: any) => (
                      <CandidateCauseRow
                        key={cause.id}
                        cause={{ ...cause, repoId: cause.repoId, _confirmed: feedbackState[`${incident.id}::${cause.id}`] ?? cause.confirmed }}
                        onConfirm={(v) => setFeedback(incident.id, cause.id, v)}
                        repos={repos}
                      />
                    ))}
                  </div>
                )}

                <Link
                  href={`/incidents/${incident.id}`}
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Investigate full detail →
                </Link>
              </div>
            )
          })
        )}
      </div>

      <Link
        href="/incidents"
        className="block text-center w-full mt-6 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium"
      >
        View All Incidents →
      </Link>
    </Card>
  )
}
