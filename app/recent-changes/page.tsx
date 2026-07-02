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

  return (
    <Card className={cn('p-5 transition-all', isFailing && 'border-destructive/30')}>
      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        <div className={cn('mt-0.5 flex-shrink-0', typeColor)}>
          <TypeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">{change.id.substring(0, 8)}</span>
                <Badge variant="secondary" className="text-xs">{change.serviceName}</Badge>
                <Badge variant="outline" className={cn('text-xs', impact.text, impact.border)}>
                  {impact.label}
                </Badge>
                {incidentBadge}
              </div>
              <p className="font-semibold text-sm">{change.message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {change.time} · by {change.author} · v{change.version}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blast Radius — always visible */}
      {blastRadius && (
        <div className="bg-muted/30 rounded-lg p-4 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <Flame className="w-4 h-4 text-warning" />
              Blast Radius
            </div>
            <button
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? 'Less' : 'Detail'}
            </button>
          </div>

          {/* Risk Score */}
          <ScoreWithReasoning
            label="Risk Score"
            score={blastRadius.riskScore}
            reasons={blastRadius.riskBasis}
            variant="risk"
          />

          {/* Direct services — always visible */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">
              Direct services affected ({blastRadius.directServices.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {blastRadius.directServices.map((svc: string) => {
                const node = topology.nodes.find((n: any) => n.id === svc)
                return (
                  <Badge key={svc} variant="outline" className="text-xs gap-1">
                    {node?.name ?? svc}
                  </Badge>
                )
              })}
              {blastRadius.directServices.length === 0 && (
                <span className="text-xs text-muted-foreground">None identified</span>
              )}
            </div>
          </div>

          {/* Downstream — expanded detail */}
          {expanded && blastRadius.downstreamServices.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">
                Downstream services ({blastRadius.downstreamServices.length})
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
      
      const riskScore = Math.min(100, (allDownstream.length * 20) + (isFailing ? 40 : 15))
      const riskBasis = allDownstream.length > 0
        ? `Impacts ${allDownstream.length} services downstream (direct & transitively) in the dependency tree.`
        : `Isolated service. Zero downstream dependencies affected.`

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
          riskBasis: [riskBasis],
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
            title="No Recent Changes"
            description="No deployments or infrastructure changes have been recorded. Integrate your CI/CD pipeline to track revisions."
            action={
              <Button asChild>
                <Link href="/settings?tab=workspace">Setup Deployment Tracking</Link>
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
          <div className="text-xs text-muted-foreground mt-1">Last 24 hours</div>
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

