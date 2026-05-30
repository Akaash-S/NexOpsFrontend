import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Teams | NexOps',
  description: 'Team management and collaboration',
}

export default function TeamsPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Teams"
            description="Team management and collaboration. Manage team members, permissions, and settings."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Teams content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
