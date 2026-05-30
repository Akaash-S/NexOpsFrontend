import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Health Center | NexOps',
  description: 'System health intelligence with SLO/SLA indicators',
}

export default function HealthPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Health Center"
            description="System health intelligence. Cluster health, service health, reliability scores, and SLO/SLA indicators."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Health Center content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
