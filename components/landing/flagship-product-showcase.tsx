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
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // RedotPay-inspired Container-to-Section expansion transforms:
  // Starts as a rounded-top card stage with side margins, then expands to cover 100% of the screen
  const inset = useTransform(scrollYProgress, [0, 0.4, 0.75], [48, 20, 0])
  const radius = useTransform(scrollYProgress, [0, 0.4, 0.75], [64, 28, 0])
  const topPad = useTransform(scrollYProgress, [0, 0.4, 0.75], [48, 16, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.75], [0.96, 0.98, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0.7, 1])

  return (
    <section id="product" ref={sectionRef} className="relative bg-black text-white border-t border-zinc-900 md:h-[220vh]">
      {/* Desktop Sticky Viewport (Scroll-Driven Container-to-Section Expansion) */}
      <div className="hidden md:flex sticky top-0 h-screen items-center justify-center overflow-hidden w-full">
        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : {
                  paddingLeft: inset,
                  paddingRight: inset,
                  paddingTop: topPad,
                  scale,
                  opacity,
                }
          }
          className="w-full h-full flex flex-col justify-center transition-all duration-75"
        >
          {/* Inner Stage: Transforms from Rounded Container (64px) into Full-Width Section (0px) */}
          <motion.div
            style={prefersReducedMotion ? undefined : { borderRadius: radius }}
            className="w-full bg-zinc-950 border-t border-x border-zinc-800/80 shadow-[0_-20px_80px_rgba(0,0,0,0.9)] py-12 lg:py-16 overflow-hidden flex-1 flex flex-col justify-center"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {/* Text Header */}
              <div className="max-w-3xl mb-10 sm:mb-14">
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
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Fallback: Card Stage without Sticky Pinning */}
      <div className="block md:hidden py-12 px-4 sm:px-6">
        <div className="rounded-t-[32px] bg-zinc-950 border-t border-x border-zinc-800 p-6 sm:p-8 space-y-8">
          <div className="max-w-3xl">
            <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-2">
              The Investigation Workspace
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              Ranked root causes with plain-English evidence
            </h2>
            <p className="mt-3 text-sm text-zinc-400 font-normal leading-relaxed">
              When an alert fires, NexOps immediately analyzes recent GitHub commits, pull requests, and deployment signals. Instead of forcing your team to dig through logs, NexOps presents ranked candidate causes with clear explanations.
            </p>
            <div className="mt-5">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2 rounded-lg text-sm transition-all"
              >
                <Link href="/login" className="flex items-center gap-2">
                  <span>Join the pilot</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-300 font-bold">INC-8942</span>
              <Badge className="bg-rose-500/20 text-rose-400 text-[10px]">Active</Badge>
            </div>
            <h3 className="text-sm font-bold text-white">Database Connection Pool Exhaustion on auth-service</h3>
            <div className="p-3 rounded-lg bg-zinc-950 border border-primary/40 text-xs font-mono">
              <div className="text-primary font-bold">Deploy #DP-4819 &bull; 94% Match</div>
              <div className="text-zinc-400 mt-1 text-[11px]">Reduced DB connection pool from 50 to 10.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
