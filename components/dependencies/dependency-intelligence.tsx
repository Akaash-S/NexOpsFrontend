'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, Zap, TrendingUp, CheckCircle, GitBranch, X } from 'lucide-react'

interface DependencyIntelligenceProps {
  nodeId: string
  onClose?: () => void
}

const serviceData: Record<string, any> = {
  'api-gateway': {
    name: 'API Gateway',
    health: 98,
    status: 'healthy',
    criticality: 'critical',
    owner: 'Sarah Chen',
    dependencies: ['auth-service', 'rate-limiter', 'cache-layer'],
    dependents: ['mobile-app', 'web-client', 'partner-api'],
    blastRadius: 'Very High',
    singlePointOfFailure: true,
    criticalPath: true,
    health24h: '98% → 98%',
    insights: [
      {
        type: 'warning',
        title: '3 downstream services depend on this',
        description: 'Changes will affect mobile app, web client, and partner API',
      },
      {
        type: 'critical',
        title: 'Single point of failure identified',
        description: 'No redundant API gateway. Consider implementing failover.',
      },
    ],
  },
  'auth-service': {
    name: 'Auth Service',
    health: 99,
    status: 'healthy',
    criticality: 'critical',
    owner: 'Marcus Johnson',
    dependencies: ['database', 'redis', 'secrets-manager'],
    dependents: ['api-gateway', 'admin-panel', 'user-dashboard'],
    blastRadius: 'Very High',
    singlePointOfFailure: true,
    criticalPath: true,
    health24h: '99% → 99%',
    insights: [
      {
        type: 'success',
        title: 'Excellent reliability record',
        description: '99% uptime maintained. No incidents in 60 days.',
      },
      {
        type: 'info',
        title: 'Recommended for critical path optimization',
        description: 'Consider caching authentication tokens in edge locations.',
      },
    ],
  },
  'search-service': {
    name: 'Search Service',
    health: 85,
    status: 'warning',
    criticality: 'high',
    owner: 'Elena Rodriguez',
    dependencies: ['elasticsearch', 'kafka', 'cache-layer'],
    dependents: ['api-gateway', 'analytics-dashboard'],
    blastRadius: 'High',
    singlePointOfFailure: false,
    criticalPath: false,
    health24h: '92% → 85%',
    insights: [
      {
        type: 'warning',
        title: 'Health declining (92% → 85%)',
        description: 'Performance degradation detected in last 6 hours.',
      },
      {
        type: 'info',
        title: '2 services depend on search',
        description: 'Changes impact analytics and API responses.',
      },
    ],
  },
  'notification-service': {
    name: 'Notification Service',
    health: 92,
    status: 'healthy',
    criticality: 'medium',
    owner: 'James Liu',
    dependencies: ['kafka', 'email-provider', 'sms-provider'],
    dependents: ['api-gateway', 'user-dashboard'],
    blastRadius: 'Medium',
    singlePointOfFailure: false,
    criticalPath: false,
    health24h: '90% → 92%',
    insights: [
      {
        type: 'success',
        title: 'Health improving',
        description: 'Upward trend over last 24 hours.',
      },
    ],
  },
  'analytics-engine': {
    name: 'Analytics Engine',
    health: 88,
    status: 'healthy',
    criticality: 'medium',
    owner: 'Lisa Wang',
    dependencies: ['kafka', 'bigquery', 'data-warehouse'],
    dependents: ['analytics-dashboard', 'reports-api'],
    blastRadius: 'Low',
    singlePointOfFailure: false,
    criticalPath: false,
    health24h: '86% → 88%',
    insights: [
      {
        type: 'info',
        title: 'Stable performance',
        description: 'Consistent health metrics. No action required.',
      },
    ],
  },
}

export function DependencyIntelligence({ nodeId, onClose }: DependencyIntelligenceProps) {
  const service = serviceData[nodeId] || {
    name: nodeId,
    health: 90,
    status: 'healthy',
    criticality: 'medium',
    owner: 'Unknown',
    dependencies: [],
    dependents: [],
    blastRadius: 'Medium',
    singlePointOfFailure: false,
    criticalPath: false,
    insights: [],
  }

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 text-success" />,
    warning: <AlertTriangle className="w-4 h-4 text-warning" />,
    critical: <AlertTriangle className="w-4 h-4 text-destructive" />,
    info: <Zap className="w-4 h-4 text-primary" />,
  }

  return (
    <ScrollArea className="h-full border border-border rounded-lg">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">{service.name}</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{service.health}% Health</Badge>
              <Badge variant="outline">{service.criticality}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Owned by {service.owner}</p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Health Trend */}
        <Card className="p-3 bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">24h Health Trend</p>
          <p className="text-sm font-semibold text-foreground">{service.health24h}</p>
        </Card>

        {/* Risk Metrics */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Risk Analysis</h4>
          <Card className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Blast Radius</span>
              <Badge variant="outline">{service.blastRadius}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">SPOF</span>
              {service.singlePointOfFailure ? (
                <Badge className="bg-destructive">Yes</Badge>
              ) : (
                <Badge variant="outline">No</Badge>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Critical Path</span>
              {service.criticalPath ? (
                <Badge className="bg-primary">Yes</Badge>
              ) : (
                <Badge variant="outline">No</Badge>
              )}
            </div>
          </Card>
        </div>

        {/* Dependencies */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Dependencies</h4>
          <div className="space-y-1.5">
            {service.dependencies.length === 0 ? (
              <p className="text-xs text-muted-foreground">No dependencies</p>
            ) : (
              service.dependencies.map((dep: string) => (
                <Card key={dep} className="p-2 flex items-center gap-2">
                  <GitBranch className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-foreground flex-1">{dep}</span>
                  <Badge variant="outline" className="text-xs">Required</Badge>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Dependents */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Dependents</h4>
          <div className="space-y-1.5">
            {service.dependents.length === 0 ? (
              <p className="text-xs text-muted-foreground">No dependents</p>
            ) : (
              service.dependents.map((dep: string) => (
                <Card key={dep} className="p-2 flex items-center gap-2">
                  <GitBranch className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-foreground flex-1">{dep}</span>
                  <Badge variant="outline" className="text-xs">Depends</Badge>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* AI Insights */}
        {service.insights.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">AI Insights</h4>
            <div className="space-y-2">
              {service.insights.map((insight: any, idx: number) => (
                <Card key={idx} className="p-3 border-l-2 border-l-primary">
                  <div className="flex gap-2">
                    <div className="mt-0.5 flex-shrink-0">
                      {iconMap[insight.type as keyof typeof iconMap]}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
          <Button size="sm" variant="outline">View Details</Button>
          <Button size="sm">View Deployments</Button>
        </div>
      </div>
    </ScrollArea>
  )
}
