// Mock data for NexOps dashboard
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
  lastDeployed: string;
  owner: string;
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
}

export interface TimelineEvent {
  timestamp: string;
  action: string;
  actor: string;
}

export interface Alert {
  id: string;
  title: string;
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
  duration: number; // in seconds
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
  effort: 'high' | 'medium' | 'low';
  service: string;
  status: 'pending' | 'in-progress' | 'completed' | 'dismissed';
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  category: 'infrastructure' | 'security' | 'compliance' | 'operational';
  affectedServices: string[];
  mitigation: string;
  status: 'active' | 'mitigating' | 'resolved';
  dueDate: string;
}

export interface WorkflowPipeline {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'failed';
  triggers: string;
  successRate: number;
  averageDuration: number;
  lastRun: string;
  runs: number;
}

export interface Cluster {
  id: string;
  name: string;
  region: string;
  provider: string;
  health: number;
  status: 'healthy' | 'warning' | 'critical';
  nodes: number;
  services: number;
  incidents: number;
  lastSync: string;
  capacity: number;
  version: string;
  criticalDeps: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: number;
  lead: string;
  services: number;
  createdAt: string;
}

export const mockServices: Service[] = [
  {
    id: 'svc-1',
    name: 'API Gateway',
    status: 'healthy',
    version: '2.5.1',
    environment: 'production',
    latency: 45,
    errorRate: 0.02,
    uptime: 99.98,
    team: 'Platform',
    dependencies: ['Auth Service', 'Database'],
    lastDeployed: '2024-05-28T10:30:00Z',
    owner: 'Alice Johnson',
  },
  {
    id: 'svc-2',
    name: 'Auth Service',
    status: 'healthy',
    version: '1.8.2',
    environment: 'production',
    latency: 32,
    errorRate: 0.01,
    uptime: 99.99,
    team: 'Security',
    dependencies: ['Database', 'Redis Cache'],
    lastDeployed: '2024-05-27T14:15:00Z',
    owner: 'Bob Smith',
  },
  {
    id: 'svc-3',
    name: 'User Service',
    status: 'healthy',
    version: '3.2.0',
    environment: 'production',
    latency: 58,
    errorRate: 0.03,
    uptime: 99.95,
    team: 'Backend',
    dependencies: ['Database', 'Cache'],
    lastDeployed: '2024-05-26T09:45:00Z',
    owner: 'Carol White',
  },
  {
    id: 'svc-4',
    name: 'Payment Processor',
    status: 'degraded',
    version: '1.5.3',
    environment: 'production',
    latency: 120,
    errorRate: 0.08,
    uptime: 99.85,
    team: 'Payments',
    dependencies: ['Database', 'Stripe API'],
    lastDeployed: '2024-05-25T16:20:00Z',
    owner: 'David Lee',
  },
  {
    id: 'svc-5',
    name: 'Notification Service',
    status: 'healthy',
    version: '2.1.1',
    environment: 'production',
    latency: 28,
    errorRate: 0.01,
    uptime: 99.99,
    team: 'Platform',
    dependencies: ['Queue Service', 'Email Provider'],
    lastDeployed: '2024-05-28T11:00:00Z',
    owner: 'Emma Davis',
  },
  {
    id: 'svc-6',
    name: 'Analytics Engine',
    status: 'healthy',
    version: '1.9.0',
    environment: 'production',
    latency: 75,
    errorRate: 0.02,
    uptime: 99.92,
    team: 'Data',
    dependencies: ['Data Warehouse', 'Kafka'],
    lastDeployed: '2024-05-24T13:30:00Z',
    owner: 'Frank Wilson',
  },
];

