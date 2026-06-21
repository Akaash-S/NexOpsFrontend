'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { mockIncidents, CandidateCause } from '@/lib/mock-data'
import { getNodeById } from '@/lib/graph'

const severityConfig = {
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20', label: 'Critical' },
  high: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', label: 'High' },
  medium: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20', label: 'Medium' },
  low: { bg: 'bg-info/10', text: 'text-info', border: 'border-info/20', label: 'Low' },
}

const statusConfig = {
  investigating: { label: 'Investigating', class: 'bg-destructive/10 text-destructive border-destructive/20' },
  monitoring: { label: 'Monitoring', class: 'bg-warning/10 text-warning border-warning/20' },
  resolved: { label: 'Resolved', class: 'bg-success/10 text-success border-success/20' },
}

function calculateDuration(startedAt: string, endedAt?: string): string {
  const start = new Date(startedAt)
  const end = endedAt ? new Date(endedAt) : new Date()
  const diffMins = Math.round((end.getTime() - start.getTime()) / 60000)
  if (diffMins < 60) return `${diffMins}m`
  const hours = Math.floor(diffMins / 60)
  const mins = diffMins % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function CandidateCauseRow({
  cause,
  onConfirm,
}: {
  cause: CandidateCause & { _confirmed: boolean | null }
  onConfirm: (confirmed: boolean) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const node = getNodeById(cause.service)
  const serviceName = node?.name ?? cause.service

  const scoreColor =
    cause.matchScore >= 80 ? 'text-destructive' :
    cause.matchScore >= 60 ? 'text-warning' : 'text-muted-foreground'

  const confirmed = cause._confirmed

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Cause header row */}
      <button
        className="w-full flex items-center gap-3 px-3 py-2.5 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <Zap className={cn('w-3.5 h-3.5 flex-shrink-0', scoreColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{serviceName}</span>
            <Badge variant="outline" className={cn('text-xs font-mono', scoreColor)}>
              {cause.matchScore}/100
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">{cause.deployId}</span>
          </div>
          {/* Top reason — always visible */}
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{cause.matchReasons[0]}</p>
        </div>
        {confirmed === true && (
          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20 flex-shrink-0">✓ Confirmed</Badge>
        )}
        {confirmed === false && (
          <Badge variant="outline" className="text-xs bg-muted text-muted-foreground flex-shrink-0">✗ Not cause</Badge>
        )}
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
      </button>

      {/* Expanded reasoning + confirm controls */}
      {expanded && (
        <div className="px-3 py-3 border-t border-border bg-background space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Why this is a candidate</p>
            <ul className="space-y-1.5">
              {cause.matchReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-primary mt-0.5 flex-shrink-0">›</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Confirm / Reject controls */}
          {confirmed === null && (
            <div className="flex items-center gap-2 pt-1 border-t border-border">
              <span className="text-xs text-muted-foreground flex-1">Was this the cause?</span>
              <button
                onClick={() => onConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors"
              >
                <ThumbsUp className="w-3 h-3" />
                Yes
              </button>
              <button
                onClick={() => onConfirm(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-colors"
              >
                <ThumbsDown className="w-3 h-3" />
                No
              </button>
            </div>
          )}

          {confirmed !== null && (
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className={cn('text-xs font-semibold', confirmed ? 'text-success' : 'text-muted-foreground')}>
                {confirmed ? '✓ Marked as root cause' : '✗ Ruled out as cause'}
              </span>
              <button
                onClick={() => onConfirm(null as any)}
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
  const activeIncidents = mockIncidents.filter((i) => i.status !== 'resolved').slice(0, 3)
  const activeCount = mockIncidents.filter((i) => i.status !== 'resolved').length

  // Track per-incident per-cause confirmed state in local component state
  const [causeState, setCauseState] = useState<Record<string, boolean | null>>(() => {
    const initial: Record<string, boolean | null> = {}
    mockIncidents.forEach((inc) => {
      inc.candidateCauses.forEach((c) => {
        initial[`${inc.id}::${c.deployId}`] = c.confirmed
      })
    })
    return initial
  })

  const handleConfirm = (incidentId: string, deployId: string, value: boolean | null) => {
    setCauseState((prev) => ({
      ...prev,
      [`${incidentId}::${deployId}`]: value,
    }))
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
        {activeIncidents.map((incident) => {
          const sev = severityConfig[incident.severity]
          const stat = statusConfig[incident.status]
          const topCauses = incident.candidateCauses.slice(0, 3)

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
                    <span className="text-xs font-mono font-semibold text-muted-foreground">{incident.id}</span>
                    <Badge variant="outline" className={cn('text-xs', sev.text)}>{sev.label}</Badge>
                    <Badge variant="outline" className={cn('text-xs', stat.class)}>{stat.label}</Badge>
                  </div>
                  <p className="font-semibold">{incident.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{calculateDuration(incident.startedAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>{incident.affectedUsers.toLocaleString()} affected</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-xs">{incident.assignee}</span>
                </div>
              </div>

              {/* Candidate Causes */}
              {topCauses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Likely Causes</p>
                  {topCauses.map((cause) => (
                    <CandidateCauseRow
                      key={cause.deployId}
                      cause={{ ...cause, _confirmed: causeState[`${incident.id}::${cause.deployId}`] ?? cause.confirmed }}
                      onConfirm={(v) => handleConfirm(incident.id, cause.deployId, v)}
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
        })}
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
