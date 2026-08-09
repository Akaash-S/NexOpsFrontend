'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  GitCommitHorizontal,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck,
} from 'lucide-react'

export function FlagshipProductShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'start 40%'],
  })

  // Rising panel translateY and opacity entrance transforms only
  const y = useTransform(scrollYProgress, [0, 1], [80, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="product" ref={ref} className="relative bg-black text-white pt-20 md:pt-28 lg:pt-32 border-t border-zinc-900 overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Boxed Rising Panel with Consistent Max-Width, Visible Side Inset & Shade-Shifted Fill */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y, opacity }}
        className="max-w-7xl mx-auto rounded-t-[48px] sm:rounded-t-[56px] lg:rounded-t-[64px] rounded-b-none bg-zinc-950 border-t border-x border-zinc-800/90 shadow-[0_-20px_80px_rgba(0,0,0,0.9)] p-6 sm:p-12 lg:p-16"
      >
        {/* Text Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-3">
            The Investigation Workspace
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Ranked root causes with plain-English evidence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            When an alert fires, NexOps immediately analyzes recent GitHub commits, pull requests, and deployment signals. Instead of forcing your team to dig through logs, NexOps presents ranked candidate causes with clear explanations.
          </p>
          <div className="mt-6">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-lg transition-all"
            >
              <Link href="/login" className="flex items-center gap-2">
                <span>Join the pilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Large Visual Showcase (Fidelity Mockup of Investigation Workspace) */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Top Navbar Simulation */}
          <div className="px-6 py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white">Incident Investigation</span>
              <span className="text-zinc-600">/</span>
              <span className="text-xs font-mono text-zinc-400">INC-8942</span>
            </div>
            <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs uppercase font-mono">
              Active Investigation
            </Badge>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Title & Metadata */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Database Connection Pool Exhaustion on auth-service
                </h3>
                <p className="text-sm text-zinc-400">
                  Triggered by PagerDuty Alert &bull; 2 services degraded &bull; Impacting 420 active user sessions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono text-zinc-400">Time to Resolution Estimate</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">&lt; 3 mins</div>
                </div>
              </div>
            </div>

            {/* Candidate Causes Section */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-4">
                Ranked Candidate Root Causes (1 of 3)
              </h4>

              <div className="p-6 rounded-xl bg-zinc-950/90 border border-primary/50 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      #1
                    </div>
                    <div>
                      <div className="text-base font-bold text-white flex items-center gap-2">
                        <span>Deploy #DP-4819 &bull; auth-service</span>
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-mono">
                          94% Match
                        </Badge>
                      </div>
                      <div className="text-xs text-zinc-400 font-mono mt-0.5">
                        Commit #8f92a1c by @alex-dev &bull; Deployed 4 minutes ago
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmed by Engineer</span>
                  </Badge>
                </div>

                <div className="p-4 rounded-lg bg-black/70 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-2">
                  <div className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                    Plain-English Reasoning Rationale:
                  </div>
                  <p className="leading-relaxed">
                    Commit #8f92a1c reduced database connection pool size from 50 to 10 in <code className="text-primary font-mono font-bold">config/database.go</code>. 
                    This change was deployed 4 minutes prior to the PagerDuty alert firing for timeout errors on /api/v1/auth/login.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
