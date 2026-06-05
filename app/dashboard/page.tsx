import { PageContent, PageHeader, Grid, MetricCard } from '@/components/layout'
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
      
      <>
        <PageContent>
          <PageHeader 
            title="Dashboard"
            description="Engineering command center - What needs attention today?"
          />
          
          {/* Executive Health Overview Cards */}
          <Grid columns={4} className="mb-6">
            <MetricCard 
              label="Workspace Health"
              value="94%"
              change="+2.1% from yesterday"
              trend="up"
              icon={<Activity className="w-6 h-6 text-primary" />}
            />
            <MetricCard 
              label="Active Incidents" 
              value={4} 
              change="-2 this week" 
              trend="up"
              icon={<AlertTriangle className="w-6 h-6 text-warning" />} 
              href="/incidents"
            />
            <MetricCard 
              label="Health Score" 
              value="98.5%" 
              change="+2.4%" 
              icon={<Activity className="w-6 h-6 text-success" />} 
              href="/health"
            />
            <MetricCard 
              label="Change Failure Rate"
              value="3.2%"
              change="-0.8% from last week"
              trend="up"
              icon={<TrendingUp className="w-6 h-6 text-destructive" />}
            />
          </Grid>

          {/* Main Dashboard Content - 3 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Health and Incidents */}
            <div className="lg:col-span-2 space-y-6">
              <HealthOverview />
              <ActiveIncidents />
            </div>

            {/* Right Column - Impact Map */}
            <div>
              <ImpactMap />
            </div>
          </div>

          {/* Bottom Sections - Full Width */}
          <div className="space-y-6">
            {/* Recent Critical Changes */}
            <RecentChanges />

            {/* Recommended Actions - Highest Priority */}
            <Recommendations />
          </div>
        </PageContent>
      </>
    </>
  )
}
