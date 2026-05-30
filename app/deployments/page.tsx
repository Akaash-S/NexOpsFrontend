import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Deployments | NexOps',
  description: 'Release intelligence with deployment risk analysis',
}

export default function DeploymentsPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Deployments"
            description="Release intelligence. Deployment status, risk analysis, and rollback suggestions."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Deployments content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