export const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    title: 'Payment Processing Slowdown',
    severity: 'high',
    status: 'investigating',
    service: 'Payment Processor',
    startedAt: '2024-05-28T14:32:00Z',
    affectedUsers: 2340,
    description: 'Customers reporting slow payment processing and timeouts. Latency increased from 120ms to 850ms.',
    assignee: 'David Lee',
    timeline: [
      { timestamp: '2024-05-28T14:32:00Z', action: 'Incident detected', actor: 'Monitoring System' },
      { timestamp: '2024-05-28T14:35:00Z', action: 'Team notified', actor: 'Alert Manager' },
      { timestamp: '2024-05-28T14:40:00Z', action: 'Investigation started', actor: 'David Lee' },
    ],
  },
  {
    id: 'inc-2',
    title: 'Database Connection Pool Exhaustion',
    severity: 'critical',
    status: 'investigating',
    service: 'User Service',
    startedAt: '2024-05-28T15:10:00Z',
    affectedUsers: 5600,
    description: 'Database connection pool reached maximum capacity causing connection timeout errors for User Service.',
    assignee: 'Carol White',
    timeline: [
      { timestamp: '2024-05-28T15:10:00Z', action: 'Incident detected', actor: 'Monitoring System' },
      { timestamp: '2024-05-28T15:12:00Z', action: 'Severity escalated to critical', actor: 'Alert Manager' },
      { timestamp: '2024-05-28T15:15:00Z', action: 'Incident commander assigned', actor: 'Carol White' },
    ],
  },
  {
    id: 'inc-3',
    title: 'Cache Eviction Issues',
    severity: 'medium',
    status: 'monitoring',
    service: 'Auth Service',
    startedAt: '2024-05-28T12:45:00Z',
    resolvedAt: '2024-05-28T13:20:00Z',
    affectedUsers: 450,
    description: 'Increased cache misses detected. Application experiencing elevated response times.',
    assignee: 'Bob Smith',
    timeline: [
      { timestamp: '2024-05-28T12:45:00Z', action: 'Incident detected', actor: 'Monitoring System' },
      { timestamp: '2024-05-28T13:00:00Z', action: 'Cache purged', actor: 'Bob Smith' },
      { timestamp: '2024-05-28T13:20:00Z', action: 'Incident resolved', actor: 'Bob Smith' },
    ],
  },
  {
    id: 'inc-4',
    title: 'API Gateway Circuit Breaker Triggered',
    severity: 'medium',
    status: 'resolved',
    service: 'API Gateway',
    startedAt: '2024-05-27T10:15:00Z',
    resolvedAt: '2024-05-27T10:45:00Z',
    affectedUsers: 1200,
    description: 'Downstream service experiencing issues caused circuit breaker to trigger on API Gateway.',
    assignee: 'Alice Johnson',
    timeline: [
      { timestamp: '2024-05-27T10:15:00Z', action: 'Incident detected', actor: 'Monitoring System' },
      { timestamp: '2024-05-27T10:30:00Z', action: 'Circuit breaker triggered', actor: 'API Gateway' },
      { timestamp: '2024-05-27T10:45:00Z', action: 'Service recovered', actor: 'System' },
    ],
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'High Memory Usage',
    severity: 'warning',
    service: 'Payment Processor',
    condition: 'Memory Usage > 85%',
    threshold: '85%',
    current: '87%',
    status: 'active',
    createdAt: '2024-05-28T14:32:00Z',
  },
  {
    id: 'alert-2',
    title: 'High Error Rate',
    severity: 'critical',
    service: 'User Service',
    condition: 'Error Rate > 5%',
    threshold: '5%',
    current: '8.2%',
    status: 'active',
    createdAt: '2024-05-28T15:10:00Z',
  },
  {
    id: 'alert-3',
    title: 'CPU Saturation',
    severity: 'warning',
    service: 'Analytics Engine',
    condition: 'CPU Usage > 80%',
    threshold: '80%',
    current: '82%',
    status: 'active',
    createdAt: '2024-05-28T16:00:00Z',
  },
  {
    id: 'alert-4',
    title: 'Disk Space Low',
    severity: 'critical',
    service: 'Database',
    condition: 'Disk Usage > 90%',
    threshold: '90%',
    current: '92%',
    status: 'active',
    createdAt: '2024-05-28T16:25:00Z',
  },
];

