import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Releases | NexOps',
  description: 'Release management and version tracking',
}

export default function ReleasesPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Releases"
            description="Release management. Version tracking, release history, and deployment status."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Releases content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
