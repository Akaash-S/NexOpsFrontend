'use client'

import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, TrendingUp, Package, AlertCircle } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const RISK_SERVICES = [
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

const VULNERABLE_DEPS = [
  { name: 'axios', version: '1.4.0', cves: 2, severity: 'medium', risk: 65 },
  { name: 'zod', version: '3.21.4', cves: 1, severity: 'low', risk: 28 },
  { name: 'lodash', version: '4.17.21', cves: 3, severity: 'high', risk: 78 },
  { name: 'moment', version: '2.29.1', cves: 1, severity: 'medium', risk: 45 },
]

const RISK_MATRIX = [
  { x: 10, y: 80, size: 1, service: 'API Gateway' },
  { x: 35, y: 65, size: 2, service: 'Notification' },
  { x: 45, y: 78, size: 3, service: 'Search Service' },
  { x: 60, y: 52, size: 2, service: 'Cache' },
  { x: 75, y: 38, size: 1, service: 'Auth' },
]

export default function RiskAnalysisPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader
            title="Risk Analysis"
            description="Predictive engineering intelligence with risk scoring, trend forecasting, and mitigation recommendations"
          />

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Critical Risk Services</div>
              <div className="text-2xl font-bold text-destructive">2</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Vulnerable Dependencies</div>
              <div className="text-2xl font-bold text-warning">4</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Avg Risk Score</div>
              <div className="text-2xl font-bold">52</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Predicted Incidents (30d)</div>
              <div className="text-2xl font-bold">3-4</div>
            </Card>
          </div>

          {/* Risk Matrix */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Risk vs Reliability Matrix</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" label={{ value: 'Failure Probability (%)', position: 'insideBottomRight', offset: -10 }} />
                <YAxis label={{ value: 'Risk Score', angle: -90, position: 'insideLeft' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  data={RISK_MATRIX}
                  fill="hsl(var(--primary))"
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>

          {/* High-Risk Services */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              High-Risk Services
            </h3>
            <div className="space-y-4">
              {RISK_SERVICES.map((service) => (
                <div key={service.name} className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{service.name}</h4>
                      <Badge
                        variant="secondary"
                        className={`${
                          service.riskScore > 70
                            ? 'bg-destructive/10 text-destructive'
                            : service.riskScore > 40
                            ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                        }`}
                      >
                        {service.riskScore}
                      </Badge>
                      {service.trend === 'increasing' && (
                        <TrendingUp className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Failure Probability</div>
                      <div className="font-semibold">{service.failureProbability}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">MTBF</div>
                      <div className="font-semibold">{service.mtbf}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Open Issues</div>
                      <div className="font-semibold">{service.issues}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Vulnerabilities</div>
                      <div className={`font-semibold ${service.vulnerabilities > 0 ? 'text-destructive' : ''}`}>
                        {service.vulnerabilities}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Trend</div>
                      <div className={`font-semibold capitalize ${
                        service.trend === 'increasing' ? 'text-destructive' : 'text-success'
                      }`}>
                        {service.trend}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Vulnerable Dependencies */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-warning" />
              Vulnerable Dependencies
            </h3>
            <div className="space-y-2">
              {VULNERABLE_DEPS.map((dep) => (
                <div key={dep.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="font-semibold">{dep.name}</div>
                    <div className="text-xs text-muted-foreground">{dep.version}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-semibold">{dep.cves}</div>
                      <div className="text-xs text-muted-foreground">CVEs</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        dep.severity === 'high'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {dep.severity}
                    </Badge>
                    <div className="w-24">
                      <Progress value={Math.min(dep.risk, 100)} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right mt-1">{dep.risk}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Section>
      </PageLayout>
    </>
  )
}
