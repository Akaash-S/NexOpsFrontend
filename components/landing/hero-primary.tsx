'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  ShieldCheck,
  GitCommitHorizontal,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Zap,
} from 'lucide-react'

export function HeroPrimary() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32 overflow-hidden bg-black text-white">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-semibold tracking-wider text-primary uppercase mb-6 shadow-sm backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 fill-primary text-primary" />
          <span>For On-Call Engineers</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          What caused this incident,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-indigo-300">
            and how do we know?
          </span>
        </h1>

        {/* Subcopy */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          NexOps correlates deploys and alerts from GitHub and PagerDuty to surface the root cause with plain-English reasoning — and maps downstream blast radius before you ship.
        </p>

        {/* CTA Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3.5 text-base rounded-xl transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50"
          >
            <Link href="/login" className="flex items-center gap-2">
              <span>Join the pilot</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>

          <a
            href="#product"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white px-5 py-3 transition-colors duration-200"
          >
            <span>See how it works</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Static Visual Showcase: Illustrative UI Mockup of Investigation View */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/90 shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden text-left backdrop-blur-xl">
          {/* Mock Window Titlebar */}
          <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 font-medium">
                NexOps — Root Cause Investigation #INC-8942
              </span>
              <Badge variant="outline" className="bg-zinc-800/80 text-zinc-300 border-zinc-700 font-mono text-[10px] uppercase">
                Example Incident
              </Badge>
            </div>
            <div className="w-12" />
          </div>

          {/* Incident View Header Mock */}
          <div className="p-6 sm:p-8 border-b border-zinc-800/60 bg-zinc-900/30">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 font-mono text-xs uppercase px-2.5 py-0.5">
                  CRITICAL INCIDENT
                </Badge>
                <span className="text-xs font-mono text-zinc-400">
                  Triggered by PagerDuty #PD-7819
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Started 4m ago &bull; 420 users impacted
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              High Latency & Timeout Spike on Order Checkout API
            </h3>
          </div>

          {/* Root Cause Card Mock */}
          <div className="p-6 sm:p-8 bg-zinc-950 space-y-6">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
              <span>Primary Ranked Candidate Cause</span>
              <span className="text-emerald-400 font-bold">94% Confidence Match (Evidence Chain Below)</span>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-zinc-900/80 border border-primary/40 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <GitCommitHorizontal className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm font-semibold text-zinc-100">
                    payment-service (Commit #8f92a1c)
                  </span>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmed Cause</span>
                </Badge>
              </div>

              <p className="text-sm text-zinc-300 font-medium leading-relaxed mb-4">
                Deployed by <span className="text-white font-semibold">@alex-dev</span> 4 minutes before alert. Modified database connection pool size configuration.
              </p>

              {/* Plain-English Evidence Box */}
              <div className="p-3.5 rounded-lg bg-black/60 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1.5">
                <div className="text-zinc-400 font-semibold text-[11px] uppercase tracking-wider mb-1">
                  Plain-English Evidence Chain:
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">&bull;</span>
                  <span>Direct dependency update on payment-service connection limits.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold">&bull;</span>
                  <span>Database socket pool exhaustion observed 90s post-deploy.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
