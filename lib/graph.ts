// ============================================================
// NexOps — Dependency Graph: Single Source of Truth
// All incidents, changes, and impact maps reference these IDs.
// ============================================================

export interface ServiceNode {
  id: string
  name: string
  tier: 'ingress' | 'service' | 'data'
  owner: string // derived-style, e.g. "@team-payments (from CODEOWNERS)"
  alertHistory: {
    count30d: number
    noisyRuleIds?: string[] // rules that rarely correlate with real incidents
  }
}

export interface DependencyEdge {
  from: string // ServiceNode.id
  to: string   // ServiceNode.id
}

export interface Deploy {
  id: string
  service: string    // ServiceNode.id
  version: string
  deployedAt: string // ISO-8601
  deployedBy: string
}

// ─── Nodes ──────────────────────────────────────────────────

export const serviceNodes: ServiceNode[] = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    tier: 'ingress',
    owner: '@team-platform (from CODEOWNERS)',
    alertHistory: {
      count30d: 12,
      noisyRuleIds: ['rule-cpu-spike', 'rule-memory-warning'],
    },
  },
  {
    id: 'auth-service',
    name: 'Auth Service',
    tier: 'service',
    owner: '@team-security (from CODEOWNERS)',
    alertHistory: { count30d: 8 },
  },
  {
    id: 'user-service',
    name: 'User Service',
    tier: 'service',
    owner: '@team-backend (from CODEOWNERS)',
    alertHistory: {
      count30d: 15,
      noisyRuleIds: ['rule-db-conn-pool'],
    },
  },
  {
    id: 'payment-service',
    name: 'Payment Service',
    tier: 'service',
    owner: '@team-payments (from CODEOWNERS)',
    alertHistory: {
      count30d: 32,
      noisyRuleIds: ['rule-latency-p99', 'rule-error-rate', 'rule-timeout'],
    },
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    tier: 'service',
    owner: '@team-platform (from CODEOWNERS)',
    alertHistory: { count30d: 4 },
  },
  {
    id: 'analytics-engine',
    name: 'Analytics Engine',
    tier: 'service',
    owner: '@team-data (from CODEOWNERS)',
    alertHistory: { count30d: 6 },
  },
  {
    id: 'database',
    name: 'Database',
    tier: 'data',
    owner: '@team-infra (from CODEOWNERS)',
    alertHistory: { count30d: 3 },
  },
  {
    id: 'redis-cache',
    name: 'Redis Cache',
    tier: 'data',
    owner: '@team-infra (from CODEOWNERS)',
    alertHistory: { count30d: 2 },
  },
  {
    id: 'kafka-queue',
    name: 'Kafka Queue',
    tier: 'data',
    owner: '@team-infra (from CODEOWNERS)',
    alertHistory: { count30d: 1 },
  },
]

// ─── Edges ──────────────────────────────────────────────────

export const dependencyEdges: DependencyEdge[] = [
  { from: 'api-gateway', to: 'auth-service' },
  { from: 'api-gateway', to: 'user-service' },
  { from: 'api-gateway', to: 'payment-service' },
  { from: 'api-gateway', to: 'notification-service' },
  { from: 'auth-service', to: 'database' },
  { from: 'auth-service', to: 'redis-cache' },
  { from: 'user-service', to: 'database' },
  { from: 'payment-service', to: 'database' },
  { from: 'notification-service', to: 'kafka-queue' },
  { from: 'analytics-engine', to: 'kafka-queue' },
  { from: 'analytics-engine', to: 'database' },
]

// ─── Deploys ────────────────────────────────────────────────

export const mockDeploys: Deploy[] = [
  {
    id: 'dep-2024-001',
    service: 'api-gateway',
    version: '2.15.3',
    deployedAt: '2024-05-28T10:30:00Z',
    deployedBy: 'deployment-bot',
  },
  {
    id: 'dep-2024-002',
    service: 'payment-service',
    version: '1.5.4',
    deployedAt: '2024-05-28T14:20:00Z',
    deployedBy: 'ci-pipeline',
  },
  {
    id: 'dep-2024-003',
    service: 'user-service',
    version: '3.2.1',
    deployedAt: '2024-05-28T07:45:00Z',
    deployedBy: 'Carol White',
  },
  {
    id: 'dep-2024-004',
    service: 'auth-service',
    version: '1.8.3',
    deployedAt: '2024-05-27T14:15:00Z',
    deployedBy: 'Bob Smith',
  },
  {
    id: 'dep-2024-005',
    service: 'database',
    version: 'config-v9',
    deployedAt: '2024-05-28T13:40:00Z',
    deployedBy: 'auto-scaling',
  },
]

// ─── Graph Helpers ──────────────────────────────────────────

export function getNodeById(id: string): ServiceNode | undefined {
  return serviceNodes.find((n) => n.id === id)
}

/** Returns direct downstream dependents (services that depend ON nodeId) */
export function getDownstream(nodeId: string): string[] {
  return dependencyEdges
    .filter((e) => e.to === nodeId)
    .map((e) => e.from)
}

/** Returns direct upstream dependencies (services that nodeId depends ON) */
export function getUpstream(nodeId: string): string[] {
  return dependencyEdges
    .filter((e) => e.from === nodeId)
    .map((e) => e.to)
}

/** Returns all transitive downstream services affected if nodeId fails */
export function getBlastRadius(nodeId: string): string[] {
  const visited = new Set<string>()
  function traverse(id: string) {
    const downstreamOfThis = getDownstream(id)
    for (const dep of downstreamOfThis) {
      if (!visited.has(dep)) {
        visited.add(dep)
        traverse(dep)
      }
    }
  }
  traverse(nodeId)
  return [...visited]
}
