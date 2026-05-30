import { TopNav } from '@/components/top-nav'
import { PageLayout, Section, PageHeader } from '@/components/layout'

export const metadata = {
  title: 'Services | NexOps',
  description: 'Primary operational entity with health scores, dependencies, and deployments',
}

export default function ServicesPage() {
  return (
    <>
      <TopNav />
      <PageLayout>
        <Section>
          <PageHeader 
            title="Services"
            description="Primary operational entity. Health scores, dependencies, deployments, and AI insights."
          />
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Services content - Coming Soon</p>
          </div>
        </Section>
      </PageLayout>
    </>
  )
}
