'use client'

import { PageContent, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const CLUSTER_HEALTH = [
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

const SERVICE_HEALTH = [
  { name: 'API Gateway', health: 99, slo: 99.9, status: 'healthy' },
  { name: 'Search Service', health: 96, slo: 99.5, status: 'healthy' },
  { name: 'Database', health: 98, slo: 99.95, status: 'healthy' },
  { name: 'Notification Service', health: 94, slo: 99.0, status: 'warning' },
  { name: 'Auth Service', health: 97, slo: 99.95, status: 'healthy' },
  { name: 'Cache', health: 92, slo: 99.0, status: 'warning' },
]

const HEALTH_TREND = [
  { date: '1 week', health: 94 },
  { date: '6 days', health: 95 },
  { date: '5 days', health: 94 },
  { date: '4 days', health: 96 },
  { date: '3 days', health: 95 },
  { date: '2 days', health: 97 },
  { date: 'Today', health: 96 },
]

const RELIABILITY_COMPARISON = [
  { service: 'API', actual: 99.95, slo: 99.9 },
  { service: 'DB', actual: 99.87, slo: 99.95 },
  { service: 'Search', actual: 99.75, slo: 99.5 },
  { service: 'Auth', actual: 99.82, slo: 99.95 },
  { service: 'Cache', actual: 98.5, slo: 99.0 },
]

export default function HealthPage() {
  return (
    <>
      
      <>
        <PageContent>
          <PageHeader
            title="Health Center"
            description="System health intelligence with reliability forecasting, SLO/SLA tracking, and operational insights"
          />

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Overall Health</div>
              <div className="text-2xl font-bold">96%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Healthy Clusters</div>
              <div className="text-2xl font-bold">2/4</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">SLO Compliance</div>
              <div className="text-2xl font-bold text-success">99.9%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Avg Availability</div>
              <div className="text-2xl font-bold">99.88%</div>
            </Card>
          </div>

          {/* Trends */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Health Trend (7 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={HEALTH_TREND}>
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[90, 100]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="health"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorHealth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">SLO vs Actual Availability</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={RELIABILITY_COMPARISON}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service" />
                  <YAxis domain={[98.5, 100]} />
                  <Tooltip />
                  <Bar dataKey="slo" fill="hsl(var(--muted-foreground))" opacity={0.5} />
                  <Bar dataKey="actual" fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Cluster Health */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Cluster Health</h3>
            <div className="space-y-4">
              {CLUSTER_HEALTH.map((cluster) => (
                <div key={cluster.name} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{cluster.name}</h4>
                    <Badge
                      variant="secondary"
                      className={`${
                        cluster.status === 'healthy'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {cluster.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Health</div>
                      <Progress value={cluster.health} className="h-2 mb-1" />
                      <div className="font-semibold">{cluster.health}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Availability</div>
                      <div className="font-semibold">{cluster.availability}%</div>
                      <div className="text-xs">SLO: {cluster.slo}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Services</div>
                      <div className="font-semibold">{cluster.services}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Nodes</div>
                      <div className="font-semibold">{cluster.nodes}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Service Health */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Service Health Dashboard</h3>
            <div className="space-y-3">
              {SERVICE_HEALTH.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 flex-1">
                    {service.status === 'healthy' ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-warning" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-xs text-muted-foreground">SLO: {service.slo}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={service.health} className="w-24 h-2" />
                    <span className="font-semibold w-12 text-right">{service.health}%</span>
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
