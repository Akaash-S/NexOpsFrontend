import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Recommendations | NexOps',
  description: 'Decision support system with actionable intelligence',
}

export default function RecommendationsPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Recommendations"
            description="Decision support system. Actionable recommendations with impact analysis and confidence scores."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Recommendations content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
