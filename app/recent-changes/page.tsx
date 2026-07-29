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
import { 
  Package, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  GitCommitHorizontal, 
  Loader2,
  Clock,
  GitBranch,
  User,
  ExternalLink,
  Layers,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  GitCommit
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ScoreWithReasoning } from '@/components/score-with-reasoning'

const impactConfig = {
  high: { 
    label: 'High Impact', 
    bg: 'bg-destructive/15 text-destructive border-destructive/30',
    dot: 'bg-destructive',
    borderLeft: 'border-l-destructive',
    glow: 'group-hover:shadow-destructive/10'
  },
  medium: { 
    label: 'Medium Impact', 
    bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
    borderLeft: 'border-l-amber-500',
    glow: 'group-hover:shadow-amber-500/10'
  },
  low: { 
    label: 'Low Impact', 
    bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
    borderLeft: 'border-l-emerald-500',
    glow: 'group-hover:shadow-emerald-500/10'
  },
} as const

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
  const impact = impactConfig[change.impact as keyof typeof impactConfig] ?? impactConfig.medium
  const blastRadius = change.blastRadius
  const riskScore = blastRadius?.riskScore ?? 0

  const env = (change.environment || change.env || 'production').toLowerCase()
  const isProduction = env.includes('prod') || env === 'production'

  const commitSha = change.commit_hash || change.commitHash || change.sha || change.id
  const shortSha = commitSha ? commitSha.substring(0, 7) : 'head'

  return (
    <Card 
      className={cn(
        'transition-all duration-300 relative overflow-hidden group border-border/60 bg-card/60 backdrop-blur-md hover:bg-card/90 hover:border-primary/40 shadow-sm hover:shadow-lg',
        'border-l-4', impact.borderLeft,
        isFailing && 'border-l-destructive border-destructive/40 bg-destructive/5'
      )}
    >
      <div className="p-5 space-y-4">
        {/* Top Meta Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Service Pill */}
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-2.5 py-1 text-xs font-semibold gap-1.5 rounded-md">
              <Layers className="w-3.5 h-3.5" />
              {change.serviceName}
            </Badge>

            {/* Environment Badge */}
            <Badge 
              variant="outline" 
              className={cn(
                'text-[11px] font-mono uppercase px-2 py-0.5 rounded-md border',
                isProduction 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              )}
            >
              <GitBranch className="w-3 h-3 inline mr-1" />
              {env}
            </Badge>

            {/* Impact Badge */}
            <Badge variant="outline" className={cn('text-[11px] font-medium px-2 py-0.5 rounded-md border gap-1', impact.bg)}>
              <span className={cn('w-1.5 h-1.5 rounded-full inline-block', impact.dot)} />
              {impact.label}
            </Badge>

            {/* Failed Badge */}
            {isFailing && (
              <Badge variant="outline" className="text-[11px] bg-destructive/15 text-destructive border-destructive/30 gap-1 font-semibold animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                Deployment Failed
              </Badge>
            )}
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono ml-auto">
            <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
            <span>{change.time}</span>
          </div>
        </div>

        {/* Change Detail Main Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Commit Message */}
            <h3 className="font-semibold text-base text-foreground tracking-tight leading-snug break-words">
              {change.message}
            </h3>

            {/* Commit Author & SHA Bar */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap pt-0.5">
              <div className="inline-flex items-center gap-1 bg-muted/40 hover:bg-muted/70 px-2 py-0.5 rounded text-mono font-mono text-[11px] text-foreground/80 border border-border/40 transition-colors">
                <GitCommit className="w-3 h-3 text-primary" />
                <span>{shortSha}</span>
              </div>

              <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="w-3.5 h-3.5 text-muted-foreground/70" />
                <span>by <strong className="text-foreground/90 font-medium">{change.author}</strong></span>
              </div>

              {change.version && (
                <span className="text-muted-foreground/70 font-mono text-[11px]">
                  v{change.version}
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions / Status Pill */}
          <div className="flex items-center gap-2 shrink-0">
            {change.incidents > 0 && (
              <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                1 Incident Linked
              </Badge>
            )}
          </div>
        </div>

        {/* Blast Radius Section */}
        {blastRadius && (
          <div className="bg-muted/20 rounded-xl p-4 border border-border/50 space-y-3.5 transition-all">
            {/* Blast Radius Bar Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Flame className={cn('w-4 h-4', riskScore >= 70 ? 'text-destructive animate-bounce' : 'text-amber-400')} />
                <span>Blast Radius Risk Engine</span>
              </div>

              <button
                type="button"
                className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 bg-background/50 hover:bg-background/80 px-2.5 py-1 rounded-md border border-border/40 transition-all"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Hide Details' : 'Expand Details'}
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Score with Reasoning component */}
            <ScoreWithReasoning
              label="Risk Score"
              score={blastRadius.riskScore}
              reasons={blastRadius.riskBasis}
              variant="risk"
            />

            {/* Direct Services List */}
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Directly Affected Services ({blastRadius.directServices.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {blastRadius.directServices.map((svc: string) => {
                  const node = topology.nodes.find((n: any) => n.id === svc)
                  return (
                    <Badge key={svc} variant="outline" className="text-xs gap-1 bg-background/60 border-border/70">
                      <Layers className="w-3 h-3 text-primary" />
                      {node?.name ?? svc}
                    </Badge>
                  )
                })}
                {blastRadius.directServices.length === 0 && (
                  <span className="text-xs text-muted-foreground/60 italic">None identified</span>
                )}
              </div>
            </div>

            {/* Downstream Expanded View */}
            {expanded && blastRadius.downstreamServices && blastRadius.downstreamServices.length > 0 && (
              <div className="pt-2 border-t border-border/30">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Downstream Services Affected ({blastRadius.downstreamServices.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {blastRadius.downstreamServices.map((svc: string) => {
                    const node = topology.nodes.find((n: any) => n.id === svc)
                    return (
                      <Badge key={svc} variant="secondary" className="text-xs gap-1 bg-muted/60">
                        {node?.name ?? svc}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
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
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setRefreshing(true)
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
      setRefreshing(false)
    }
  }

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
      
      const riskScore = dep.riskScore ?? 0.0
      const riskBasis = dep.riskBasis ? dep.riskBasis.split(", ") : []

      return {
        ...dep,
        serviceName,
        service: dep.repoId,
        message: dep.changelog || 'No deployment notes provided.',
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
          c.id.toLowerCase().includes(search.toLowerCase()) ||
          c.author.toLowerCase().includes(search.toLowerCase())
        
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading recent deployment changes...</div>
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
        <div className="flex items-center justify-center min-h-[50vh] border border-dashed border-border/60 rounded-2xl bg-card/30 p-8 mt-6">
          <EmptyState
            icon={<GitCommitHorizontal className="w-12 h-12 text-muted-foreground/60" />}
            title="No Recent Changes Recorded"
            description="No deployments or infrastructure changes detected yet. Deployments appear automatically when GitHub deployment events occur or when repositories are synced."
            action={
              <Button asChild className="rounded-lg">
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
      {/* Header with Refresh Control */}
      <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
        <PageHeader
          title="Recent Changes"
          description="Deploy and infrastructure change feed — with computed blast radius and historical incident correlation"
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadData}
          disabled={refreshing}
          className="rounded-lg gap-2 text-xs font-medium border-border/60 bg-card/50 hover:bg-card shrink-0"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin text-primary')} />
          {refreshing ? 'Syncing...' : 'Refresh Feed'}
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-5 bg-card/60 backdrop-blur-md border-border/60 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Changes</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-foreground">{totalChanges}</div>
          <div className="text-xs text-muted-foreground/80 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Recorded in change feed
          </div>
        </Card>

        <Card className="p-5 bg-card/60 backdrop-blur-md border-border/60 shadow-sm relative overflow-hidden group hover:border-destructive/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">High Risk Changes</span>
            <div className={cn('p-2 rounded-lg', highRiskCount > 0 ? 'bg-destructive/15 text-destructive' : 'bg-emerald-500/10 text-emerald-400')}>
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className={cn('text-3xl font-extrabold tracking-tight', highRiskCount > 0 ? 'text-destructive' : 'text-emerald-400')}>
            {highRiskCount}
          </div>
          <div className="text-xs text-muted-foreground/80 mt-1 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Risk score ≥ 70
          </div>
        </Card>

        <Card className="p-5 bg-card/60 backdrop-blur-md border-border/60 shadow-sm relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Incident Linked</span>
            <div className={cn('p-2 rounded-lg', incidentLinked > 0 ? 'bg-amber-500/15 text-amber-400' : 'bg-muted text-muted-foreground')}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={cn('text-3xl font-extrabold tracking-tight', incidentLinked > 0 ? 'text-amber-400' : 'text-foreground')}>
            {incidentLinked}
          </div>
          <div className="text-xs text-muted-foreground/80 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active incident correlation
          </div>
        </Card>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by service, commit message, author, or SHA..."
            className="pl-9 bg-card/50 border-border/60 focus:bg-card text-sm rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-48 bg-card/50 border-border/60 rounded-lg text-xs font-medium">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="high">High Risk (≥70)</SelectItem>
            <SelectItem value="medium">Medium Risk (40–69)</SelectItem>
            <SelectItem value="low">Low Risk (&lt;40)</SelectItem>
            <SelectItem value="incidents">Has Linked Incidents</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-44 bg-card/50 border-border/60 rounded-lg text-xs font-medium">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="time">Most Recent</SelectItem>
            <SelectItem value="risk-desc">Highest Risk First</SelectItem>
            <SelectItem value="risk-asc">Lowest Risk First</SelectItem>
            <SelectItem value="incidents">Incident Linked First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Change Feed Cards */}
      <div className="space-y-4">
        {filteredChanges.length === 0 ? (
          <div className="text-center py-16 px-6 text-muted-foreground border border-dashed border-border/60 rounded-xl bg-card/20 space-y-3">
            <CheckCircle2 className="w-10 h-10 mx-auto opacity-40 text-primary" />
            <h4 className="font-semibold text-base text-foreground">No Changes Match Your Filter</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search query or clearing risk filters to view all deployment events.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => { setSearch(''); setRiskFilter('all'); }}
              className="mt-2 text-xs rounded-lg"
            >
              Reset Filters
            </Button>
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
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <div className="text-sm font-medium text-muted-foreground animate-pulse">Loading recent deployment changes...</div>
        </div>
      </PageContent>
    }>
      <RecentChangesPageContent />
    </Suspense>
  )
}
