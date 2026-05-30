import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Integrations | NexOps',
  description: 'External service integrations and connectivity',
}

export default function IntegrationsPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Integrations"
            description="External service integrations. Connect GitHub, GitLab, Kubernetes, Slack, PagerDuty, and more."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Integrations content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
