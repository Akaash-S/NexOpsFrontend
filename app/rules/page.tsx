import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Rules | NexOps',
  description: 'Automation rules and policies',
}

export default function RulesPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Rules"
            description="Automation rules and policies. Create and manage automation rules for your engineering operations."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Rules content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
