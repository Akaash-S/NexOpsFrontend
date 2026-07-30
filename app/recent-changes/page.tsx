'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { PageContent, PageHeader, EmptyState } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Package, Settings, AlertTriangle, CheckCircle, AlertCircle, Flame, ChevronDown, ChevronUp, Search, GitCommitHorizontal, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ScoreWithReasoning } from '@/components/score-with-reasoning'

const typeConfig = {
  deployment: { icon: Package, label: 'Deployment', color: 'text-primary' },
  infrastructure: { icon: Settings, label: 'Infrastructure', color: 'text-accent' },
} as const

const impactConfig = {
  high: { label: 'High Impact', bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
  medium: { label: 'Medium Impact', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
  low: { label: 'Low Impact', bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
} as const

function RiskPill({ score, basis }: { score: number; basis: string }) {
  const color =
    score >= 70 ? 'bg-destructive/10 text-destructive border-destructive/20' :
    score >= 40 ? 'bg-warning/10 text-warning border-warning/20' :
    'bg-success/10 text-success border-success/20'
  const label = score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'

  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      <div className="flex items-center gap-2 mb-1.5">
        <Flame className="w-3.5 h-3.5 text-warning flex-shrink-0" />
        <span className="text-xs font-semibold text-muted-foreground">Blast Radius</span>
        <Badge variant="outline" className={cn('text-xs ml-auto', color)}>
          {score} — {label} Risk
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground italic">{basis}</p>
    </div>
  )
}

function getDownstreamDependents(nodeId: string, edges: any[]): string[] {
  const visited = new Set<string>()
  function traverse(id: string) {
    const downstream = edges
      .filter((e) => e.target === id || e.to === id)
      .map((e) => e.source || e.from)
    for (const dep of downstream) {
      if (dep && !visited.has(dep)) {
        visited.add(dep)
        traverse(dep)
      }
    }
  }
  traverse(nodeId)
  return [...visited]
}

function ChangeCard({ change, topology }: { change: any; topology: any }) {
  const [expanded, setExpanded] = useState(false)
  const isFailing = change.status === 'failed'
  const TypeIcon = Package
  const typeColor = typeConfig.deployment.color
  const impact = impactConfig[change.impact as keyof typeof impactConfig] ?? impactConfig.medium
  const blastRadius = change.blastRadius

  const incidentBadge = isFailing ? (
    <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20 gap-1">
      <AlertTriangle className="w-3 h-3" />
      Deployment failed
    </Badge>
  ) : null

  const rawSha = change.commitHash || change.commit_hash || change.id || ''
  const displaySha = rawSha.length > 7 ? rawSha.substring(0, 7) : rawSha
  const envName = change.environment || 'production'

  return (
    <Card className={cn('p-5 transition-all hover:border-border/80', isFailing && 'border-destructive/30 bg-destructive/5')}>
      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        <div className={cn('mt-0.5 flex-shrink-0 p-2 rounded-lg bg-secondary/50', typeColor)}>
          <TypeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <Badge variant="secondary" className="text-xs font-semibold">{change.serviceName}</Badge>
                <Badge variant="outline" className="text-xs font-mono uppercase bg-muted/40">
                  {envName}
                </Badge>
                <Badge variant="outline" className={cn('text-xs font-medium', impact.text, impact.border)}>
                  {impact.label}
                </Badge>
                {incidentBadge}
              </div>
              <p className="font-semibold text-base text-foreground leading-snug">{change.message}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                <span>{change.time}</span>
                <span>·</span>
                <span>by <strong className="text-foreground font-medium">{change.author}</strong></span>
                {change.version && (
                  <>
                    <span>·</span>
                    <span className="font-mono">v{change.version}</span>
                  </>
                )}
              </p>
            </div>
            
            {/* Main Details / Less Toggle Button */}
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border shadow-sm shrink-0',
                expanded 
                  ? 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80' 
                  : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
              )}
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Details</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Blast Radius Section */}
      {blastRadius && (
        <div className="bg-muted/20 rounded-lg p-4 border border-border/60 space-y-3 mt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Flame className="w-4 h-4 text-warning" />
              Blast Radius Analysis
            </div>
          </div>

          {/* Primary Risk Score Bar */}
          <ScoreWithReasoning
            label="Risk Score"
            score={blastRadius.riskScore}
            reasons={blastRadius.riskBasis}
            variant="risk"
          />

          {/* Direct services affected */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5 font-medium">
              Direct services affected ({blastRadius.directServices.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {blastRadius.directServices.map((svc: string) => {
                const node = topology.nodes.find((n: any) => n.id === svc)
                return (
                  <Badge key={svc} variant="outline" className="text-xs bg-background/60 gap-1">
                    {node?.name ?? svc}
                  </Badge>
                )
              })}
              {blastRadius.directServices.length === 0 && (
                <span className="text-xs text-muted-foreground/70 italic">None identified</span>
              )}
            </div>
          </div>

          {/* Expanded Drawer Details */}
          {expanded && (
            <div className="pt-3 border-t border-border/40 space-y-3.5 animate-in fade-in-50 duration-200">
              {/* Downstream Services */}
              <div>
                <p className="text-xs text-muted-foreground mb-1.5 font-medium">
                  Downstream services affected ({blastRadius.downstreamServices.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {blastRadius.downstreamServices.map((svc: string) => {
                    const node = topology.nodes.find((n: any) => n.id === svc)
                    return (
                      <Badge key={svc} variant="secondary" className="text-xs">
                        {node?.name ?? svc}
                      </Badge>
                    )
                  })}
                  {blastRadius.downstreamServices.length === 0 && (
                    <span className="text-xs text-muted-foreground/70 italic">No downstream services impacted</span>
                  )}
                </div>
              </div>

              {/* Extended Deployment Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-md bg-background/50 border border-border/40 text-xs">
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono mb-0.5 truncate">Commit SHA</span>
                  <span className="font-mono font-medium text-foreground truncate block" title={rawSha}>{displaySha}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono mb-0.5 truncate">Environment</span>
                  <span className="font-medium text-foreground capitalize truncate block" title={envName}>{envName}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono mb-0.5 truncate">Status</span>
                  <span className={cn("font-semibold capitalize truncate block", isFailing ? "text-destructive" : "text-success")}>
                    {change.status || 'success'}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-muted-foreground block text-[10px] uppercase font-mono mb-0.5 truncate">Triggered By</span>
                  <span className="font-medium text-foreground truncate block" title={change.author}>{change.author}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

function RecentChangesPageContent() {
  const searchParams = useSearchParams()
  const isEmpty = searchParams?.get('empty') === 'true'
  const [search, setSearch] = useState(searchParams?.get('search') || '')
  const [sortBy, setSortBy] = useState('time')
  const [riskFilter, setRiskFilter] = useState('all')

  const [deployments, setDeployments] = useState<any[]>([])
  const [topology, setTopology] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const searchVal = searchParams?.get('search')
    if (searchVal) {
      setSearch(searchVal)
    }
  }, [searchParams])

  useEffect(() => {
    if (isEmpty) {
      setLoading(false)
      return
    }

    async function loadData() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const [deploymentsData, topologyData] = await Promise.all([
          apiFetch('/deployments'),
          apiFetch('/dependencies/topology')
        ])
        setDeployments(deploymentsData)
        setTopology(topologyData)
      } catch (err) {
        console.error("Failed to load recent changes:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [isEmpty])

  const decoratedDeployments = useMemo(() => {
    return deployments.map((dep) => {
      const isFailing = dep.status === 'failed'
      const repo = topology.nodes.find((n) => n.id === dep.repoId)
      const serviceName = repo?.name || dep.repoId
      
      const directDependents = topology.edges
        .filter((e) => e.target === dep.repoId || e.to === dep.repoId)
        .map((e) => e.source || e.from)
      const allDownstream = getDownstreamDependents(dep.repoId, topology.edges)
      
      const directCount = directDependents.length
      
      const riskScore = dep.riskScore ?? 0.0
      const riskBasis = dep.riskBasis ? dep.riskBasis.split(", ") : []

      return {
        ...dep,
        serviceName,
        service: dep.repoId,
        message: dep.changelog || 'No deployment notes.',
        time: dep.deployedAt ? new Date(dep.deployedAt).toLocaleString() : 'Just now',
        author: dep.deployedBy || 'system',
        incidents: isFailing ? 1 : 0,
        type: 'deployment',
        impact: riskScore >= 70 ? 'high' : (riskScore >= 40 ? 'medium' : 'low'),
        blastRadius: {
          riskScore,
          riskBasis,
          directServices: directDependents,
          downstreamServices: allDownstream.filter(id => !directDependents.includes(id))
        }
      }
    })
  }, [deployments, topology])

  const filteredChanges = useMemo(() => {
    return decoratedDeployments
      .filter((c) => {
        const matchesSearch =
          c.serviceName.toLowerCase().includes(search.toLowerCase()) ||
          c.message.toLowerCase().includes(search.toLowerCase()) ||
          c.id.toLowerCase().includes(search.toLowerCase())
        
        let matchesRisk = true
        if (riskFilter === 'high') matchesRisk = c.blastRadius.riskScore >= 70
        else if (riskFilter === 'medium') matchesRisk = c.blastRadius.riskScore >= 40 && c.blastRadius.riskScore < 70
        else if (riskFilter === 'low') matchesRisk = c.blastRadius.riskScore < 40
        else if (riskFilter === 'incidents') matchesRisk = c.incidents > 0
        return matchesSearch && matchesRisk
      })
      .sort((a, b) => {
        if (sortBy === 'risk-desc') return b.blastRadius.riskScore - a.blastRadius.riskScore
        if (sortBy === 'risk-asc') return a.blastRadius.riskScore - b.blastRadius.riskScore
        if (sortBy === 'incidents') return b.incidents - a.incidents
        return 0
      })
  }, [decoratedDeployments, search, sortBy, riskFilter])

  if (loading) {
    return (
      <PageContent>
        <PageHeader
          title="Recent Changes"
          description="Deploy and infrastructure change feed — with computed blast radius and historical incident correlation"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </PageContent>
    )
  }

  if (deployments.length === 0) {
    return (
      <PageContent>
        <PageHeader
          title="Recent Changes"
          description="Deploy and infrastructure change feed — with computed blast radius and historical incident correlation"
        />
        <div className="flex items-center justify-center min-h-[50vh] border border-dashed border-border rounded-xl bg-card/20 p-8 mt-6">
          <EmptyState
            icon={<GitCommitHorizontal className="w-12 h-12 text-muted-foreground/60" />}
            title="No Recent Changes Recorded"
            description="No deployments or infrastructure changes detected yet. Deployments appear automatically when GitHub deployment events occur or when repositories are synced."
            action={
              <Button asChild>
                <Link href="/integrations">Manage GitHub Integration</Link>
              </Button>
            }
          />
        </div>
      </PageContent>
    )
  }

  const highRiskCount = decoratedDeployments.filter((c) => c.blastRadius.riskScore >= 70).length
  const incidentLinked = decoratedDeployments.filter((c) => c.incidents > 0).length
  const totalChanges = decoratedDeployments.length

  return (
    <PageContent>
      <PageHeader
        title="Recent Changes"
        description="Deploy and infrastructure change feed — with computed blast radius and historical incident correlation"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Changes</div>
          <div className="text-2xl font-bold">{totalChanges}</div>
          <div className="text-xs text-muted-foreground mt-1">Total recorded deployments</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">High Risk</div>
          <div className={cn('text-2xl font-bold', highRiskCount > 0 ? 'text-destructive' : 'text-success')}>
            {highRiskCount}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Risk score ≥ 70</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Linked to Incidents</div>
          <div className={cn('text-2xl font-bold', incidentLinked > 0 ? 'text-warning' : '')}>
            {incidentLinked}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Changes with active incident</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search service, change..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risk levels</SelectItem>
            <SelectItem value="high">High risk (≥70)</SelectItem>
            <SelectItem value="medium">Medium risk (40–69)</SelectItem>
            <SelectItem value="low">Low risk (&lt;40)</SelectItem>
            <SelectItem value="incidents">Has linked incidents</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="time">Most recent</SelectItem>
            <SelectItem value="risk-desc">Highest risk first</SelectItem>
            <SelectItem value="risk-asc">Lowest risk first</SelectItem>
            <SelectItem value="incidents">Incident-linked first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Change Feed */}
      <div className="space-y-4">
        {filteredChanges.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg">
            <CheckCircle className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No changes match your filters.</p>
          </div>
        ) : (
          filteredChanges.map((change) => <ChangeCard key={change.id} change={change} topology={topology} />)
        )}
      </div>
    </PageContent>
  )
}

export default function RecentChangesPage() {
  return (
    <Suspense fallback={
      <PageContent>
        <PageHeader
          title="Recent Changes"
          description="Deploy and infrastructure change feed — with computed blast radius and historical incident correlation"
        />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-sm text-muted-foreground animate-pulse">Loading changes...</div>
        </div>
      </PageContent>
    }>
      <RecentChangesPageContent />
    </Suspense>
  )
}

