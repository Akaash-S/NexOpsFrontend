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

export const mockNotifications = [
  {
    id: 'n1',
    title: 'High latency detected',
    description: 'payment-service latency spiked to 2.5s',
    type: 'warning',
    timestamp: '5m ago',
    read: false,
  },
  {
    id: 'n2',
    title: 'Deployment successful',
    description: 'auth-service v1.4.2 deployed to production',
    type: 'success',
    timestamp: '15m ago',
    read: false,
  },
  {
    id: 'n3',
    title: 'Cluster capacity alert',
    description: 'us-east-1 memory usage exceeded 85%',
    type: 'error',
    timestamp: '1h ago',
    read: true,
  },
] as const

export const SERVICES_DATA = mockServices.map((service, index) => ({
  id: service.id,
  name: service.name,
  team: service.team,
  health: Math.round(service.uptime),
  status: service.status as 'healthy' | 'critical' | 'warning',
  deployments: (index * 7) % 20 + 5, // Deterministic mock data to prevent hydration errors
  dependencies: service.dependencies,
  dependents: [],
  lastDeployed: service.lastDeployed,
  owner: service.owner,
  criticality: service.status === 'down' ? 'critical' : service.status === 'degraded' ? 'high' : 'medium',
  changeFailureRate: service.errorRate * 100,
  deploymentFrequency: 'daily',
  mttr: '15 min',
  incidents30d: service.status === 'down' ? 3 : service.status === 'degraded' ? 1 : 0,
}));

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

export const REPOSITORIES_DATA = mockRepositories.map((repo, index) => ({
  id: repo.id,
  name: repo.name,
  owner: repo.owner,
  description: repo.description,
  health: 90 + ((index * 3) % 10),
  status: 'healthy' as 'healthy' | 'critical' | 'warning',
  prs: (index * 5) % 10,
  commits30d: repo.commits,
  stars: repo.stars,
  securityIssues: index % 3 === 0 ? 1 : 0,
  dependencies: 10 + ((index * 7) % 30),
  codeQuality: 85 + ((index * 2) % 15),
  coverage: 75 + ((index * 4) % 20),
  lastUpdated: repo.lastCommit.split('T')[0] + ' ' + repo.lastCommit.split('T')[1].substring(0, 5),
}));

export const PIPELINES_DATA = [
  {
    id: 'api-build-deploy',
    name: 'API Build & Deploy',
    repository: 'nexops-api',
    status: 'healthy',
    successRate: 98,
    failureRate: 2,
    avgDuration: '8m 24s',
    lastRun: '5 minutes ago',
    runCount30d: 145,
    avgFailureTime: '45s',
    reliability: 98,
  },
  {
    id: 'ui-build-test',
    name: 'UI Build & Test',
    repository: 'nexops-ui',
    status: 'healthy',
    successRate: 96,
    failureRate: 4,
    avgDuration: '12m 15s',
    lastRun: '2 minutes ago',
    runCount30d: 132,
    avgFailureTime: '2m 30s',
    reliability: 96,
  },
  {
    id: 'infra-provision',
    name: 'Infrastructure Provision',
    repository: 'nexops-helm',
    status: 'warning',
    successRate: 91,
    failureRate: 9,
    avgDuration: '25m 45s',
    lastRun: '30 minutes ago',
    runCount30d: 64,
    avgFailureTime: '8m 15s',
    reliability: 91,
  },
];

export const PIPELINE_FAILURE_TREND = [
  { week: 'Week 1', failures: 3, recovered: 3 },
  { week: 'Week 2', failures: 2, recovered: 2 },
  { week: 'Week 3', failures: 5, recovered: 5 },
  { week: 'Week 4', failures: 2, recovered: 2 },
];

