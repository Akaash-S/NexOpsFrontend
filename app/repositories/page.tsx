import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Repositories | NexOps',
  description: 'Source control visibility and code intelligence',
}

export default function RepositoriesPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Repositories"
            description="Source control visibility. Browse files, pull requests, commits, security, and AI code audit."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Repositories content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
