'use client'

import { useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'
import { PipelineTable } from '@/components/pipelines/pipeline-table'
import { PipelineDrawer } from '@/components/pipelines/pipeline-drawer'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'

const PIPELINES_DATA = [
  {
    id: 'api-build-deploy',
    name: 'API Build & Deploy',
    repository: 'nexops-api',
    status: 'healthy',
    successRate: 98,
    failureRate: 2,
    avgDuration: '8m 24s',
    lastRun: '5 minutes ago',
    runCount30d: 145,
    avgFailureTime: '45s',
    reliability: 98,
  },
  {
    id: 'ui-build-test',
    name: 'UI Build & Test',
    repository: 'nexops-ui',
    status: 'healthy',
    successRate: 96,
    failureRate: 4,
    avgDuration: '12m 15s',
    lastRun: '2 minutes ago',
    runCount30d: 132,
    avgFailureTime: '2m 30s',
    reliability: 96,
  },
  {
    id: 'infra-provision',
    name: 'Infrastructure Provision',
    repository: 'nexops-helm',
    status: 'warning',
    successRate: 91,
    failureRate: 9,
    avgDuration: '25m 45s',
    lastRun: '30 minutes ago',
    runCount30d: 64,
    avgFailureTime: '8m 15s',
    reliability: 91,
  },
]

const FAILURE_TREND = [
  { week: 'Week 1', failures: 3, recovered: 3 },
  { week: 'Week 2', failures: 2, recovered: 2 },
  { week: 'Week 3', failures: 5, recovered: 5 },
  { week: 'Week 4', failures: 2, recovered: 2 },
]

export default function PipelinesPage() {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null)

  const selectedPipelineData = PIPELINES_DATA.find((p) => p.id === selectedPipeline)

  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader
            title="Pipelines"
            description="Delivery intelligence with failure trends, success rates, and reliability scoring"
          />

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Avg Success Rate</div>
              <div className="text-2xl font-bold">95%</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Total Runs (30d)</div>
              <div className="text-2xl font-bold">341</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Failures (30d)</div>
              <div className="text-2xl font-bold">12</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground">Avg Duration</div>
              <div className="text-2xl font-bold">15m</div>
            </Card>
          </div>

          {/* Failure Trend Chart */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Failure Trend (Last 4 Weeks)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={FAILURE_TREND}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="failures" fill="hsl(var(--destructive))" />
                <Bar dataKey="recovered" fill="hsl(var(--success))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pipelines Table */}
          <PipelineTable
            pipelines={PIPELINES_DATA}
            selectedPipeline={selectedPipeline}
            onSelectPipeline={setSelectedPipeline}
          />
        </Section>
      </PageLayout>

      {/* Pipeline Drawer */}
      {selectedPipelineData && (
        <PipelineDrawer
          pipeline={selectedPipelineData}
          onClose={() => setSelectedPipeline(null)}
        />
      )}
    </>
  )
}
