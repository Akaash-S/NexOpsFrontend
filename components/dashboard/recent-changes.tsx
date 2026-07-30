'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Settings, AlertTriangle, Flame } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

const typeConfig = {
  deployment: { icon: Package, label: 'Deploy', color: 'text-primary' },
  infrastructure: { icon: Settings, label: 'Infra', color: 'text-accent' },
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

export function RecentChanges({ limit = 2 }: { limit?: number } = {}) {
  const [deployments, setDeployments] = useState<any[]>([])
  const [topology, setTopology] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        console.error("Failed to load recent changes data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  const displayChanges = deployments.slice(0, limit)

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Recent Changes</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Deploy and infra change feed with blast radius and historical risk
        </p>
      </div>

      <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1.5 scrollbar-thin">
        {displayChanges.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg border-border">
            No recent changes or deployments recorded.
          </div>
        ) : (
          displayChanges.map((change) => {
            const isFailing = change.status === 'failed'
            const repo = topology.nodes.find((n) => n.id === change.repoId)
            const serviceName = repo?.name || change.repoId
            
            // Calculate dynamic blast radius from live topology edges
            const directDependents = topology.edges
              .filter((e) => e.target === change.repoId || e.to === change.repoId)
              .map((e) => e.source || e.from)
            const allDownstream = getDownstreamDependents(change.repoId, topology.edges)
            
            const directCount = directDependents.length
            const downstreamCount = Math.max(0, allDownstream.length - directCount)
            
            // Risk calculation based on number of downstream services and failing status
            const riskScore = Math.min(100, (allDownstream.length * 20) + (isFailing ? 40 : 15))
            const riskBasis = allDownstream.length > 0
              ? `Impacts ${allDownstream.length} services downstream (direct & transitively) in the dependency tree.`
              : `Isolated service. Zero downstream dependencies affected.`

            const changeTimeStr = change.deployedAt
              ? new Date(change.deployedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'Just now'

            return (
              <div
                key={change.id}
                className={cn(
                  'p-4 rounded-lg border border-border hover:border-primary/50 transition-colors',
                  isFailing && 'border-destructive/30 hover:border-destructive/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('mt-0.5 flex-shrink-0', typeConfig.deployment.color)}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm">{serviceName}</span>
                      <span className="text-xs text-muted-foreground font-mono">{change.version}</span>
                      {isFailing && (
                        <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20 gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Deployment failed
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">{changeTimeStr}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{change.changelog || 'No deployment notes provided.'}</p>

                    {/* Direct services affected — always visible */}
                    {directCount > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">Affects:</span>
                        {directDependents.slice(0, 3).map((svcId: string) => {
                          const name = topology.nodes.find((n) => n.id === svcId)?.name ?? svcId
                          return (
                            <Badge key={svcId} variant="secondary" className="text-xs">
                              {name}
                            </Badge>
                          )
                        })}
                        {directCount > 3 && (
                          <span className="text-xs text-muted-foreground">+{directCount - 3} more</span>
                        )}
                        {downstreamCount > 0 && (
                          <span className="text-xs text-muted-foreground">
                            · {downstreamCount} downstream
                          </span>
                        )}
                      </div>
                    )}

                    {/* Risk score with basis text — always visible */}
                    <RiskPill score={riskScore} basis={riskBasis} />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <Link
        href="/recent-changes"
        className="block text-center w-full mt-6 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium"
      >
        View All Changes →
      </Link>
    </Card>
  )
}
