import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Workflows | NexOps',
  description: 'Automation workflows and orchestration',
}

export default function WorkflowsPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Workflows"
            description="Automation workflows and orchestration. Create and manage complex automation workflows."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Workflows content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
