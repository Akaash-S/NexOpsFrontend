'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, Zap, CheckCircle, GitBranch, X, Loader2 } from 'lucide-react'

interface DependencyIntelligenceProps {
  nodeId: string
  onClose?: () => void
}

const iconMap = {
  success: <CheckCircle className="w-4 h-4 text-success" />,
  warning: <AlertTriangle className="w-4 h-4 text-warning" />,
  critical: <AlertTriangle className="w-4 h-4 text-destructive" />,
  info: <Zap className="w-4 h-4 text-primary" />,
}

export function DependencyIntelligence({ nodeId, onClose }: DependencyIntelligenceProps) {
  const [node, setNode] = useState<any>(null)
  const [topology, setTopology] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const rawData = await apiFetch('/dependencies/topology') as any
        
        // Map camelCase fields to snake_case for UI components
        const mappedNodes = (rawData.nodes || []).map((n: any) => ({
          ...n,
          health_score: n.health_score ?? n.healthScore ?? 100.0,
          ci_status: n.ci_status ?? n.ciStatus ?? 'unknown',
          open_issues: n.open_issues ?? n.openIssues ?? 0,
        }))

        setTopology({
          nodes: mappedNodes,
          edges: rawData.edges || []
        })
        const found = mappedNodes.find((n: any) => n.id === nodeId)
        setNode(found || null)
      } catch (err) {
        console.error('Failed to load node intelligence:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [nodeId])

  if (loading) {
    return (
      <div className="h-full border border-border rounded-lg flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!node) {
    return (
      <ScrollArea className="h-full border border-border rounded-lg">
        <div className="p-4 space-y-4">
          <div className="flex items-start justify-between pb-4 border-b border-border">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{nodeId}</h3>
              <Badge variant="outline">Unknown service</Badge>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Service details not available.</p>
        </div>
      </ScrollArea>
    )
  }

  const up = topology.edges?.filter((e: any) => e.source === nodeId) || []
  const down = topology.edges?.filter((e: any) => e.target === nodeId) || []

  const upstreamNames = up.map((e: any) => {
    const n = topology.nodes?.find((n: any) => n.id === e.target)
    return n?.name || e.target.substring(0, 8)
  })

  const downstreamNames = down.map((e: any) => {
    const n = topology.nodes?.find((n: any) => n.id === e.source)
    return n?.name || e.source.substring(0, 8)
  })

  const healthStatus = node.ci_status === 'failing' ? 'critical' : (node.ci_status === 'unknown' ? 'warning' : (node.health_score < 80 ? 'warning' : 'healthy'))

  return (
    <ScrollArea className="h-full border border-border rounded-lg">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">{node.name}</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{Math.round(node.health_score)}% Health</Badge>
              <Badge variant="outline">{healthStatus}</Badge>
            </div>
            {node.owner && (
              <p className="text-xs text-muted-foreground">Owned by {node.owner}</p>
            )}
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Health Trend */}
        <Card className="p-3 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">CI Status</p>
          <p className="text-sm font-semibold text-foreground capitalize">{node.ci_status || 'unknown'}</p>
          {node.language && (
            <p className="text-xs text-muted-foreground mt-1">Language: {node.language}</p>
          )}
        </Card>

        {/* Risk Metrics */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Metrics</h4>
          <Card className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Open Issues</span>
              <Badge variant="outline">{node.open_issues || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Vulnerabilities</span>
              <Badge variant="outline" className={node.vulnerabilities > 0 ? 'bg-destructive/10 text-destructive' : ''}>
                {node.vulnerabilities || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Activity</span>
              <Badge variant="outline">{Math.round(node.activity)}%</Badge>
            </div>
          </Card>
        </div>

        {/* Dependencies (upstream) */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Depends On</h4>
          <div className="space-y-1.5">
            {upstreamNames.length === 0 ? (
              <p className="text-xs text-muted-foreground">No upstream dependencies</p>
            ) : (
              upstreamNames.map((name: string) => (
                <Card key={name} className="p-2 flex items-center gap-2">
                  <GitBranch className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-foreground flex-1">{name}</span>
                  <Badge variant="outline" className="text-xs">Required</Badge>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Dependents (downstream) */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Dependents</h4>
          <div className="space-y-1.5">
            {downstreamNames.length === 0 ? (
              <p className="text-xs text-muted-foreground">No downstream dependents</p>
            ) : (
              downstreamNames.map((name: string) => (
                <Card key={name} className="p-2 flex items-center gap-2">
                  <GitBranch className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-foreground flex-1">{name}</span>
                  <Badge variant="outline" className="text-xs">Depends</Badge>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
          <Button size="sm" variant="outline">View Details</Button>
          <Button size="sm">View Deployments</Button>
        </div>
      </div>
    </ScrollArea>
  )
}