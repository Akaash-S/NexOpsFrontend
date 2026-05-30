import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Change Impact | NexOps',
  description: 'What changed and what was affected',
}

export default function ChangeImpactPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Change Impact"
            description="What changed and what was affected. Timeline view with impact analysis and blast radius."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Change Impact content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