export const mockDeployments: Deployment[] = [
  {
    id: 'dep-1',
    service: 'API Gateway',
    version: '2.5.1',
    status: 'success',
    environment: 'production',
    deployedAt: '2024-05-28T10:30:00Z',
    deployedBy: 'Alice Johnson',
    changes: 12,
    duration: 245,
  },
  {
    id: 'dep-2',
    service: 'User Service',
    version: '3.2.0',
    status: 'success',
    environment: 'production',
    deployedAt: '2024-05-26T09:45:00Z',
    deployedBy: 'Carol White',
    changes: 8,
    duration: 320,
  },
  {
    id: 'dep-3',
    service: 'Payment Processor',
    version: '1.5.3',
    status: 'in-progress',
    environment: 'staging',
    deployedAt: '2024-05-28T16:15:00Z',
    deployedBy: 'David Lee',
    changes: 15,
    duration: 0,
  },
  {
    id: 'dep-4',
    service: 'Auth Service',
    version: '1.8.2',
    status: 'success',
    environment: 'production',
    deployedAt: '2024-05-27T14:15:00Z',
    deployedBy: 'Bob Smith',
    changes: 5,
    duration: 180,
  },
  {
    id: 'dep-5',
    service: 'Notification Service',
    version: '2.1.1',
    status: 'failed',
    environment: 'staging',
    deployedAt: '2024-05-28T15:00:00Z',
    deployedBy: 'Emma Davis',
    changes: 7,
    duration: 150,
  },
];

export const mockReleases: Release[] = [
  {
    id: 'rel-1',
    name: 'Spring 2024 Release',
    version: '3.0.0',
    status: 'released',
    targetDate: '2024-05-15T00:00:00Z',
    services: ['API Gateway', 'User Service', 'Auth Service'],
    changeLog: 'New features: improved caching, better error handling, performance optimizations',
    notes: 'Successfully deployed with minimal downtime',
    createdBy: 'Alice Johnson',
  },
  {
    id: 'rel-2',
    name: 'Payment Processing Overhaul',
    version: '2.0.0',
    status: 'scheduled',
    targetDate: '2024-06-15T00:00:00Z',
    services: ['Payment Processor'],
    changeLog: 'Complete refactor of payment processing pipeline, new provider support',
    notes: 'Testing in staging environment',
    createdBy: 'David Lee',
  },
  {
    id: 'rel-3',
    name: 'Q2 Infrastructure Updates',
    version: '1.5.0',
    status: 'draft',
    targetDate: '2024-06-30T00:00:00Z',
    services: ['API Gateway', 'Database', 'Cache'],
    changeLog: 'Kubernetes upgrade, new monitoring capabilities',
    notes: 'Planning phase - gathering requirements',
    createdBy: 'Frank Wilson',
  },
];

export const mockRepositories: Repository[] = [
  {
    id: 'repo-1',
    name: 'nexops-api',
    description: 'Main API gateway service',
    language: 'Go',
    stars: 342,
    branches: 8,
    commits: 1243,
    lastCommit: '2024-05-28T10:15:00Z',
    owner: 'Platform',
    url: 'https://github.com/nexops/nexops-api',
  },
  {
    id: 'repo-2',
    name: 'nexops-auth',
    description: 'Authentication and authorization service',
    language: 'Python',
    stars: 256,
    branches: 5,
    commits: 892,
    lastCommit: '2024-05-27T14:00:00Z',
    owner: 'Security',
    url: 'https://github.com/nexops/nexops-auth',
  },
  {
    id: 'repo-3',
    name: 'nexops-ui',
    description: 'Web UI and dashboard',
    language: 'TypeScript',
    stars: 512,
    branches: 12,
    commits: 2341,
    lastCommit: '2024-05-28T16:30:00Z',
    owner: 'Frontend',
    url: 'https://github.com/nexops/nexops-ui',
  },
  {
    id: 'repo-4',
    name: 'nexops-infra',
    description: 'Infrastructure as code and Kubernetes configs',
    language: 'HCL',
    stars: 189,
    branches: 6,
    commits: 756,
    lastCommit: '2024-05-26T09:30:00Z',
    owner: 'DevOps',
    url: 'https://github.com/nexops/nexops-infra',
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Implement Request Caching',
    description: 'Add HTTP caching headers and implement Redis-based query result caching to reduce database load.',
    impact: 'high',
    category: 'performance',
    effort: 'medium',
    service: 'API Gateway',
    status: 'in-progress',
  },
  {
    id: 'rec-2',
    title: 'Upgrade Node.js Runtime',
    description: 'Migrate to Node.js 20 LTS for better performance and security patches.',
    impact: 'medium',
    category: 'security',
    effort: 'low',
    service: 'Notification Service',
    status: 'pending',
  },
  {
    id: 'rec-3',
    title: 'Implement Circuit Breaker Pattern',
    description: 'Add circuit breaker pattern to all external API calls to prevent cascading failures.',
    impact: 'high',
    category: 'reliability',
    effort: 'medium',
    service: 'API Gateway',
    status: 'pending',
  },
  {
    id: 'rec-4',
    title: 'Optimize Database Indexes',
    description: 'Review and optimize database indexes to improve query performance by 40-50%.',
    impact: 'high',
    category: 'performance',
    effort: 'low',
    service: 'User Service',
    status: 'completed',
  },
];

