import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Settings | NexOps',
  description: 'Application settings and preferences',
}

export default function SettingsPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Settings"
            description="Application settings and preferences. Manage workspace, notification, and display settings."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Settings content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
