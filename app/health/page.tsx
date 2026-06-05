'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { HealthFilters } from '@/components/health/health-filters'
import { ConfigureSloDrawer } from '@/components/health/configure-slo-drawer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { CheckCircle2, AlertCircle, Plus, Settings } from 'lucide-react'
import { CLUSTER_HEALTH_DATA, SERVICE_HEALTH_DATA, HEALTH_TREND_DATA, RELIABILITY_COMPARISON_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function HealthPage() {
  const { setConfigureSloOpen } = useAppState()
  
  const [clusters, setClusters] = useState<any[]>(CLUSTER_HEALTH_DATA)
  const [services, setServices] = useState<any[]>(SERVICE_HEALTH_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'name-asc',
  })

  // Filter and Sort Logic for Clusters
  const filteredAndSortedClusters = useMemo(() => {
    return clusters
      .filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(filters.search.toLowerCase())
        const matchesStatus = filters.status === 'all' || c.status === filters.status
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'name-desc':
            return b.name.localeCompare(a.name)
          case 'health-desc':
            return b.health - a.health
          case 'health-asc':
            return a.health - b.health
          case 'availability-desc':
            return b.availability - a.availability
          case 'availability-asc':
            return a.availability - b.availability
          default:
            return 0
        }
      })
  }, [clusters, filters])

  // Filter and Sort Logic for Services
  const filteredAndSortedServices = useMemo(() => {
    return services
      .filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(filters.search.toLowerCase())
        const matchesStatus = filters.status === 'all' || s.status === filters.status
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'name-desc':
            return b.name.localeCompare(a.name)
          case 'health-desc':
            return b.health - a.health
          case 'health-asc':
            return a.health - b.health
          case 'availability-desc':
            return 0 // availability is not directly on service in this mock
          case 'availability-asc':
            return 0
          default:
            return 0
        }
      })
  }, [services, filters])

  const handleSloConfigured = (newSlo: any) => {
    // Add the new service mock if it doesn't exist, or just show a notification
  }

  const healthyClusters = clusters.filter(c => c.status === 'healthy').length

  return (
    <>
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Health Center"
            description="System health intelligence with reliability forecasting, SLO/SLA tracking, and operational insights"
          />
          <Button onClick={() => setConfigureSloOpen(true)} className="gap-2">
            <Settings className="w-4 h-4" />
            Configure SLO
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Overall Health</div>
            <div className="text-2xl font-bold">96%</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Healthy Clusters</div>
            <div className="text-2xl font-bold">{healthyClusters}/{clusters.length}</div>
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

        {/* Filters */}
        <HealthFilters filters={filters} setFilters={setFilters} />

        {/* Trends */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Health Trend (7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={HEALTH_TREND_DATA}>
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
              <BarChart data={RELIABILITY_COMPARISON_DATA}>
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
            {filteredAndSortedClusters.length > 0 ? (
              filteredAndSortedClusters.map((cluster) => (
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
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No clusters found matching your filters.
              </div>
            )}
          </div>
        </Card>

        {/* Service Health */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Service Health Dashboard</h3>
          <div className="space-y-3">
            {filteredAndSortedServices.length > 0 ? (
              filteredAndSortedServices.map((service) => (
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
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No services found matching your filters.
              </div>
            )}
          </div>
        </Card>
      </PageContent>

      {/* Configure SLO Wizard */}
      <ConfigureSloDrawer onSuccess={handleSloConfigured} />
    </>
  )
}