export const DEPLOYMENTS_DATA = mockDeployments.map((dep, index) => ({
  id: dep.id,
  service: dep.service,
  version: dep.version,
  environment: dep.environment,
  status: (dep.status === 'success' ? 'success' : dep.status === 'in-progress' ? 'pending' : 'failed') as 'success' | 'failed' | 'pending' | 'rollback',
  riskScore: dep.status === 'failed' ? 85 : 10 + ((index * 7) % 30),
  confidence: dep.status === 'failed' ? 45 : 95 - ((index * 3) % 10),
  deployedAt: dep.deployedAt.split('T')[0] + ' ' + dep.deployedAt.split('T')[1].substring(0, 5),
  duration: formatDuration(dep.duration),
  changesCount: dep.changes,
  affectedServices: 2 + (index % 5),
  blastRadius: dep.changes > 10 ? 'high' : dep.changes > 5 ? 'medium' : 'low',
  rollbackReady: dep.status !== 'in-progress',
}));

export const DEPLOYMENT_TREND = [
  { date: 'Mon', success: 8, failed: 1, rolled: 0 },
  { date: 'Tue', success: 12, failed: 0, rolled: 0 },
  { date: 'Wed', success: 10, failed: 2, rolled: 1 },
  { date: 'Thu', success: 15, failed: 1, rolled: 0 },
  { date: 'Fri', success: 9, failed: 1, rolled: 0 },
];

export const RELEASES_DATA = mockReleases.map((rel, index) => {
  const statusMap: { [key: string]: 'released' | 'staged' | 'draft' | 'archived' } = {
    'released': 'released',
    'scheduled': 'staged',
    'draft': 'draft',
    'archived': 'archived',
  };
  
  return {
    id: rel.version,
    service: rel.services[0] || 'Unknown',
    status: statusMap[rel.status] || 'draft',
    releaseDate: rel.targetDate.split('T')[0],
    changesCount: 5 + ((index * 13) % 30),
    deployments: (index * 7) % 5,
    rollbacks: index % 3 === 0 ? 1 : 0,
    health: 90 + ((index * 11) % 10),
    adoptionRate: 20 + ((index * 23) % 80),
    incidents: (index * 5) % 3,
  }
});

export const ADOPTION_TREND = [
  { week: 'W1', rate: 12 },
  { week: 'W2', rate: 28 },
  { week: 'W3', rate: 54 },
  { week: 'W4', rate: 87 },
];

export const RELEASE_TREND = [
  { date: 'Mon', releases: 3, rollbacks: 0 },
  { date: 'Tue', releases: 5, rollbacks: 1 },
  { date: 'Wed', releases: 4, rollbacks: 0 },
  { date: 'Thu', releases: 6, rollbacks: 0 },
  { date: 'Fri', releases: 2, rollbacks: 0 },
];

export const ALERTS_DATA = mockAlerts.map((alert, index) => {
  const severityMap: { [key: string]: 'critical' | 'high' | 'medium' | 'low' } = {
    'critical': 'critical',
    'warning': 'high',
    'info': 'low',
  };
  return {
    id: alert.id,
    title: alert.title,
    severity: severityMap[alert.severity] || 'medium',
    status: (alert.status === 'active' ? 'firing' : 'resolved') as 'firing' | 'resolved',
    cluster: 'prod-us-east-1',
    services: [alert.service],
    value: alert.current,
    threshold: alert.threshold,
    createdAt: alert.createdAt.split('T')[0] + ' ' + alert.createdAt.split('T')[1].substring(0, 5),
    duration: `${5 + (index * 7) % 60}m`,
    correlatedAlerts: (index * 3) % 4,
    suggestedActions: [
      `Review ${alert.service} metrics`,
      `Check current load and trends`,
    ],
  };
});

