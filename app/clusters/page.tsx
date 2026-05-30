import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Clusters | NexOps',
  description: 'Domain-level operational view of clusters',
}

export default function ClustersPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Clusters"
            description="Domain-level operational view. Cluster health, services, alerts, incidents, and deployments."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Clusters content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
