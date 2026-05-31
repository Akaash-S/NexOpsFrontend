'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { DeploymentTable } from '@/components/deployments/deployment-table'
import { DeploymentDrawer } from '@/components/deployments/deployment-drawer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import { mockDeployments, formatDuration } from '@/lib/mock-data'

// Transform mock deployments to page format
const transformDeployments = () => {
  return mockDeployments.map((dep) => ({
    id: dep.id,
    service: dep.service,
    version: dep.version,
    environment: dep.environment,
    status: dep.status === 'success' ? 'success' : dep.status === 'in-progress' ? 'pending' : 'failed',
    riskScore: dep.status === 'failed' ? 85 : Math.floor(Math.random() * 40),
    confidence: dep.status === 'failed' ? 45 : 95 - Math.floor(Math.random() * 10),
    deployedAt: new Date(dep.deployedAt).toLocaleString(),
    duration: formatDuration(dep.duration),
    changesCount: dep.changes,
    affectedServices: Math.floor(Math.random() * 10) + 2,
    blastRadius: dep.changes > 10 ? 'high' : dep.changes > 5 ? 'medium' : 'low',
    rollbackReady: dep.status !== 'in-progress',
  }));
};

const DEPLOYMENTS_DATA = transformDeployments();

const DEPLOYMENT_TREND = [
  { date: 'Mon', success: 8, failed: 1, rolled: 0 },
  { date: 'Tue', success: 12, failed: 0, rolled: 0 },
  { date: 'Wed', success: 10, failed: 2, rolled: 1 },
  { date: 'Thu', success: 15, failed: 1, rolled: 0 },
  { date: 'Fri', success: 9, failed: 1, rolled: 0 },
]

export default function DeploymentsPage() {
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null)

  const selectedDeploymentData = DEPLOYMENTS_DATA.find((d) => d.id === selectedDeployment) as any

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
