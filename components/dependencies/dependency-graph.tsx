'use client'

import { useCallback, useMemo, useState, useEffect, type MouseEvent } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import dagre from 'dagre'
import { ServiceNode } from './service-node'
import { CardSkeleton } from '@/components/loading-state'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle, Network, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const nodeTypes = {
  service: ServiceNode,
}

const NODE_WIDTH = 180
const NODE_HEIGHT = 120

interface TopologyNode {
  id: string
  name: string
  platform: string
  language?: string | null
  health_score: number
  ci_status: string
  open_issues: number
  vulnerabilities: number
  activity: number
  owner?: string | null
}

interface TopologyEdge {
  id: string
  source: string
  target: string
  label: string
  is_broken: boolean
}

interface TopologyResponse {
  nodes: TopologyNode[]
  edges: TopologyEdge[]
}

function deriveStatus(ciStatus: string, healthScore: number): 'healthy' | 'warning' | 'critical' {
  if (ciStatus === 'failing') return 'critical'
  if (ciStatus === 'unknown') return 'warning'
  if (healthScore < 80) return 'warning'
  return 'healthy'
}

function deriveCriticality(healthScore: number): string {
  if (healthScore >= 95) return 'critical'
  if (healthScore >= 85) return 'high'
  if (healthScore >= 70) return 'medium'
  return 'low'
}

function layoutGraph(nodes: TopologyNode[], edges: TopologyEdge[]): { flowNodes: Node[]; flowEdges: Edge[] } {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 100, marginx: 40, marginy: 40 })

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  const flowNodes: Node[] = nodes.map((node) => {
    const pos = g.node(node.id)
    return {
      id: node.id,
      type: 'service',
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
      data: {
        label: node.name,
        health: Math.round(node.health_score),
        status: deriveStatus(node.ci_status, node.health_score),
        criticality: deriveCriticality(node.health_score),
      },
    }
  })

  const flowEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: edge.is_broken,
    style: edge.is_broken
      ? { stroke: 'var(--destructive)', strokeWidth: 2 }
      : { stroke: 'var(--border)', strokeWidth: 1.5 },
  }))

  return { flowNodes, flowEdges }
}

interface DependencyGraphProps {
  impactMode: boolean
  searchQuery: string
  onNodeSelect: (nodeId: string | null) => void
  selectedNode: string | null
}

