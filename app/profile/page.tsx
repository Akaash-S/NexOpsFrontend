'use client'

import { useAppState } from '@/lib/hooks/use-app-state'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageContent, PageHeader } from '@/components/layout'
import { useState, useEffect, useMemo } from 'react'
import { User, Bell, Network, CheckCircle2, AlertTriangle, ThumbsUp, ThumbsDown, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const { currentUser, feedbackState } = useAppState()
  const [repos, setRepos] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const [reposData, incidentsData] = await Promise.all([
          apiFetch('/repos'),
          apiFetch('/incidents')
        ])

        const enrichedRepos = reposData.map((repo: any) => {
          const nameLower = repo.name.toLowerCase()
          let tier = 'service'
          if (nameLower.includes('gateway') || nameLower.includes('frontend')) {
            tier = 'ingress'
          } else if (nameLower.includes('database') || nameLower.includes('db') || nameLower.includes('redis') || nameLower.includes('cache') || nameLower.includes('queue') || nameLower.includes('kafka') || nameLower.includes('terraform')) {
            tier = 'data'
          }
          return {
            ...repo,
            tier,
            alertHistory: {
              count30d: repo.vulnerabilities ? repo.vulnerabilities + 2 : 2
            }
          }
        })

        setRepos(enrichedRepos)
        setIncidents(incidentsData)
      } catch (err) {
        console.error("Failed to load profile data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Derived user team: Akaash S/John Doe is on @team-payments (primary) and @team-platform (secondary)
  const userTeams = ['@team-payments', '@team-platform']

  // Dynamically resolve owned services based on repository owners
  const ownedServices = useMemo(() => {
    return repos.filter((repo) => 
      userTeams.some((team) => (repo.owner || '').toLowerCase().includes(team.toLowerCase()))
    )
  }, [repos])

  // Map global feedbackState to a readable history list
  const triageHistory = useMemo(() => {
    return Object.entries(feedbackState)
      .filter(([_, value]) => value !== null)
      .map(([key, value]) => {
        const [incidentId, causeId] = key.split('::')
        const incident = incidents.find((inc) => inc.id === incidentId)
        
        // Find the cause details
        const cause = (incident?.candidateCauses || incident?.candidate_causes || []).find((c: any) => c.id === causeId)
        const repo = cause ? repos.find((r) => r.id === cause.repoId) : null

        return {
          incidentId,
          incidentTitle: incident?.title ?? 'Unknown Incident',
          incidentSeverity: incident?.severity ?? 'medium',
          deployId: cause?.eventId || causeId,
          serviceId: cause?.repoId ?? 'unknown',
          serviceName: repo?.name ?? 'Unknown Service',
          confirmed: value === true,
          causeScore: cause?.score ?? 0,
        }
      })
  }, [feedbackState, incidents, repos])

  const severityConfig = {
    critical: { class: 'bg-destructive/10 text-destructive border-destructive/20' },
    high: { class: 'bg-warning/10 text-warning border-warning/20' },
    medium: { class: 'bg-accent/10 text-accent border-accent/20' },
    low: { class: 'bg-info/10 text-info border-info/20' },
  } as const

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="User Profile"
          description="Personal workspace — manage your service ownership, alert triage history, and notification settings"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <PageHeader
        title="User Profile"
        description="Personal workspace — manage your service ownership, alert triage history, and notification settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Identity & Ownership */}
        <div className="space-y-6">
          {/* Identity Basics Card */}
          <Card className="p-6 border border-border bg-card">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentUser?.name ?? 'John Doe'}</h2>
                <p className="text-sm text-muted-foreground">{currentUser?.email ?? 'john.doe@nexops.internal'}</p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                  <Badge variant="secondary" className="text-xs">Senior Staff Engineer</Badge>
                  <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">@team-payments</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Owned Services Card */}
          <Card className="p-6 border border-border bg-card space-y-4">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Services You Own</h3>
              <Badge variant="outline" className="ml-auto">{ownedServices.length}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Ownership is auto-derived from active GitHub <code>CODEOWNERS</code>.
            </p>
            <div className="space-y-2">
              {ownedServices.map((svc) => (
                <div key={svc.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{svc.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{svc.id} · {svc.tier}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] bg-success/10 text-success border-success/20 border">
                    {svc.alertHistory.count30d} Alerts (30d)
                  </Badge>
                </div>
              ))}
              {ownedServices.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No services owned by your teams.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Triage History & Actions (2/3 wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Triage History Feed */}
          <Card className="p-6 border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Your Alert Triage History
              </h3>
              <Badge variant="outline">{triageHistory.length} actions</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Actions you have taken on the correlation engine's candidate cause reviews. Your confirmations help train future correlation patterns.
            </p>

            <div className="space-y-3">
              {triageHistory.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-border/80 bg-muted/10 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{item.incidentId}</span>
                        <Badge variant="outline" className={cn('text-[10px]', severityConfig[item.incidentSeverity as keyof typeof severityConfig]?.class)}>
                          {item.incidentSeverity}
                        </Badge>
                        {item.confirmed ? (
                          <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20 gap-0.5">
                            <ThumbsUp className="w-2.5 h-2.5" />
                            Confirmed cause
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground border-border gap-0.5">
                            <ThumbsDown className="w-2.5 h-2.5" />
                            Ruled out
                          </Badge>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold">{item.incidentTitle}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2.5 border-t border-border/40 text-xs">
                    <span className="text-muted-foreground">Candidate:</span>
                    <span className="font-semibold">{item.serviceName}</span>
                    <span className="text-muted-foreground font-mono">({item.deployId})</span>
                    <span className="text-muted-foreground ml-auto">Correlation Score: <strong className="font-bold text-foreground font-mono">{item.causeScore}/100</strong></span>
                  </div>
                </div>
              ))}

              {triageHistory.length === 0 && (
                <div className="text-center py-12 border border-dashed border-border/80 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">No triage actions yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    When you confirm or reject causal candidates on the Dashboard or Incident pages, your feedback logs will appear here.
                  </p>
                  <Link href="/dashboard" className="inline-block mt-4">
                    <Button size="sm" className="gap-1.5">
                      Go to Dashboard
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>

          {/* Scoped Preferences Quicklink */}
          <Card className="p-6 border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Notification Scoping
              </h3>
              <p className="text-xs text-muted-foreground">
                Set up per-channel alert delivery preferences specifically for your owned and watched services.
              </p>
            </div>
            <Link href="/settings?tab=notifications">
              <Button variant="outline" size="sm" className="gap-1.5 flex-shrink-0">
                Configure notifications
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
        </div>

      </div>
    </PageContent>
  )
}