export const INCIDENTS_DATA = mockIncidents.map((inc, index) => ({
  id: inc.id,
  title: inc.title,
  severity: (inc.severity === 'low' ? 'medium' : inc.severity) as 'critical' | 'high' | 'medium',
  status: (inc.status === 'investigating' ? 'open' : inc.status === 'monitoring' ? 'investigating' : 'resolved') as 'resolved' | 'open' | 'investigating',
  startTime: inc.startedAt.split('T')[0] + ' ' + inc.startedAt.split('T')[1].substring(0, 5),
  duration: `${45 + (index * 13) % 120}m`,
  durationMins: 45 + (index * 13) % 120, // For sorting
  lead: inc.assignee,
  affectedServices: [inc.service],
  affectedClusters: ['prod-us-east-1'],
  rootCause: inc.status === 'resolved' ? inc.description : 'Investigation in progress',
  impactedUsers: inc.affectedUsers,
  relatedDeployments: [],
  relatedAlerts: 1 + (index % 5),
  timeline: inc.timeline.map((event) => ({
    time: event.timestamp.split('T')[1].substring(0, 5),
    event: event.action,
    status: 'info' as const,
  })),
  resolutionNotes: inc.description,
}));

export const CLUSTER_HEALTH_DATA = [
  {
    name: 'prod-us-east-1',
    health: 98,
    availability: 99.95,
    slo: 99.9,
    services: 24,
    nodes: 18,
    status: 'healthy',
  },
  {
    name: 'prod-eu-west-1',
    health: 96,
    availability: 99.87,
    slo: 99.9,
    services: 18,
    nodes: 12,
    status: 'healthy',
  },
  {
    name: 'prod-us-west-2',
    health: 92,
    availability: 99.75,
    slo: 99.9,
    services: 12,
    nodes: 9,
    status: 'warning',
  },
  {
    name: 'staging-us-east-1',
    health: 88,
    availability: 98.5,
    slo: 99.0,
    services: 8,
    nodes: 4,
    status: 'warning',
  },
]

export const SERVICE_HEALTH_DATA = [
  { name: 'API Gateway', health: 99, slo: 99.9, status: 'healthy' },
  { name: 'Search Service', health: 96, slo: 99.5, status: 'healthy' },
  { name: 'Database', health: 98, slo: 99.95, status: 'healthy' },
  { name: 'Notification Service', health: 94, slo: 99.0, status: 'warning' },
  { name: 'Auth Service', health: 97, slo: 99.95, status: 'healthy' },
  { name: 'Cache', health: 92, slo: 99.0, status: 'warning' },
]

export const HEALTH_TREND_DATA = [
  { date: '1 week', health: 94 },
  { date: '6 days', health: 95 },
  { date: '5 days', health: 94 },
  { date: '4 days', health: 96 },
  { date: '3 days', health: 95 },
  { date: '2 days', health: 97 },
  { date: 'Today', health: 96 },
]

export const RELIABILITY_COMPARISON_DATA = [
  { service: 'API', actual: 99.95, slo: 99.9 },
  { service: 'DB', actual: 99.87, slo: 99.95 },
  { service: 'Search', actual: 99.75, slo: 99.5 },
  { service: 'Auth', actual: 99.82, slo: 99.95 },
  { service: 'Cache', actual: 98.5, slo: 99.0 },
]

export const CHANGES_DATA = [
  {
    id: 'commit-1',
    type: 'commit',
    hash: 'a3f4e2d',
    message: 'Fix: API response serialization',
    author: 'Sarah Chen',
    time: '2 hours ago',
    repo: 'nexops-api',
    files: 3,
    affectedServices: ['api-gateway', 'rate-limiter'],
    impact: 'medium',
    incidents: 0,
  },
  {
    id: 'deploy-1',
    type: 'deployment',
    version: 'v2.4.1',
    service: 'API Gateway',
    time: '1 hour ago',
    cluster: 'prod-us-east-1',
    affectedServices: ['api-gateway'],
    impact: 'high',
    incidents: 1,
  },
  {
    id: 'commit-2',
    type: 'commit',
    hash: 'b2e1c9f',
    message: 'Feat: Add caching layer',
    author: 'Marcus Johnson',
    time: '45 minutes ago',
    repo: 'nexops-api',
    files: 8,
    affectedServices: ['search-service', 'database'],
    impact: 'high',
    incidents: 0,
  },
  {
    id: 'infra-1',
    type: 'infrastructure',
    change: 'Database connection pool increased 50->100',
    time: '30 minutes ago',
    cluster: 'prod-us-east-1',
    affectedServices: ['database', 'api-gateway', 'search-service'],
    impact: 'low',
    incidents: 0,
  },
]

