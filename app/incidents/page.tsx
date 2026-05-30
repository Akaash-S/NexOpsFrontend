import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Incidents | NexOps',
  description: 'Operational investigation center for incident management',
}

export default function IncidentsPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Incidents"
            description="Operational investigation center. Timeline, root cause analysis, affected services, and postmortem summary."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Incidents content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
