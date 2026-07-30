'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, GitBranch, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface DependencyIntelligenceProps {
  nodeId: string
  onClose?: () => void
  onSelectNode?: (id: string) => void
}

export function DependencyIntelligence({ nodeId, onClose, onSelectNode }: DependencyIntelligenceProps) {
  const router = useRouter()
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

  // Upstream: nodes that this node depends on (source = nodeId, target = upstream)
  const up = topology.edges?.filter((e: any) => e.source === nodeId) || []
  // Downstream: nodes that depend on this node (target = nodeId, source = downstream)
  const down = topology.edges?.filter((e: any) => e.target === nodeId) || []

  const healthStatus = node.ci_status === 'failing' || node.health_score < 50 ? 'critical' : (node.health_score < 80 ? 'warning' : 'healthy')

  return (
    <ScrollArea className="h-full border border-border rounded-lg">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">{node.name}</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{Math.round(node.health_score)}% Health</Badge>
              <Badge variant="outline" className={cn(
                healthStatus === 'critical' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                healthStatus === 'warning' ? 'bg-warning/10 text-warning border-warning/20' :
                'bg-success/10 text-success border-success/20'
              )}>{healthStatus}</Badge>
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
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={cn(
              node.ci_status === 'passing' ? 'bg-success/10 text-success border-success/20' :
              node.ci_status === 'failing' ? 'bg-destructive/10 text-destructive border-destructive/20' :
              'bg-muted/40 text-muted-foreground border-border'
            )}>
              {node.ci_status === 'passing' ? 'Passing' : (node.ci_status === 'failing' ? 'Failing' : 'Unconfigured / No Runs')}
            </Badge>
          </div>
          {node.language && (
            <p className="text-xs text-muted-foreground mt-2">Language: {node.language}</p>
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
            {up.length === 0 ? (
              <p className="text-xs text-muted-foreground">No upstream dependencies</p>
            ) : (
              up.map((e: any) => {
                const n = topology.nodes?.find((n: any) => n.id === e.target)
                const name = n?.name || e.target.substring(0, 8)
                return (
                  <Card 
                    key={e.id} 
                    className={cn(
                      "p-2 flex items-center gap-2 transition-colors",
                      onSelectNode ? "cursor-pointer hover:bg-muted/60 hover:border-primary/40" : ""
                    )}
                    onClick={() => onSelectNode?.(e.target)}
                  >
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-foreground flex-1">{name}</span>
                    <Badge variant="outline" className="text-xs">Required</Badge>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Dependents (downstream) */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Dependents</h4>
          <div className="space-y-1.5">
            {down.length === 0 ? (
              <p className="text-xs text-muted-foreground">No downstream dependents</p>
            ) : (
              down.map((e: any) => {
                const n = topology.nodes?.find((n: any) => n.id === e.source)
                const name = n?.name || e.source.substring(0, 8)
                return (
                  <Card 
                    key={e.id} 
                    className={cn(
                      "p-2 flex items-center gap-2 transition-colors",
                      onSelectNode ? "cursor-pointer hover:bg-muted/60 hover:border-primary/40" : ""
                    )}
                    onClick={() => onSelectNode?.(e.source)}
                  >
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-foreground flex-1">{name}</span>
                    <Badge variant="outline" className="text-xs">Depends</Badge>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
          <Button 
            size="sm" 
            variant="outline" 
            className="cursor-pointer"
            onClick={() => router.push(`/services?selected=${node.id}`)}
          >
            View Details
          </Button>
          <Button 
            size="sm"
            className="cursor-pointer"
            onClick={() => router.push(`/recent-changes?search=${node.name}`)}
          >
            View Deployments
          </Button>
        </div>
      </div>
    </ScrollArea>
  )
}