'use client'

import { useCallback, useMemo, type MouseEvent } from 'react'
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
import { ServiceNode } from './service-node'
import { cn } from '@/lib/utils'

const nodeTypes = {
  service: ServiceNode,
}

const initialNodes: Node[] = [
  {
    id: 'api-gateway',
    data: { label: 'API Gateway', health: 98, status: 'healthy', criticality: 'critical' },
    position: { x: 200, y: 50 },
    type: 'service',
  },
  {
    id: 'auth-service',
    data: { label: 'Auth Service', health: 99, status: 'healthy', criticality: 'critical' },
    position: { x: 0, y: 150 },
    type: 'service',
  },
  {
    id: 'search-service',
    data: { label: 'Search Service', health: 85, status: 'warning', criticality: 'high' },
    position: { x: 400, y: 150 },
    type: 'service',
  },
  {
    id: 'notification-service',
    data: { label: 'Notification Service', health: 92, status: 'healthy', criticality: 'medium' },
    position: { x: 100, y: 250 },
    type: 'service',
  },
  {
    id: 'analytics-engine',
    data: { label: 'Analytics Engine', health: 88, status: 'healthy', criticality: 'medium' },
    position: { x: 350, y: 250 },
    type: 'service',
  },
  {
    id: 'database',
    data: { label: 'Database', health: 95, status: 'healthy', criticality: 'critical' },
    position: { x: 200, y: 350 },
    type: 'service',
  },
  {
    id: 'redis-cache',
    data: { label: 'Redis Cache', health: 97, status: 'healthy', criticality: 'high' },
    position: { x: 0, y: 350 },
    type: 'service',
  },
  {
    id: 'kafka-queue',
    data: { label: 'Kafka Queue', health: 91, status: 'healthy', criticality: 'high' },
    position: { x: 400, y: 350 },
    type: 'service',
  },
]

const initialEdges: Edge[] = [
  {
    id: 'api-gateway-auth',
    source: 'api-gateway',
    target: 'auth-service',
    animated: true,
    label: 'required',
  },
  {
    id: 'api-gateway-search',
    source: 'api-gateway',
    target: 'search-service',
    animated: true,
    label: 'optional',
  },
  {
    id: 'api-gateway-notification',
    source: 'api-gateway',
    target: 'notification-service',
    animated: true,
    label: 'required',
  },
  {
    id: 'auth-service-database',
    source: 'auth-service',
    target: 'database',
    label: 'critical',
  },
  {
    id: 'auth-service-redis',
    source: 'auth-service',
    target: 'redis-cache',
    label: 'optional',
  },
  {
    id: 'search-service-kafka',
    source: 'search-service',
    target: 'kafka-queue',
    label: 'required',
  },
  {
    id: 'analytics-engine-kafka',
    source: 'analytics-engine',
    target: 'kafka-queue',
    label: 'required',
  },
  {
    id: 'analytics-engine-database',
    source: 'analytics-engine',
    target: 'database',
    label: 'required',
  },
  {
    id: 'notification-service-kafka',
    source: 'notification-service',
    target: 'kafka-queue',
    label: 'required',
  },
]

interface DependencyGraphProps {
  impactMode: boolean
  searchQuery: string
  onNodeSelect: (nodeId: string) => void
  selectedNode: string | null
}

export function DependencyGraph({
  impactMode,
  searchQuery,
  onNodeSelect,
  selectedNode,
}: DependencyGraphProps) {
  const handleNodeClick = useCallback((_event: MouseEvent, node: Node) => {
    onNodeSelect(node.id)
  }, [onNodeSelect])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const highlightedNodes = useMemo(() => {
    if (!selectedNode) return new Set()
    const highlighted = new Set([selectedNode])

    // Add upstream dependencies
    const addUpstream = (nodeId: string) => {
      edges.forEach((edge) => {
        if (edge.target === nodeId && !highlighted.has(edge.source)) {
          highlighted.add(edge.source)
          addUpstream(edge.source)
        }
      })
    }

    // Add downstream dependents
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

  const filteredNodes = useMemo(
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

  const filteredEdges = useMemo(
    () =>
      edges.map((edge) => {
        const sourceHighlighted = highlightedNodes.has(edge.source)
        const targetHighlighted = highlightedNodes.has(edge.target)

        return {
          ...edge,
          animated: sourceHighlighted && targetHighlighted,
          style: {
            stroke: sourceHighlighted && targetHighlighted ? 'var(--primary)' : 'var(--border)',
            strokeWidth: sourceHighlighted && targetHighlighted ? 2 : 1,
          },
        }
      }),
    [edges, highlightedNodes]
  )

  const memoizedNodeTypes = useMemo(() => nodeTypes, [])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={filteredNodes}
        edges={filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={memoizedNodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