export const mockRiskItems: RiskItem[] = [
  {
    id: 'risk-1',
    title: 'Single Point of Failure in Database',
    description: 'Current database setup lacks read replicas and automatic failover.',
    level: 'critical',
    category: 'infrastructure',
    affectedServices: ['API Gateway', 'User Service', 'Auth Service'],
    mitigation: 'Implement multi-region database replication and automated failover',
    status: 'active',
    dueDate: '2024-06-30T00:00:00Z',
  },
  {
    id: 'risk-2',
    title: 'Unencrypted Data in Transit',
    description: 'Some internal services communicate without TLS encryption.',
    level: 'high',
    category: 'security',
    affectedServices: ['Auth Service', 'User Service', 'Payment Processor'],
    mitigation: 'Enforce TLS 1.3 for all service-to-service communication',
    status: 'mitigating',
    dueDate: '2024-06-15T00:00:00Z',
  },
  {
    id: 'risk-3',
    title: 'Compliance Gap: GDPR Data Retention',
    description: 'No automated process for deleting user data after retention period.',
    level: 'high',
    category: 'compliance',
    affectedServices: ['User Service', 'Analytics Engine'],
    mitigation: 'Implement automated data retention policies and audit logging',
    status: 'active',
    dueDate: '2024-07-31T00:00:00Z',
  },
  {
    id: 'risk-4',
    title: 'Outdated Dependencies',
    description: 'Several critical dependencies have known security vulnerabilities.',
    level: 'medium',
    category: 'security',
    affectedServices: ['Notification Service', 'Analytics Engine'],
    mitigation: 'Schedule dependency upgrades and implement automated scanning',
    status: 'mitigating',
    dueDate: '2024-06-10T00:00:00Z',
  },
];

export const mockWorkflowPipelines: WorkflowPipeline[] = [
  {
    id: 'pipe-1',
    name: 'API Gateway CI/CD',
    status: 'active',
    triggers: 'On commit to main branch',
    successRate: 98.5,
    averageDuration: 245,
    lastRun: '2024-05-28T10:30:00Z',
    runs: 542,
  },
  {
    id: 'pipe-2',
    name: 'User Service Build & Test',
    status: 'active',
    triggers: 'On pull request',
    successRate: 96.2,
    averageDuration: 320,
    lastRun: '2024-05-28T15:45:00Z',
    runs: 1203,
  },
  {
    id: 'pipe-3',
    name: 'Nightly Integration Tests',
    status: 'active',
    triggers: 'Scheduled daily at 2 AM UTC',
    successRate: 94.1,
    averageDuration: 1840,
    lastRun: '2024-05-28T02:15:00Z',
    runs: 287,
  },
  {
    id: 'pipe-4',
    name: 'Security Scanning',
    status: 'paused',
    triggers: 'On release preparation',
    successRate: 100,
    averageDuration: 540,
    lastRun: '2024-05-27T14:00:00Z',
    runs: 45,
  },
];

