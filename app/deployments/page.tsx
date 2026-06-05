'use client'

import { useState, useMemo } from 'react'
import { PageContent, PageHeader } from '@/components/layout'
import { DeploymentTable } from '@/components/deployments/deployment-table'
import { DeploymentDrawer } from '@/components/deployments/deployment-drawer'
import { DeploymentFilters } from '@/components/deployments/deployment-filters'
import { CreateDeploymentDrawer } from '@/components/deployments/create-deployment-drawer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-react'
import { DEPLOYMENTS_DATA, DEPLOYMENT_TREND } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

export default function DeploymentsPage() {
  const { setCreateDeploymentOpen } = useAppState()
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null)
  
  const [deployments, setDeployments] = useState<any[]>(DEPLOYMENTS_DATA)

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    environment: 'all',
    sortBy: 'risk-desc',
  })

  // Filter and Sort Logic
  const filteredAndSortedDeployments = useMemo(() => {
    return deployments
      .filter((dep) => {
        const matchesSearch =
          dep.service.toLowerCase().includes(filters.search.toLowerCase()) ||
          dep.version.toLowerCase().includes(filters.search.toLowerCase())
        const matchesStatus = filters.status === 'all' || dep.status === filters.status
        const matchesEnv = filters.environment === 'all' || dep.environment === filters.environment
        return matchesSearch && matchesStatus && matchesEnv
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'risk-desc':
            return b.riskScore - a.riskScore
          case 'risk-asc':
            return a.riskScore - b.riskScore
          case 'confidence-desc':
            return b.confidence - a.confidence
          case 'changes-desc':
            return b.changesCount - a.changesCount
          default:
            return 0
        }
      })
  }, [deployments, filters])

  const selectedDeploymentData = deployments.find((d) => d.id === selectedDeployment) as any

  const handleDeploymentCreated = (newDeployment: any) => {
    setDeployments([newDeployment, ...deployments])
  }

  return (
    <>
      <PageContent>
        <div className="flex items-center justify-between mb-6">
          <PageHeader
            title="Deployments"
            description="Release intelligence with risk analysis, environment health, and rollback readiness"
          />
          <Button onClick={() => setCreateDeploymentOpen(true)} className="gap-2">
            <Rocket className="w-4 h-4" />
            New Deployment
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Success Rate</div>
            <div className="text-2xl font-bold">96%</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Deployments (Week)</div>
            <div className="text-2xl font-bold">54</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Avg Risk Score</div>
            <div className="text-2xl font-bold">28</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Rollback Ready</div>
            <div className="text-2xl font-bold">92%</div>
          </Card>
        </div>

        {/* Deployment Trend */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold mb-4">Deployment Trend (This Week)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={DEPLOYMENT_TREND}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="success" fill="hsl(var(--success))" />
              <Bar dataKey="failed" fill="hsl(var(--destructive))" />
              <Bar dataKey="rolled" fill="hsl(var(--warning))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Filters */}
        <DeploymentFilters filters={filters} setFilters={setFilters} />

        {/* Deployments Table */}
        {filteredAndSortedDeployments.length > 0 ? (
          <DeploymentTable
            deployments={filteredAndSortedDeployments}
            selectedDeployment={selectedDeployment}
            onSelectDeployment={setSelectedDeployment}
          />
        ) : (
          <Card className="p-12 text-center text-muted-foreground">
            No deployments found matching your filters.
          </Card>
        )}
      </PageContent>

      {/* Deployment Drawer */}
      {selectedDeploymentData && (
        <DeploymentDrawer
          deployment={selectedDeploymentData}
          onClose={() => setSelectedDeployment(null)}
        />
      )}

      {/* Create Deployment Wizard */}
      <CreateDeploymentDrawer onSuccess={handleDeploymentCreated} />
    </>
  )
}
