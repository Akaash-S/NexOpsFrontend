'use client'

import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, GitBranch, Package, AlertTriangle } from 'lucide-react'

const CHANGES = [
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

const IMPACT_ANALYSIS = [
  { service: 'API Gateway', risk: 78, health: 98, users: 12000 },
  { service: 'Search Service', risk: 45, health: 96, users: 8500 },
  { service: 'Database', risk: 32, health: 98, users: 25000 },
  { service: 'Cache Layer', risk: 12, health: 92, users: 15000 },
]

export default function ChangeImpactPage() {
  return (
    <>
      
      <>
        <PageContent>
          <PageHeader
            title="Change Impact Analysis"
            description="Correlate what changed with what was affected across your infrastructure"
          />

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Today's Changes</div>
              <div className="text-2xl font-bold">24</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Affected Services</div>
              <div className="text-2xl font-bold">8</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Incident Correlation</div>
              <div className="text-2xl font-bold text-warning">1</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Avg Blast Radius</div>
              <div className="text-2xl font-bold">4.5k users</div>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Change Timeline</h3>
            <div className="space-y-3">
              {CHANGES.map((change) => (
                <div key={change.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="mt-1">
                      {change.type === 'commit' && (
                        <GitBranch className="w-5 h-5 text-primary" />
                      )}
                      {change.type === 'deployment' && (
                        <Package className="w-5 h-5 text-success" />
                      )}
                      {change.type === 'infrastructure' && (
                        <AlertTriangle className="w-5 h-5 text-warning" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="font-semibold">
                        {change.type === 'commit' && `${change.message} (${change.hash})`}
                        {change.type === 'deployment' && `Deployed ${change.version} - ${change.service}`}
                        {change.type === 'infrastructure' && change.change}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {change.type === 'commit' && `By ${change.author} • ${change.files} files`}
                        {change.type === 'deployment' && `To ${change.cluster}`}
                      </div>
                    </div>

                    {/* Impact & Time */}
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`${
                          change.impact === 'high'
                            ? 'bg-destructive/10 text-destructive'
                            : change.impact === 'medium'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                        }`}
                      >
                        {change.impact} impact
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-2">{change.time}</div>
                    </div>
                  </div>

                  {/* Affected Services */}
                  <div className="flex gap-2 mt-3 ml-9">
                    {change.affectedServices.map((svc) => (
                      <Badge key={svc} variant="outline" className="text-xs">
                        {svc}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Impact Analysis */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Service Impact Matrix</h3>
            <div className="space-y-3">
              {IMPACT_ANALYSIS.map((item) => (
                <div key={item.service} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{item.service}</h4>
                    <span className="text-sm text-muted-foreground">{item.users.toLocaleString()} users</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Change Risk</div>
                      <div className="font-semibold">{item.risk}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Service Health</div>
                      <div className="font-semibold">{item.health}%</div>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm" className="gap-2">
                        Analyze
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </PageContent>
      </>
    </>
  )
}