export const mockClusters: Cluster[] = [
  {
    id: 'prod-us-east-1',
    name: 'Production US-East',
    region: 'us-east-1',
    provider: 'aws',
    health: 98,
    status: 'healthy',
    nodes: 24,
    services: 42,
    incidents: 0,
    lastSync: '2 minutes ago',
    capacity: 87,
    version: '1.27.5',
    criticalDeps: 3,
  },
  {
    id: 'prod-eu-west-1',
    name: 'Production EU-West',
    region: 'eu-west-1',
    provider: 'aws',
    health: 94,
    status: 'healthy',
    nodes: 18,
    services: 38,
    incidents: 1,
    lastSync: '5 minutes ago',
    capacity: 72,
    version: '1.27.5',
    criticalDeps: 2,
  },
  {
    id: 'staging-us-west-2',
    name: 'Staging US-West',
    region: 'us-west-2',
    provider: 'aws',
    health: 78,
    status: 'warning',
    nodes: 12,
    services: 28,
    incidents: 3,
    lastSync: '1 minute ago',
    capacity: 65,
    version: '1.26.8',
    criticalDeps: 1,
  },
  {
    id: 'dev-multi-region',
    name: 'Development Multi-Region',
    region: 'multi',
    provider: 'gke',
    health: 85,
    status: 'healthy',
    nodes: 8,
    services: 15,
    incidents: 2,
    lastSync: '3 minutes ago',
    capacity: 54,
    version: '1.27.3',
    criticalDeps: 0,
  },
  {
    id: 'edge-global',
    name: 'Edge CDN Network',
    region: 'global',
    provider: 'custom',
    health: 92,
    status: 'healthy',
    nodes: 64,
    services: 8,
    incidents: 0,
    lastSync: '10 seconds ago',
    capacity: 91,
    version: '2.1.0',
    criticalDeps: 5,
  },
];

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Platform Engineering',
    description: 'Core platform services and infrastructure',
    members: 8,
    lead: 'Alice Johnson',
    services: 5,
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'team-2',
    name: 'Security Team',
    description: 'Security, authentication, and compliance',
    members: 5,
    lead: 'Bob Smith',
    services: 2,
    createdAt: '2023-02-01T00:00:00Z',
  },
  {
    id: 'team-3',
    name: 'Backend Services',
    description: 'User and business logic services',
    members: 10,
    lead: 'Carol White',
    services: 6,
    createdAt: '2023-01-20T00:00:00Z',
  },
  {
    id: 'team-4',
    name: 'Data & Analytics',
    description: 'Data pipeline and analytics infrastructure',
    members: 6,
    lead: 'Frank Wilson',
    services: 3,
    createdAt: '2023-03-10T00:00:00Z',
  },
  {
    id: 'team-5',
    name: 'DevOps',
    description: 'Infrastructure and deployment automation',
    members: 7,
    lead: 'Grace Lee',
    services: 4,
    createdAt: '2023-01-25T00:00:00Z',
  },
];

// Helper functions for mock data
export function getServiceById(id: string): Service | undefined {
  return mockServices.find((s) => s.id === id);
}

export function getServicesByTeam(team: string): Service[] {
  return mockServices.filter((s) => s.team === team);
}

export function getIncidentsByService(service: string): Incident[] {
  return mockIncidents.filter((i) => i.service === service);
}

export function getAlertsByService(service: string): Alert[] {
  return mockAlerts.filter((a) => a.service === service);
}

export function getActiveAlerts(): Alert[] {
  return mockAlerts.filter((a) => a.status === 'active');
}

export function getCriticalAlerts(): Alert[] {
  return mockAlerts.filter((a) => a.status === 'active' && a.severity === 'critical');
}

export function getInvestigatingIncidents(): Incident[] {
  return mockIncidents.filter((i) => i.status === 'investigating');
}

export function getDegradedServices(): Service[] {
  return mockServices.filter((s) => s.status === 'degraded' || s.status === 'down');
}

export function getRecentDeployments(limit: number = 5): Deployment[] {
  return mockDeployments.slice(0, limit);
}

export function getTeamMembers(teamId: string): { name: string; role: string }[] {
  const team = mockTeams.find((t) => t.id === teamId);
  if (!team) return [];
  
  return [
    { name: team.lead, role: 'Team Lead' },
    { name: 'Team Member 1', role: 'Senior Engineer' },
    { name: 'Team Member 2', role: 'Engineer' },
  ];
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
}
