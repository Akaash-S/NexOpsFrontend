import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader, Grid, MetricCard } from '@/components/layout'
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
          
          <Grid columns={4} className="mb-8">
            <MetricCard 
              label="Workspace Health"
              value="94%"
              change="+2.1% from yesterday"
              icon={<Activity className="w-8 h-8" />}
            />
            <MetricCard 
              label="Active Incidents"
              value="3"
              change="1 critical"
              icon={<AlertTriangle className="w-8 h-8" />}
            />
            <MetricCard 
              label="Deployment Risk"
              value="12%"
              change="Low risk"
              icon={<Zap className="w-8 h-8" />}
            />
            <MetricCard 
              label="Change Failure Rate"
              value="3.2%"
              change="-0.8% from last week"
              icon={<TrendingUp className="w-8 h-8" />}
            />
          </Grid>

          {/* Placeholder for additional sections */}
          <div className="space-y-8">
            <div className="rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground">Engineering Health Panel - Coming Soon</p>
            </div>
            <div className="rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground">Active Incidents Panel - Coming Soon</p>
            </div>
            <div className="rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground">Recent Critical Changes - Coming Soon</p>
            </div>
            <div className="rounded-lg border border-border p-8 text-center">
              <p className="text-muted-foreground">Recommended Actions - Coming Soon</p>
            </div>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
