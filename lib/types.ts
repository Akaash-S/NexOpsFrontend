// ============================================================
// NexOps — Common Types & Interfaces
// ============================================================

export interface ServiceNode {
  id: string
  name: string
  tier: 'ingress' | 'service' | 'data'
  owner: string
  alertHistory: {
    count30d: number
    noisyRuleIds?: string[]
  }
}

export interface DependencyEdge {
  from: string
  to: string
}

export interface Deploy {
  id: string
  service: string
  version: string
  deployedAt: string
  deployedBy: string
}

export interface Service {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  version: string;
  environment: 'production' | 'staging' | 'development';
  latency: number;
  errorRate: number;
  uptime: number;
  team: string;
  dependencies: string[];
  dependents: string[];
  lastDeployed: string;
  owner: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  changeFailureRate: number;
  deploymentFrequency: string;
  mttr: string;
  incidents30d: number;
}

export interface CandidateCause {
  deployId: string;
  service: string;
  matchScore: number;
  matchReasons: string[];
  confirmed: boolean | null;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'investigating' | 'monitoring' | 'resolved';
  service: string;
  startedAt: string;
  resolvedAt?: string;
  affectedUsers: number;
  description: string;
  assignee: string;
  timeline: TimelineEvent[];
  candidateCauses: CandidateCause[];
}

export interface TimelineEvent {
  timestamp: string;
  action: string;
  actor: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  service: string;
  condition: string;
  threshold: string;
  current: string;
  status: 'active' | 'silenced' | 'resolved';
  createdAt: string;
}

export interface Deployment {
  id: string;
  service: string;
  version: string;
  status: 'success' | 'in-progress' | 'failed' | 'rolled-back';
  environment: string;
  deployedAt: string;
  deployedBy: string;
  changes: number;
  duration: number;
}

export interface Release {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'scheduled' | 'released' | 'archived';
  targetDate: string;
  services: string[];
  changeLog: string;
  notes: string;
  createdBy: string;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  branches: number;
  commits: number;
  lastCommit: string;
  owner: string;
  url: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'performance' | 'reliability' | 'security' | 'cost';
}