export const IMPACT_ANALYSIS_DATA = [
  { service: 'API Gateway', risk: 78, health: 98, users: 12000 },
  { service: 'Search Service', risk: 45, health: 96, users: 8500 },
  { service: 'Database', risk: 32, health: 98, users: 25000 },
  { service: 'Cache Layer', risk: 12, health: 92, users: 15000 },
]

export const RISK_SERVICES_DATA = [
  {
    name: 'Search Service',
    riskScore: 78,
    trend: 'increasing',
    failureProbability: 12.5,
    mtbf: '18 days',
    issues: 8,
    vulnerabilities: 3,
  },
  {
    name: 'Notification Service',
    riskScore: 65,
    trend: 'stable',
    failureProbability: 8.2,
    mtbf: '31 days',
    issues: 5,
    vulnerabilities: 1,
  },
  {
    name: 'Cache Layer',
    riskScore: 52,
    trend: 'increasing',
    failureProbability: 6.8,
    mtbf: '42 days',
    issues: 3,
    vulnerabilities: 0,
  },
  {
    name: 'Auth Service',
    riskScore: 38,
    trend: 'decreasing',
    failureProbability: 2.1,
    mtbf: '147 days',
    issues: 1,
    vulnerabilities: 2,
  },
  {
    name: 'API Gateway',
    riskScore: 28,
    trend: 'stable',
    failureProbability: 1.2,
    mtbf: '243 days',
    issues: 0,
    vulnerabilities: 0,
  },
]

export const VULNERABLE_DEPS_DATA = [
  { name: 'axios', version: '1.4.0', cves: 2, severity: 'medium', risk: 65 },
  { name: 'zod', version: '3.21.4', cves: 1, severity: 'low', risk: 28 },
  { name: 'lodash', version: '4.17.21', cves: 3, severity: 'high', risk: 78 },
  { name: 'moment', version: '2.29.1', cves: 1, severity: 'medium', risk: 45 },
]

export const RISK_MATRIX_DATA = [
  { x: 10, y: 80, size: 1, service: 'API Gateway' },
  { x: 35, y: 65, size: 2, service: 'Notification' },
  { x: 45, y: 78, size: 3, service: 'Search Service' },
  { x: 60, y: 52, size: 2, service: 'Cache' },
  { x: 75, y: 38, size: 1, service: 'Auth' },
]

