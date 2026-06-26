'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network, BellOff, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ServiceNode {
  id: string
  name: string
  tier: 'ingress' | 'service' | 'data'
  owner: string
  healthScore: number
  ciStatus: string
  openIssues: number
  vulnerabilities: number
  activity: number
}

interface DependencyEdge {
  id: string
  source: string
  target: string
  label: string
  isBroken: boolean
}

const healthConfig = {
  healthy: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
  critical: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30', dot: 'bg-destructive' },
} as const

const tierLabels = {
  ingress: 'Ingress',
  service: 'Services',
  data: 'Data',
} as const

function ServiceNodeCard({ node, edges }: { node: ServiceNode; edges: DependencyEdge[] }) {
  const downstreamCount = edges.filter((e) => e.target === node.id).length
  
  const health = node.ciStatus === 'failing' ? 'critical' : (node.healthScore < 80 ? 'warning' : 'healthy')
  const cfg = healthConfig[health]
  const noisyCount = node.vulnerabilities

  return (
    <div
      className={cn(
        'px-3 py-2.5 rounded-lg border-2 transition-colors cursor-default max-w-full',
        cfg.bg,
        cfg.border
      )}
    >
      <div className="min-w-0 space-y-1">
        <div className="flex items-start gap-1.5 min-w-0">
          <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5', cfg.dot)} />
          <span className="font-semibold text-xs leading-tight truncate">{node.name}</span>
        </div>
        {downstreamCount > 0 && (
          <p className="text-[10px] text-muted-foreground leading-normal">{downstreamCount} upstream dependent{downstreamCount !== 1 ? 's' : ''}</p>
        )}
        {/* Vulnerability badge */}
        {noisyCount > 0 && (
          <div className="pt-0.5">
            <Badge
              variant="outline"
              className="text-[9px] px-1.5 py-0.5 bg-muted/50 text-muted-foreground border-border flex items-center gap-0.5 w-fit"
            >
              <AlertTriangle className="w-2.5 h-2.5 text-warning" />
              {noisyCount} vuln
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}

export function ImpactMap() {
  const [topology, setTopology] = useState<{ nodes: ServiceNode[]; edges: DependencyEdge[] }>({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const data = await apiFetch('/dependencies/topology')
        
        // Enrich backend nodes with derived tier
        const enrichedNodes = data.nodes.map((node: any) => {
          const nameLower = node.name.toLowerCase()
          let tier: 'ingress' | 'service' | 'data' = 'service'
          if (nameLower.includes('gateway') || nameLower.includes('frontend')) {
            tier = 'ingress'
          } else if (nameLower.includes('database') || nameLower.includes('db') || nameLower.includes('redis') || nameLower.includes('cache') || nameLower.includes('queue') || nameLower.includes('kafka') || nameLower.includes('terraform')) {
            tier = 'data'
          }
          return {
            id: node.id,
            name: node.name,
            tier,
            owner: node.owner || '@team-platform',
            healthScore: node.healthScore || 100,
            ciStatus: node.ciStatus || 'passing',
            openIssues: node.openIssues || 0,
            vulnerabilities: node.vulnerabilities || 0,
            activity: node.activity || 0
          }
        })
        
        setTopology({ nodes: enrichedNodes, edges: data.edges || [] })
      } catch (err) {
        console.error("Failed to load dependency graph:", err)
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

  const tiers = ['ingress', 'service', 'data'] as const

  const criticalNodes = topology.nodes.filter((n) => n.ciStatus === 'failing')
  const warningNodes = topology.nodes.filter((n) => n.ciStatus !== 'failing' && n.healthScore < 80)
  const noisyServiceCount = topology.nodes.filter((n) => n.vulnerabilities > 0).length

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Network className="w-5 h-5" />
          Dependency Graph
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Service topology — derived from live dependency data
        </p>
      </div>

      {/* Tier layout — generated from graph data, not hardcoded */}
      <div className="space-y-4 mb-5">
        {tiers.map((tier, tierIndex) => {
          const nodes = topology.nodes.filter((n) => n.tier === tier)
          if (nodes.length === 0) return null
          
          return (
            <div key={tier}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {tierLabels[tier]}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="flex flex-wrap gap-2">
                {nodes.map((node) => (
                  <ServiceNodeCard key={node.id} node={node} edges={topology.edges} />
                ))}
              </div>
              {tierIndex < tiers.length - 1 && (
                <div className="text-center text-muted-foreground/40 text-xs mt-2">↓</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Stats — derived from graph */}
      <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Critical</p>
          <p className={cn('text-xl font-bold', criticalNodes.length > 0 ? 'text-destructive' : 'text-success')}>
            {criticalNodes.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Warning</p>
          <p className={cn('text-xl font-bold', warningNodes.length > 0 ? 'text-warning' : 'text-success')}>
            {warningNodes.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Vuln Services</p>
          <p className="text-xl font-bold">{noisyServiceCount}</p>
        </div>
      </div>

      {/* Alerts / risk indicators */}
      <div className="space-y-1.5 mb-5">
        {criticalNodes.map((n) => {
          const downstreamCount = topology.edges.filter((e) => e.target === n.id).length
          return (
            <div key={n.id} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
              <span>{n.name} is failing CI — {downstreamCount} upstream services affected</span>
            </div>
          )
        })}
        {warningNodes.map((n) => (
          <div key={n.id} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0" />
            <span>{n.name} degraded (health {Math.round(n.healthScore)}%)</span>
          </div>
        ))}
      </div>

      <Link
        href="/dependencies"
        className="block text-center w-full p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors text-sm font-medium"
      >
        Open Full Dependency Graph →
      </Link>
    </Card>
  )
}
