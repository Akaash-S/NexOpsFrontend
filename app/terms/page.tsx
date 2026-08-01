import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service — NexOps Pilot Program Agreement',
  description: 'NexOps Pilot Program Agreement defining pilot usage, data access, liability, and confidentiality.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" prefetch={false} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-primary-foreground">
                N
              </div>
              <span className="font-extrabold text-lg tracking-tight">NexOps</span>
            </Link>
            <span className="text-muted-foreground text-sm font-medium">/ Terms of Service</span>
          </div>
          <Link href="/dashboard" prefetch={false}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to App
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="space-y-3 border-b border-border/40 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            NexOps — Pilot Program Agreement
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: July 31, 2026 • Effective Version: v1.0
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-foreground/90">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">1. What this covers</h2>
            <p>
              This agreement covers your ("Participant") use of NexOps ("the Product"), operated by NexOps Platform ("we", "us"), during an unpaid pilot period. It's meant to set clear, honest expectations for both sides while the product is still early.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">2. What the pilot is</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Free of charge.</strong> No payment is requested or expected during the pilot.</li>
              <li>You connect your GitHub organization and PagerDuty account so NexOps can read deploy and incident data and surface likely causes for incidents.</li>
              <li>In exchange, we ask for honest feedback and real usage — specifically, using the confirm/reject controls on suggested causes when you have a real incident.</li>
              <li>Either side can end the pilot at any time, for any reason, with reasonable notice (a quick message is enough).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">3. What data we access, and why</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">GitHub:</strong> repository metadata, deploy/commit history, and CODEOWNERS-derived ownership — used to build the dependency graph and correlation logic.</li>
              <li><strong className="text-foreground">PagerDuty:</strong> incident trigger/acknowledge/resolve events — used to detect incidents and match them against recent deploys.</li>
              <li>We do not access source code contents, secrets, or repository file contents beyond what's needed for deploy/dependency metadata.</li>
              <li>Your confirm/reject feedback on suggested causes is stored to improve future suggestions for your workspace specifically — see the Privacy Notice for how this is retained.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">4. What NexOps does and doesn't promise</h2>
            <p>
              NexOps surfaces suggested likely causes for incidents, with visible reasoning, based on deploy timing and dependency relationships. These are suggestions to help you investigate faster — not a certified or guaranteed diagnosis. A human should always confirm a suggested cause before acting on it (e.g. rolling back a deploy).
            </p>
            <p className="text-muted-foreground">
              The product is in active pilot development. Bugs, incomplete features, and occasional downtime should be expected. This is not a production-SLA commitment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">5. Liability</h2>
            <p>
              The Product is provided "as is" during the pilot period, without warranties of any kind, express or implied. We are not liable for decisions made based on NexOps's suggestions, or for any downtime, data loss, or business impact arising from use of the Product during the pilot.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">6. Confidentiality</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>We will not share your connected repository names, incident content, or any workspace-specific data with other pilot participants or third parties, other than service providers required to operate the Product (e.g. our hosting/database providers).</li>
              <li>If we want to reference your organization by name in public materials (case studies, testimonials, marketing), we will ask for your separate, explicit permission first.</li>
              <li>You're welcome to share general feedback about your experience, but please don't publicly share NexOps's internal scoring logic or architecture, which remains proprietary.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">7. Ending the pilot</h2>
            <p>
              Either side may end participation at any time. On request, we will disconnect your GitHub/PagerDuty integrations and delete your workspace's data within a reasonable period (see the Privacy Notice).
            </p>
          </section>

          <section className="space-y-2 border-t border-border/40 pt-4">
            <h2 className="text-xl font-bold text-foreground">8. Contact</h2>
            <p>
              Questions about this agreement or the pilot: <a href="mailto:akaashgithub21@gmail.com" className="text-primary hover:underline">akaashgithub21@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-border/40 bg-card/30 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto w-full gap-4">
        <p>© 2026 NexOps Platform. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/terms" prefetch={false} className="font-semibold text-foreground hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/privacy" prefetch={false} className="hover:text-foreground transition-colors">Privacy Notice</Link>
          <Link href="/dashboard" prefetch={false} className="hover:text-foreground transition-colors">Dashboard</Link>
        </div>
      </footer>
    </div>
  )
}
