'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, GitBranch, Clock, TrendingDown, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface Service {
  id: string
  name: string
  team: string
  health: number
  status: 'healthy' | 'warning' | 'critical'
  deployments: number
  dependencies: string[]
  dependents: string[]
  lastDeployed: string
  owner: string
  criticality: string
  changeFailureRate: number
  deploymentFrequency: string
  mttr: string
  incidents30d: number
}

interface ServiceDetailsDrawerProps {
  service: Service
  onClose: () => void
}

const deploymentData = [
  { name: 'Week 1', deployments: 8, failures: 1 },
  { name: 'Week 2', deployments: 12, failures: 0 },
  { name: 'Week 3', deployments: 10, failures: 1 },
  { name: 'Week 4', deployments: 12, failures: 0 },
]

const reliabilityData = [
  { day: 'Mon', uptime: 99.8 },
  { day: 'Tue', uptime: 99.9 },
  { day: 'Wed', uptime: 99.7 },
  { day: 'Thu', uptime: 99.9 },
  { day: 'Fri', uptime: 99.6 },
  { day: 'Sat', uptime: 99.8 },
  { day: 'Sun', uptime: 99.9 },
]

export function ServiceDetailsDrawer({ service, onClose }: ServiceDetailsDrawerProps) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (!isOpen) {
      onClose()
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-border shadow-xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">{service.name}</h2>
            <p className="text-xs text-muted-foreground">{service.team} • Owned by {service.owner}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Health Score</p>
              <p className="text-2xl font-bold text-success mt-1">{service.health}%</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">CFR</p>
              <p className="text-2xl font-bold mt-1">{service.changeFailureRate}%</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">MTTR</p>
              <p className="text-2xl font-bold text-foreground mt-1">{service.mttr}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Incidents</p>
              <p className={`text-2xl font-bold mt-1 ${service.incidents30d > 0 ? 'text-destructive' : 'text-success'}`}>
                {service.incidents30d}
              </p>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="deployment" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="deployment">Deployments</TabsTrigger>
              <TabsTrigger value="reliability">Reliability</TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            {/* Deployments Tab */}
            <TabsContent value="deployment" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-4">Deployment History</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={deploymentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                      }}
                    />
                    <Bar dataKey="deployments" fill="var(--primary)" />
                    <Bar dataKey="failures" fill="var(--destructive)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-4">
                <p className="text-sm">
                  <span className="font-semibold text-foreground">{service.deployments}</span>
                  <span className="text-muted-foreground"> deployments this month</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">Frequency: {service.deploymentFrequency}</p>
              </Card>
            </TabsContent>

            {/* Reliability Tab */}
            <TabsContent value="reliability" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-4">7-Day Uptime Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reliabilityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      style={{ fontSize: '12px' }}
                      domain={[99.5, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="uptime"
                      stroke="var(--success)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </TabsContent>

            {/* Dependencies Tab */}
            <TabsContent value="dependencies" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Dependencies</h3>
                <div className="space-y-2">
                  {service.dependencies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No dependencies</p>
                  ) : (
                    service.dependencies.map((dep) => (
                      <div key={dep} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{dep}</span>
                        <Badge variant="outline" className="ml-auto">Required</Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3">Dependents</h3>
                <div className="space-y-2">
                  {service.dependents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No dependents</p>
                  ) : (
                    service.dependents.map((dep) => (
                      <div key={dep} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <GitBranch className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{dep}</span>
                        <Badge variant="outline" className="ml-auto">Depends</Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-4">
              <Card className="p-4 border-l-2 border-l-warning">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">High deployment frequency</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This service is deployed {service.deploymentFrequency.replace('-', ' ')}. Monitor change failure rate closely.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-l-2 border-l-primary">
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">MTTR Improvement Opportunity</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Current MTTR is {service.mttr}. Consider implementing better alerting and runbooks.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-l-2 border-l-success">
                <div className="flex gap-3">
                  <TrendingDown className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Strong reliability track record</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Only {service.incidents30d} incident(s) in the last 30 days. Service is well-maintained.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