export const RECOMMENDATIONS_DATA = [
  {
    id: 'rec-001',
    priority: 'critical',
    category: 'Performance',
    issue: 'High API Gateway latency (p99: 850ms)',
    action: 'Implement request caching and CDN',
    impact: 'Could reduce latency by 40-60%',
    confidence: 98,
    estimatedSavings: '$12,000/month',
    affectedServices: ['api-gateway', 'web-app'],
    owner: 'Platform Team',
    effort: 'medium',
  },
  {
    id: 'rec-002',
    priority: 'high',
    category: 'Reliability',
    issue: 'Database connection pool exhaustion',
    action: 'Increase pool size from 50 to 100 connections',
    impact: 'Reduce timeout errors by 85%',
    confidence: 95,
    estimatedSavings: 'Prevent 1-2 outages/month',
    affectedServices: ['database', 'api-gateway'],
    owner: 'Infrastructure Team',
    effort: 'low',
  },
  {
    id: 'rec-003',
    priority: 'high',
    category: 'Cost',
    issue: 'Idle compute resources in non-prod',
    action: 'Implement auto-shutdown for non-prod clusters',
    impact: 'Save 30% on compute costs',
    confidence: 92,
    estimatedSavings: '$8,500/month',
    affectedServices: ['staging', 'dev'],
    owner: 'Platform Team',
    effort: 'low',
  },
  {
    id: 'rec-004',
    priority: 'medium',
    category: 'Security',
    issue: 'Outdated dependencies in search service',
    action: 'Update to latest versions with security patches',
    impact: 'Fix 3 CVEs with CVSS > 7.0',
    confidence: 100,
    estimatedSavings: 'Risk reduction',
    affectedServices: ['search-service'],
    owner: 'Search Team',
    effort: 'low',
  },
  {
    id: 'rec-005',
    priority: 'medium',
    category: 'Observability',
    issue: 'Missing traces in notification service',
    action: 'Implement distributed tracing',
    impact: 'Enable root cause analysis for 90% of issues',
    confidence: 88,
    estimatedSavings: '4 hours/incident investigation',
    affectedServices: ['notification-service'],
    owner: 'DevOps Team',
    effort: 'high',
  },
]

export const RULES_DATA = [
  {
    id: 'rule-1',
    name: 'Auto-scale on high CPU',
    trigger: 'CPU > 80% for 5 min',
    action: 'Scale cluster +20%',
    enabled: true,
    executions: 24,
    successRate: 98,
    lastExecution: '2 minutes ago',
  },
  {
    id: 'rule-2',
    name: 'Restart service on crash',
    trigger: 'Service exit code != 0',
    action: 'Restart service',
    enabled: true,
    executions: 15,
    successRate: 100,
    lastExecution: '1 hour ago',
  },
  {
    id: 'rule-3',
    name: 'Create incident on critical alert',
    trigger: 'Alert severity = critical',
    action: 'Create incident + notify team',
    enabled: true,
    executions: 8,
    successRate: 100,
    lastExecution: '2 days ago',
  },
  {
    id: 'rule-4',
    name: 'Snapshot before deployment',
    trigger: 'Deployment started',
    action: 'Create database snapshot',
    enabled: true,
    executions: 42,
    successRate: 99,
    lastExecution: '1 minute ago',
  },
  {
    id: 'rule-5',
    name: 'Cleanup old logs',
    trigger: 'Daily at 2 AM UTC',
    action: 'Delete logs > 30 days old',
    enabled: false,
    executions: 28,
    successRate: 100,
    lastExecution: '1 day ago',
  },
]

export const WORKFLOWS_DATA = [
  {
    id: 'wf-1',
    name: 'Incident Response',
    status: 'active',
    runs: 145,
    lastRun: '5 minutes ago',
    avgDuration: '8m 42s',
    successRate: 98,
    steps: 8,
  },
  {
    id: 'wf-2',
    name: 'Deployment Preparation',
    status: 'active',
    runs: 87,
    lastRun: '2 hours ago',
    avgDuration: '3m 15s',
    successRate: 100,
    steps: 5,
  },
  {
    id: 'wf-3',
    name: 'Health Check & Recovery',
    status: 'active',
    runs: 234,
    lastRun: '1 minute ago',
    avgDuration: '2m 30s',
    successRate: 99,
    steps: 6,
  },
  {
    id: 'wf-4',
    name: 'Daily Backup & Archive',
    status: 'scheduled',
    runs: 30,
    lastRun: '1 day ago',
    avgDuration: '15m 20s',
    successRate: 100,
    steps: 4,
  },
  {
    id: 'wf-5',
    name: 'Security Scan & Report',
    status: 'active',
    runs: 56,
    lastRun: '12 hours ago',
    avgDuration: '25m 45s',
    successRate: 97,
    steps: 7,
  },
]

