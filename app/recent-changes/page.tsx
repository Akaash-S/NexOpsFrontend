'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Package, Settings, AlertTriangle, CheckCircle, AlertCircle, Flame, ChevronDown, ChevronUp, Search } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CHANGES_DATA } from '@/lib/mock-data'
import { getNodeById } from '@/lib/graph'

const typeConfig = {
  deployment: { icon: Package, label: 'Deployment', color: 'text-primary' },
  infrastructure: { icon: Settings, label: 'Infrastructure', color: 'text-accent' },
}

const impactConfig = {
  high: { label: 'High Impact', bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
  medium: { label: 'Medium Impact', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
  low: { label: 'Low Impact', bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
}

function RiskBar({ score }: { score: number }) {
  const color =
    score >= 70 ? 'bg-destructive' : score >= 40 ? 'bg-warning' : 'bg-success'
  const label =
    score >= 70 ? 'High' : score >= 40 ? 'Medium' : 'Low'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn('text-xs font-semibold w-14 text-right', score >= 70 ? 'text-destructive' : score >= 40 ? 'text-warning' : 'text-success')}>
        {score} — {label}
      </span>
    </div>
  )
}

function ChangeCard({ change }: { change: typeof CHANGES_DATA[0] }) {
  const [expanded, setExpanded] = useState(false)
  const TypeIcon = (typeConfig[change.type as keyof typeof typeConfig] ?? typeConfig.deployment).icon
  const typeColor = (typeConfig[change.type as keyof typeof typeConfig] ?? typeConfig.deployment).color
  const impact = impactConfig[change.impact as keyof typeof impactConfig] ?? impactConfig.medium
  const serviceNode = getNodeById(change.service)
  const blastRadius = (change as any).blastRadius

  const incidentBadge = change.incidents > 0 ? (
    <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20 gap-1">
      <AlertTriangle className="w-3 h-3" />
      {change.incidents} incident{change.incidents > 1 ? 's' : ''} linked
    </Badge>
  ) : null

  return (
    <Card className={cn('p-5 transition-all', change.incidents > 0 && 'border-destructive/30')}>
      {/* Header row */}
      <div className="flex items-start gap-3 mb-4">
        <div className={cn('mt-0.5 flex-shrink-0', typeColor)}>
          <TypeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-mono text-xs text-muted-foreground">{change.id}</span>
                <Badge variant="secondary" className="text-xs">{(change as any).serviceName || change.service}</Badge>
                <Badge variant="outline" className={cn('text-xs', impact.text, impact.border)}>
                  {impact.label}
                </Badge>
                {incidentBadge}
              </div>
              <p className="font-semibold text-sm">{(change as any).message}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {change.time} · by {(change as any).author || 'system'} · v{change.version || (change as any).version}
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

          {/* Risk Score — always shown with basis text */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Risk Score</p>
            <RiskBar score={blastRadius.riskScore} />
            <p className="text-xs text-muted-foreground mt-1.5 italic">{blastRadius.riskBasis}</p>
          </div>

          {/* Direct services — always visible */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">
              Direct services affected ({blastRadius.directServices.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {blastRadius.directServices.map((svc: string) => {
                const node = getNodeById(svc)
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
                  const node = getNodeById(svc)
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

      {/* Correlated incidents link */}
      {change.incidents > 0 && (
        <Link
          href="/incidents"
          className="flex items-center gap-2 mt-3 text-xs text-destructive hover:text-destructive/80 transition-colors"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          View linked incidents →
        </Link>
      )}
    </Card>
  )
}

export default function RecentChangesPage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('time')
  const [riskFilter, setRiskFilter] = useState('all')

  const changes = useMemo(() => {
    return CHANGES_DATA
      .filter((c) => {
        const matchesSearch =
          ((c as any).serviceName || c.service).toLowerCase().includes(search.toLowerCase()) ||
          ((c as any).message || '').toLowerCase().includes(search.toLowerCase()) ||
          c.id.toLowerCase().includes(search.toLowerCase())
        const br = (c as any).blastRadius
        let matchesRisk = true
        if (riskFilter === 'high') matchesRisk = br?.riskScore >= 70
        else if (riskFilter === 'medium') matchesRisk = br?.riskScore >= 40 && br?.riskScore < 70
        else if (riskFilter === 'low') matchesRisk = br?.riskScore < 40
        else if (riskFilter === 'incidents') matchesRisk = c.incidents > 0
        return matchesSearch && matchesRisk
      })
      .sort((a, b) => {
        if (sortBy === 'risk-desc') return ((b as any).blastRadius?.riskScore ?? 0) - ((a as any).blastRadius?.riskScore ?? 0)
        if (sortBy === 'risk-asc') return ((a as any).blastRadius?.riskScore ?? 0) - ((b as any).blastRadius?.riskScore ?? 0)
        if (sortBy === 'incidents') return b.incidents - a.incidents
        return 0 // time (default order from data)
      })
  }, [search, sortBy, riskFilter])

  const highRiskCount = CHANGES_DATA.filter((c) => (c as any).blastRadius?.riskScore >= 70).length
  const incidentLinked = CHANGES_DATA.filter((c) => c.incidents > 0).length
  const totalChanges = CHANGES_DATA.length

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
        {changes.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg">
            <CheckCircle className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p>No changes match your filters.</p>
          </div>
        ) : (
          changes.map((change) => <ChangeCard key={change.id} change={change} />)
        )}
      </div>
    </PageContent>
  )
}
