import { PageContent, PageHeader, Grid, MetricCard, EmptyState } from '@/components/layout'
import { HealthOverview } from '@/components/dashboard/health-overview'
import { ActiveIncidents } from '@/components/dashboard/active-incidents'
import { RecentChanges } from '@/components/dashboard/recent-changes'
import { Recommendations } from '@/components/dashboard/recommendations'
import { ImpactMap } from '@/components/dashboard/impact-map'
import { Activity, AlertTriangle, GitCommitHorizontal, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard | NexOps',
  description: 'NexOps correlation engine — what caused this incident, and how do we know?',
}

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await props.searchParams
  const isEmpty = resolvedParams.empty === 'true'

  if (isEmpty) {
    return (
      <PageContent>
        <PageHeader
          title="Dashboard"
          description="Correlation engine — active incidents with ranked causal candidates, change blast radius, and dependency topology"
        />
        <div className="flex items-center justify-center min-h-[50vh] border border-dashed border-border rounded-xl bg-card/20 p-8 mt-6">
          <EmptyState
            icon={<AlertTriangle className="w-12 h-12 text-muted-foreground/60" />}
            title="Welcome to NexOps"
            description="Your workspace is not receiving telemetry or alert data yet. Connect your integrations to populate this dashboard."
            action={
              <Button asChild>
                <Link href="/settings?tab=workspace">Set Up Workspace</Link>
              </Button>
            }
          />
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <PageHeader
        title="Dashboard"
        description="Correlation engine — active incidents with ranked causal candidates, change blast radius, and dependency topology"
      />

      {/* Top-level signal cards */}
      <Grid columns={4} className="mb-6">
        <MetricCard
          label="Active Incidents"
          value={2}
          change="2 investigating"
          trend="down"
          icon={<AlertTriangle className="w-6 h-6 text-destructive" />}
          href="/incidents"
        />
        <MetricCard
          label="Unconfirmed Candidates"
          value={4}
          change="Awaiting human review"
          icon={<Search className="w-6 h-6 text-warning" />}
          href="/incidents"
        />
        <MetricCard
          label="Changes (24h)"
          value={4}
          change="1 linked to incident"
          icon={<GitCommitHorizontal className="w-6 h-6 text-primary" />}
          href="/recent-changes"
        />
        <MetricCard
          label="Services Healthy"
          value="6/9"
          change="3 degraded or critical"
          trend="down"
          icon={<Activity className="w-6 h-6 text-success" />}
          href="/services"
        />
      </Grid>

      {/* Primary layout: Incidents + Causal Review (2/3) + Dependency Graph (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: the two core correlation widgets — primary real estate */}
        <div className="lg:col-span-2 space-y-6">
          <ActiveIncidents />
          <Recommendations />
        </div>

        {/* Right: dependency graph + recent changes preview */}
        <div className="space-y-6">
          <ImpactMap />
          <RecentChanges />
        </div>
      </div>

      {/* Bottom: Health Overview — deprioritized, reduced visual weight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthOverview />
      </div>
    </PageContent>
  )
}

