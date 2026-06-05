'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { RiskFilters } from '@/components/risk-analysis/risk-filters'
import { RunRiskAssessmentDrawer } from '@/components/risk-analysis/run-risk-assessment-drawer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { AlertTriangle, TrendingUp, Package, ShieldAlert } from 'lucide-react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { RISK_SERVICES_DATA, VULNERABLE_DEPS_DATA, RISK_MATRIX_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function RiskAnalysisPage() {
  const { setRunRiskAssessmentOpen } = useAppState()
  
  const [riskServices, setRiskServices] = useState<any[]>(RISK_SERVICES_DATA)
  const [vulnerableDeps, setVulnerableDeps] = useState<any[]>(VULNERABLE_DEPS_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    trend: 'all',
    sortBy: 'risk-desc',
  })

  // Filter and Sort Logic for Risk Services
  const filteredAndSortedServices = useMemo(() => {
    return riskServices
      .filter((s) => {
        const matchesSearch = s.name.toLowerCase().includes(filters.search.toLowerCase())
        const matchesTrend = filters.trend === 'all' || s.trend === filters.trend
        return matchesSearch && matchesTrend
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'name-desc':
            return b.name.localeCompare(a.name)
          case 'risk-desc':
            return b.riskScore - a.riskScore
          case 'risk-asc':
            return a.riskScore - b.riskScore
          default:
            return 0
        }
      })
  }, [riskServices, filters])

  const handleAssessmentRun = (newResult: any) => {
    // We could add the result to the UI here
  }

  return (
    <>
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Risk Analysis"
            description="Predictive engineering intelligence with risk scoring, trend forecasting, and mitigation recommendations"
          />
          <Button onClick={() => setRunRiskAssessmentOpen(true)} className="gap-2">
            <ShieldAlert className="w-4 h-4" />
            Run Assessment
          </Button>
        </div>

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

        {/* Filters */}
        <RiskFilters filters={filters} setFilters={setFilters} />

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
                data={RISK_MATRIX_DATA}
                fill="hsl(var(--primary))"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* High-Risk Services */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Service Risk Profile
            </h3>
            <div className="space-y-4">
              {filteredAndSortedServices.length > 0 ? (
                filteredAndSortedServices.map((service) => (
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
                        <div className="text-muted-foreground mb-1 text-[10px] uppercase font-semibold">Failure Prob</div>
                        <div className="font-semibold">{service.failureProbability}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1 text-[10px] uppercase font-semibold">MTBF</div>
                        <div className="font-semibold">{service.mtbf}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1 text-[10px] uppercase font-semibold">Open Issues</div>
                        <div className="font-semibold">{service.issues}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1 text-[10px] uppercase font-semibold">Vulns</div>
                        <div className={`font-semibold ${service.vulnerabilities > 0 ? 'text-destructive' : ''}`}>
                          {service.vulnerabilities}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1 text-[10px] uppercase font-semibold">Trend</div>
                        <div className={`font-semibold capitalize ${
                          service.trend === 'increasing' ? 'text-destructive' : 'text-success'
                        }`}>
                          {service.trend}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                  No services found matching your filters.
                </div>
              )}
            </div>
          </Card>

          {/* Vulnerable Dependencies */}
          <Card className="p-6 h-fit">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-warning" />
              Vulnerable Dependencies
            </h3>
            <div className="space-y-2">
              {vulnerableDeps.map((dep) => (
                <div key={dep.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{dep.name}</div>
                    <div className="text-xs text-muted-foreground">{dep.version}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-semibold">{dep.cves}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">CVEs</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        dep.severity === 'high'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-warning/10 text-warning border-warning/20'
                      }`}
                    >
                      {dep.severity}
                    </Badge>
                    <div className="w-24">
                      <Progress value={Math.min(dep.risk, 100)} className="h-2" />
                      <div className="text-[10px] text-muted-foreground text-right mt-1">{dep.risk}% risk</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageContent>

      {/* Run Risk Assessment Wizard */}
      <RunRiskAssessmentDrawer onSuccess={handleAssessmentRun} />
    </>
  )
}
