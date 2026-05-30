'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { DeploymentTable } from '@/components/deployments/deployment-table'
import { DeploymentDrawer } from '@/components/deployments/deployment-drawer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'

const DEPLOYMENTS_DATA = [
  {
    id: 'deploy-001',
    service: 'API Gateway',
    version: 'v2.4.1',
    environment: 'production',
    status: 'success',
    riskScore: 12,
    confidence: 98,
    deployedAt: '5 minutes ago',
    duration: '3m 24s',
    changesCount: 12,
    affectedServices: 8,
    blastRadius: 'medium',
    rollbackReady: true,
  },
  {
    id: 'deploy-002',
    service: 'Search Service',
    version: 'v1.8.5',
    environment: 'production',
    status: 'success',
    riskScore: 34,
    confidence: 92,
    deployedAt: '45 minutes ago',
    duration: '5m 12s',
    changesCount: 24,
    affectedServices: 5,
    blastRadius: 'high',
    rollbackReady: true,
  },
  {
    id: 'deploy-003',
    service: 'Notification Service',
    version: 'v3.1.0',
    environment: 'staging',
    status: 'pending',
    riskScore: 8,
    confidence: 99,
    deployedAt: '2 hours ago',
    duration: '2m 45s',
    changesCount: 5,
    affectedServices: 3,
    blastRadius: 'low',
    rollbackReady: true,
  },
  {
    id: 'deploy-004',
    service: 'Auth Service',
    version: 'v4.2.1',
    environment: 'production',
    status: 'rollback',
    riskScore: 78,
    confidence: 45,
    deployedAt: '1 day ago',
    duration: '1m 15s',
    changesCount: 8,
    affectedServices: 12,
    blastRadius: 'critical',
    rollbackReady: false,
  },
]

const DEPLOYMENT_TREND = [
  { date: 'Mon', success: 8, failed: 1, rolled: 0 },
  { date: 'Tue', success: 12, failed: 0, rolled: 0 },
  { date: 'Wed', success: 10, failed: 2, rolled: 1 },
  { date: 'Thu', success: 15, failed: 1, rolled: 0 },
  { date: 'Fri', success: 9, failed: 1, rolled: 0 },
]

export default function DeploymentsPage() {
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null)

  const selectedDeploymentData = DEPLOYMENTS_DATA.find((d) => d.id === selectedDeployment)

  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader
            title="Deployments"
            description="Release intelligence with risk analysis, environment health, and rollback readiness"
          />

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

          {/* Deployments Table */}
          <DeploymentTable
            deployments={DEPLOYMENTS_DATA}
            selectedDeployment={selectedDeployment}
            onSelectDeployment={setSelectedDeployment}
          />
        </Section>
      </PageLayout>

      {/* Deployment Drawer */}
      {selectedDeploymentData && (
        <DeploymentDrawer
          deployment={selectedDeploymentData}
          onClose={() => setSelectedDeployment(null)}
        />
      )}
    </>
  )
}
