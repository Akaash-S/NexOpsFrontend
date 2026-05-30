import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Dependencies | NexOps',
  description: 'Engineering relationship intelligence and topology',
}

export default function DependenciesPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Dependencies"
            description="Engineering relationship intelligence. Interactive dependency graph with impact analysis."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Dependencies content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
