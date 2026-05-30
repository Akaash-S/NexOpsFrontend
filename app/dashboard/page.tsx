import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader, Grid, MetricCard } from '@/components/layout'
import { HealthOverview } from '@/components/dashboard/health-overview'
import { ActiveIncidents } from '@/components/dashboard/active-incidents'
import { RecentChanges } from '@/components/dashboard/recent-changes'
import { Recommendations } from '@/components/dashboard/recommendations'
import { ImpactMap } from '@/components/dashboard/impact-map'
import { Activity, AlertTriangle, Zap, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Dashboard | NexOps',
  description: 'Engineering command center - understand what needs attention today',
}

export default function DashboardPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Dashboard"
            description="Engineering command center - What needs attention today?"
          />
          
          {/* Executive Health Overview Cards */}
          <Grid columns={4} className="mb-8">
            <MetricCard 
              label="Workspace Health"
              value="94%"
              change="+2.1% from yesterday"
              trend="up"
              icon={<Activity className="w-8 h-8" />}
            />
            <MetricCard 
              label="Active Incidents"
              value="3"
              change="1 critical"
              trend="down"
              icon={<AlertTriangle className="w-8 h-8" />}
            />
            <MetricCard 
              label="Deployment Risk"
              value="12%"
              change="Low risk"
              trend="up"
              icon={<Zap className="w-8 h-8" />}
            />
            <MetricCard 
              label="Change Failure Rate"
              value="3.2%"
              change="-0.8% from last week"
              trend="up"
              icon={<TrendingUp className="w-8 h-8" />}
            />
          </Grid>

          {/* Main Dashboard Content - 3 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Health and Incidents */}
            <div className="lg:col-span-2 space-y-8">
              <HealthOverview />
              <ActiveIncidents />
            </div>

            {/* Right Column - Impact Map */}
            <div>
              <ImpactMap />
            </div>
          </div>

          {/* Bottom Sections - Full Width */}
          <div className="space-y-8">
            {/* Recent Critical Changes */}
            <RecentChanges />

            {/* Recommended Actions - Highest Priority */}
            <Recommendations />
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
