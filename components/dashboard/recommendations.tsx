'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchCode, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect, useMemo } from 'react'
import { useAppState } from '@/lib/hooks/use-app-state'
import { ScoreWithReasoning } from '@/components/score-with-reasoning'

interface PendingCandidate {
  incidentId: string
  incidentTitle: string
  incidentSeverity: 'critical' | 'high' | 'medium' | 'low'
  cause: any
  _localConfirmed: boolean | null
}

const severityConfig = {
  critical: { text: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20', label: 'Critical' },
  high: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', label: 'High' },
  medium: { text: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20', label: 'Medium' },
  low: { text: 'text-info', bg: 'bg-info/10', border: 'border-info/20', label: 'Low' },
} as const

export function Recommendations() {
  const { feedbackState, setFeedback } = useAppState()
  const [incidents, setIncidents] = useState<any[]>([])
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
        console.error("Failed to load recommendations data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Dynamically build candidates list from backend incidents syncing with global feedbackState context
  const candidates = useMemo(() => {
    const list: PendingCandidate[] = []
    for (const inc of incidents) {
      const topCauses = inc.candidateCauses || inc.candidate_causes || []
      for (const cause of topCauses) {
        const val = feedbackState[`${inc.id}::${cause.id}`] ?? cause.confirmed
        list.push({
          incidentId: inc.id,
          incidentTitle: inc.title,
          incidentSeverity: (inc.severity || 'medium').toLowerCase() as any,
          cause,
          _localConfirmed: val,
        })
      }
    }
    return list.sort((a, b) => b.cause.score - a.cause.score)
  }, [incidents, feedbackState])

  const pending = candidates.filter((c) => c._localConfirmed === null)
  const confirmedCount = candidates.filter((c) => c._localConfirmed === true).length
  const rejectedCount = candidates.filter((c) => c._localConfirmed === false).length

  const handleFeedback = (incidentId: string, causeId: string, value: boolean) => {
    setFeedback(incidentId, causeId, value)
  }

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
            <SearchCode className="w-5 h-5 text-primary" />
            Causal Candidate Review
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Ranked candidates awaiting human confirmation — your feedback improves future correlation
          </p>
        </div>
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
          {pending.length} pending
        </Badge>
      </div>

      {/* Feedback summary */}
      {(confirmedCount > 0 || rejectedCount > 0) && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/20 border border-border">
          {confirmedCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-success font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {confirmedCount} confirmed
            </div>
          )}
          {rejectedCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <ThumbsDown className="w-3 h-3" />
              {rejectedCount} ruled out
            </div>
          )}
        </div>
      )}

      {pending.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle2 className="w-8 h-8 mx-auto mb-3 opacity-20" />
          <p>All candidates reviewed.</p>
          <p className="text-sm">Check back after the next incident.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.slice(0, 4).map((item) => {
            const severityKey = (item.incidentSeverity || 'medium').toLowerCase() as keyof typeof severityConfig
            const sev = severityConfig[severityKey] || severityConfig.medium
            const repo = repos.find((r) => r.id === item.cause.repoId)
            const serviceName = repo?.name ?? 'Unknown Service'
            const reasons = typeof item.cause.reason === 'string' ? item.cause.reason.split(';').map((r: string) => r.trim()).filter(Boolean) : [item.cause.reason || '']

            return (
              <div
                key={`${item.incidentId}::${item.cause.id}`}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all border-border bg-card/60'
                )}
              >
                {/* Incident context */}
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle className={cn('w-4 h-4 flex-shrink-0 mt-0.5', sev.text)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-mono text-muted-foreground">{item.incidentId.substring(0, 8)}</span>
                      <Badge variant="outline" className={cn('text-xs', sev.text)}>{sev.label}</Badge>
                    </div>
                    <p className="font-semibold text-sm">{item.incidentTitle}</p>
                  </div>
                </div>

                {/* Candidate details */}
                <div className="ml-6 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-muted-foreground">Candidate cause:</span>
                    <span className="text-sm font-semibold">{serviceName}</span>
                    <span className="text-xs font-mono text-muted-foreground">{item.cause.eventId || item.cause.id.substring(0, 8)}</span>
                  </div>

                  {/* Consolidated Score + Reasoning block */}
                  <ScoreWithReasoning score={item.cause.score} reasons={reasons} />

                  {/* Binary confirm controls */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border/40">
                    <span className="text-xs text-muted-foreground flex-1">Was this the cause?</span>
                    <button
                      onClick={() => handleFeedback(item.incidentId, item.cause.id, true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Yes
                    </button>
                    <button
                      onClick={() => handleFeedback(item.incidentId, item.cause.id, false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-colors"
                    >
                      <ThumbsDown className="w-3 h-3" />
                      No
                    </button>
                    <Link
                      href={`/incidents/${item.incidentId}`}
                      className="px-3 py-1.5 rounded text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                    >
                      Investigate
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Link
        href="/incidents"
        className="block text-center w-full mt-6 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium"
      >
        View All Incidents →
      </Link>
    </Card>
  )
}