export function DependencyGraph({
  impactMode,
  searchQuery,
  onNodeSelect,
  selectedNode,
}: DependencyGraphProps) {
  const [topology, setTopology] = useState<TopologyResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showExample, setShowExample] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadTopology() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const rawData = await apiFetch('/dependencies/topology') as any
        
        // Map camelCase fields to snake_case for UI components
        const mappedNodes = (rawData.nodes || []).map((node: any) => ({
          ...node,
          health_score: node.health_score ?? node.healthScore ?? 100.0,
          ci_status: node.ci_status ?? node.ciStatus ?? 'unknown',
          open_issues: node.open_issues ?? node.openIssues ?? 0,
        }))

        const mappedEdges = (rawData.edges || []).map((edge: any) => ({
          ...edge,
          is_broken: edge.is_broken ?? edge.isBroken ?? false,
        }))

        setTopology({
          nodes: mappedNodes,
          edges: mappedEdges
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load topology')
      } finally {
        setLoading(false)
      }
    }
    loadTopology()
  }, [])

  const { flowNodes: layoutNodes, flowEdges: layoutEdges } = useMemo(
    () => topology ? layoutGraph(topology.nodes, topology.edges) : { flowNodes: [], flowEdges: [] },
    [topology]
  )

  const filteredBySearch = useMemo(
    () => {
      if (!searchQuery) return layoutNodes
      const q = searchQuery.toLowerCase()
      return layoutNodes.filter((n) => n.data.label.toLowerCase().includes(q))
    },
    [layoutNodes, searchQuery]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(filteredBySearch)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges)

  useEffect(() => {
    setNodes(filteredBySearch)
  }, [filteredBySearch, setNodes])

  useEffect(() => {
    setEdges(layoutEdges)
  }, [layoutEdges, setEdges])

  const handleNodeClick = useCallback((_event: MouseEvent, node: Node) => {
    onNodeSelect(node.id)
  }, [onNodeSelect])

  const highlightedNodes = useMemo(() => {
    if (!selectedNode) return new Set<string>()
    const highlighted = new Set([selectedNode])

    const addUpstream = (nodeId: string) => {
      edges.forEach((edge) => {
        if (edge.target === nodeId && !highlighted.has(edge.source)) {
          highlighted.add(edge.source)
          addUpstream(edge.source)
        }
      })
    }

    const addDownstream = (nodeId: string) => {
      edges.forEach((edge) => {
        if (edge.source === nodeId && !highlighted.has(edge.target)) {
          highlighted.add(edge.target)
          addDownstream(edge.target)
        }
      })
    }

    if (impactMode) {
      addDownstream(selectedNode)
    } else {
      addUpstream(selectedNode)
    }

    return highlighted
  }, [selectedNode, edges, impactMode])

  const decoratedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        selected: selectedNode === node.id,
        data: {
          ...node.data,
          highlighted: highlightedNodes.has(node.id),
        },
      })),
    [nodes, selectedNode, highlightedNodes]
  )

  const decoratedEdges = useMemo(
    () =>
      edges.map((edge) => {
        const sourceHighlighted = highlightedNodes.has(edge.source)
        const targetHighlighted = highlightedNodes.has(edge.target)
        return {
          ...edge,
          animated: edge.animated || (sourceHighlighted && targetHighlighted),
          style: sourceHighlighted && targetHighlighted
            ? { ...edge.style, stroke: 'var(--primary)', strokeWidth: 2 }
            : edge.style,
        }
      }),
    [edges, highlightedNodes]
  )

  const memoizedNodeTypes = useMemo(() => nodeTypes, [])

  const handlePaneClick = useCallback(() => {
    onNodeSelect(null)
  }, [onNodeSelect])

  const handleCopy = () => {
    const yaml = `service:
  name: repo-a               # Name of the service
  tier: service              # ingress | service | data

dependencies:
  - repo: your-username/repo-b
    type: api                # api | library | hard | soft
    label: calls API`
    navigator.clipboard.writeText(yaml)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Card className="p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading topology...</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Card className="p-8 flex flex-col items-center gap-3 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
          <p className="text-sm font-semibold">Failed to load dependency graph</p>
          <p className="text-xs text-muted-foreground">{error}</p>
          <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  if (!topology || topology.nodes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center border border-dashed border-border rounded-lg">
        <div className="p-8 flex flex-col items-center gap-3 max-w-md text-center">
          <Network className="w-10 h-10 text-muted-foreground/60" />
          <h3 className="font-semibold text-sm">No Services Connected</h3>
          <p className="text-xs text-muted-foreground">
            Connect your GitHub account and sync repositories to see your service topology.
            Dependency edges appear when a <code className="text-xs bg-muted px-1 rounded">nexops.yaml</code> file is present in a repo.
          </p>
          <Button size="sm" asChild variant="outline">
            <Link href="/settings?tab=workspace">Connect Integrations</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full" style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      {topology && topology.edges.length === 0 && (
        <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2 p-3 bg-card/95 backdrop-blur-md border border-border rounded-lg max-w-2xl mx-auto shadow-md transition-all">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-primary shrink-0" />
              <div className="text-xs font-semibold text-foreground">
                No service dependencies configured yet.
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] gap-1"
              onClick={() => setShowExample(!showExample)}
            >
              {showExample ? (
                <>
                  Hide Template <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  View Template <ChevronDown className="w-3 h-3" />
                </>
              )}
            </Button>
          </div>
          
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            To draw relationship lines and links between your services, create a{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono border border-border">nexops.yaml</code>{" "}
            file in the root of your repositories.
          </div>

          {showExample && (
            <div className="mt-1 bg-muted/60 rounded border border-border/50 p-2.5 relative group/code font-mono text-[10px] text-muted-foreground whitespace-pre-wrap select-all">
              <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-success" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
{`service:
  name: repo-a               # The name of the service
  tier: service              # ingress | service | data

dependencies:
  - repo: your-username/repo-b
    type: api                # api | library | hard | soft
    label: calls API`}
            </div>
          )}
        </div>
      )}
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={decoratedNodes}
          edges={decoratedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={memoizedNodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  )
}