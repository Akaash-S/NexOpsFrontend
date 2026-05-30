import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Pipelines | NexOps',
  description: 'Delivery intelligence with failure trends and reliability scores',
}

export default function PipelinesPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Pipelines"
            description="Delivery intelligence. Pipeline status, failure trends, slowest pipelines, and reliability scores."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Pipelines content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
