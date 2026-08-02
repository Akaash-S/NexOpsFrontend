import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Lock } from 'lucide-react'

export const metadata = {
  title: 'Privacy Notice — NexOps',
  description: 'NexOps Privacy Notice detailing data collection, usage, retention, and choices during the pilot.',
}

import { NexOpsLogo } from '@/components/ui/nexops-logo'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" prefetch={false} className="flex items-center gap-2">
              <NexOpsLogo size="md" className="h-8" />
            </Link>
            <span className="text-muted-foreground text-sm font-medium">/ Privacy Notice</span>
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
            <Lock className="w-3.5 h-3.5" /> Official Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            NexOps — Privacy Notice
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: July 31, 2026 • Effective Version: v1.0
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-foreground/90">
          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">1. Who we are</h2>
            <p>
              NexOps is operated by NexOps Platform ("we", "us", "our"). This notice explains what data we collect during the pilot, why, and what your options are.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">2. What we collect</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li><strong className="text-foreground">Account information:</strong> your name, email address, and authentication identifiers (via Firebase Auth).</li>
              <li><strong className="text-foreground">Integration data:</strong> GitHub repository metadata, deploy/commit history, CODEOWNERS-derived ownership; PagerDuty incident and alert event data — pulled via the connections you explicitly authorize.</li>
              <li><strong className="text-foreground">Product usage:</strong> your confirm/reject actions on suggested causes, and general usage of the dashboard (which pages you use), to help us understand what's actually useful.</li>
              <li>We do not collect payment information during the pilot, since no payment is involved.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">3. How we use it</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>To operate the core product — detecting incidents, correlating them with likely causing deploys, and showing you the reasoning.</li>
              <li>To improve suggestion accuracy for your workspace specifically, based on your own confirm/reject history (this data is not shared across other workspaces/organizations).</li>
              <li>To understand pilot usage in aggregate, so we can decide what to build next. Any aggregate reporting we do internally is de-identified where practical.</li>
              <li>We do not sell your data, and we do not use it to train any public/third-party AI models.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">4. How long we keep it, and your choices</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Data is retained for as long as your workspace is active in the pilot.</li>
              <li>If you leave the pilot or ask us to, we will disconnect your integrations and delete your workspace's data (repos, incidents, feedback history) within 30 days, except where we're required to retain records for legitimate operational or legal reasons (e.g. billing records, which don't apply during an unpaid pilot).</li>
              <li>You can request a copy of your workspace's data, or ask what we currently hold, at any time — contact us using the details below.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">5. Who else sees it</h2>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Infrastructure providers we use to run the Product (hosting, database, background workers) — solely to operate the service, under their own standard data-processing terms.</li>
              <li>We do not share your data with other pilot participants, advertisers, or data brokers.</li>
              <li>We do not display ads in NexOps, and nothing in your data is used for ad targeting, on this product or elsewhere.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">6. Security</h2>
            <p>
              We use industry-standard practices to protect your data, including encrypted credential storage, row-level tenant isolation between workspaces, and signed/verified webhooks from connected integrations. As an early-stage pilot product, no system is perfectly secure — if we ever discover a real security issue affecting your data, we will tell you directly and promptly.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">7. Changes to this notice</h2>
            <p>
              If this notice changes in a way that meaningfully affects how your data is used, we'll notify pilot participants directly rather than silently updating this document.
            </p>
          </section>

          <section className="space-y-2 border-t border-border/40 pt-4">
            <h2 className="text-xl font-bold text-foreground">8. Contact</h2>
            <p>
              Questions about your data: <a href="mailto:akaashgithub21@gmail.com" className="text-primary hover:underline">akaashgithub21@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-border/40 bg-card/30 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto w-full gap-4">
        <p>© 2026 NexOps Platform. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/terms" prefetch={false} className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/privacy" prefetch={false} className="font-semibold text-foreground hover:text-primary transition-colors">Privacy Notice</Link>
          <Link href="/dashboard" prefetch={false} className="hover:text-foreground transition-colors">Dashboard</Link>
        </div>
      </footer>
    </div>
  )
}
