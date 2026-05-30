import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Alerts | NexOps',
  description: 'Operational signals with severity filtering and correlation',
}

export default function AlertsPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Alerts"
            description="Operational signals. Severity filters, cluster grouping, and alert correlation."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Alerts content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