export const TEAMS_DATA = [
  {
    id: 'team-1',
    name: 'Platform',
    members: 8,
    ownedServices: 12,
    ownedClusters: 2,
    activeIncidents: 1,
    onCall: 'Sarah Chen',
  },
  {
    id: 'team-2',
    name: 'Frontend',
    members: 6,
    ownedServices: 5,
    ownedClusters: 1,
    activeIncidents: 0,
    onCall: 'James Liu',
  },
  {
    id: 'team-3',
    name: 'Search',
    members: 4,
    ownedServices: 3,
    ownedClusters: 1,
    activeIncidents: 1,
    onCall: 'Marcus Johnson',
  },
  {
    id: 'team-4',
    name: 'Infrastructure',
    members: 5,
    ownedServices: 2,
    ownedClusters: 4,
    activeIncidents: 0,
    onCall: 'Elena Rodriguez',
  },
]

export const TEAM_MEMBERS_DATA = [
  { id: 'u-1', name: 'Sarah Chen', role: 'Engineering Manager', team: 'Platform', status: 'active' },
  { id: 'u-2', name: 'James Liu', role: 'Senior Engineer', team: 'Frontend', status: 'active' },
  { id: 'u-3', name: 'Marcus Johnson', role: 'Engineer', team: 'Search', status: 'active' },
  { id: 'u-4', name: 'Elena Rodriguez', role: 'DevOps Engineer', team: 'Infrastructure', status: 'active' },
  { id: 'u-5', name: 'Lisa Wang', role: 'Engineer', team: 'Frontend', status: 'away' },
]

export const INTEGRATIONS_DATA = [
  {
    id: 'int-1',
    name: 'GitHub',
    status: 'connected',
    lastSync: '5 minutes ago',
    health: 'healthy',
    config: 'nexops-org/repositories',
  },
  {
    id: 'int-2',
    name: 'Kubernetes',
    status: 'connected',
    lastSync: '1 minute ago',
    health: 'healthy',
    config: '4 clusters',
  },
  {
    id: 'int-3',
    name: 'Slack',
    status: 'connected',
    lastSync: '2 minutes ago',
    health: 'healthy',
    config: '#nexops-incidents',
  },
  {
    id: 'int-4',
    name: 'PagerDuty',
    status: 'connected',
    lastSync: '10 minutes ago',
    health: 'warning',
    config: '2 services',
  },
  {
    id: 'int-5',
    name: 'AWS',
    status: 'connected',
    lastSync: '3 minutes ago',
    health: 'healthy',
    config: '12 regions',
  },
  {
    id: 'int-6',
    name: 'Datadog',
    status: 'disconnected',
    lastSync: '3 days ago',
    health: 'error',
    config: 'Not configured',
  },
  {
    id: 'int-7',
    name: 'GitLab',
    status: 'connected',
    lastSync: '45 minutes ago',
    health: 'healthy',
    config: 'nexops-group',
  },
  {
    id: 'int-8',
    name: 'Jira',
    status: 'connected',
    lastSync: '1 hour ago',
    health: 'healthy',
    config: 'NexOps project',
  },
]

export const AUDIT_LOGS_DATA = [
  { id: 'log-1', user: 'Sarah Chen', action: 'enabled two-factor authentication', time: '2 hours ago', type: 'security' },
  { id: 'log-2', user: 'Marcus Johnson', action: 'invited Elena Rodriguez', time: '5 hours ago', type: 'team' },
  { id: 'log-3', user: 'System', action: 'Integration configured: GitHub Enterprise', time: '1 day ago', type: 'integration' },
  { id: 'log-4', user: 'Admin', action: 'Security policy updated', time: '3 days ago', type: 'security' },
  { id: 'log-5', user: 'James Liu', action: 'deleted Rule "Cleanup old logs"', time: '4 days ago', type: 'system' },
  { id: 'log-6', user: 'Elena Rodriguez', action: 'created cluster "us-east-1-prod"', time: '5 days ago', type: 'infrastructure' },
]
