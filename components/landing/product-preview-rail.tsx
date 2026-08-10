'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Server, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ProductPreviewRail() {
  const [activeTab, setActiveTab] = useState(0)
  const [scrollDirection, setScrollDirection] = useState(1)

  const sectionRef = useRef<HTMLDivElement>(null)
  const lastProgressRef = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Track scroll direction and calculate active view index
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (prefersReducedMotion) return

    const diff = latest - lastProgressRef.current
    if (Math.abs(diff) > 0.005) {
      setScrollDirection(diff > 0 ? 1 : -1)
    }
    lastProgressRef.current = latest

    if (latest < 0.35) {
      setActiveTab(0)
    } else if (latest < 0.70) {
      setActiveTab(1)
    } else {
      setActiveTab(2)
    }
  })

  const views = [
    {
      id: 'investigation',
      eyebrow: 'Unified Platform Interface',
      headline: 'Ranked root causes with plain-English evidence',
      description: 'When an alert fires, NexOps immediately analyzes recent GitHub commits, pull requests, and deployment signals. Instead of forcing your team to dig through logs, NexOps presents ranked candidate causes with clear explanations.',
      cta: 'Explore Investigation',
      url: 'nexops.asolvitra.tech/investigation',
    },
    {
      id: 'dependencies',
      eyebrow: 'Dependency Graph & Health',
      headline: 'Map microservices and inter-service health',
      description: 'Visualize real-time upstream entry points, core service bottlenecks, and downstream degraded dependency paths to isolate cascading infrastructure failures instantly.',
      cta: 'Explore Topology',
      url: 'nexops.asolvitra.tech/dependencies',
    },
    {
      id: 'risk',
      eyebrow: 'Real-Time Risk Prevention',
      headline: 'Calculate blast radius before deployment',
      description: 'Prevent incidents before they reach production by automatically analyzing pull requests, calculating risk scores, and evaluating downstream dependency impacts.',
      cta: 'Explore Risk Matrix',
      url: 'nexops.asolvitra.tech/risk',
    },
  ]

  const currentView = views[activeTab]

  return (
    <section ref={sectionRef} className="relative bg-zinc-950 text-white md:h-[350vh]">
      {/* Pinned Desktop Viewport (Single Section with Scroll-Driven Inline Rolling Text Reel) */}
      <div className="hidden md:flex sticky top-0 h-screen items-center justify-center overflow-hidden w-full bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Inline Vertical Text Reels (Rolling Text Slot Machine Transition) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* 1. Eyebrow Reel Slot */}
            <div className="h-7 overflow-hidden relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`eyebrow-${activeTab}`}
                  initial={prefersReducedMotion ? undefined : { y: scrollDirection > 0 ? 24 : -24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { y: scrollDirection > 0 ? -24 : 24, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xs font-mono font-semibold tracking-wider text-primary uppercase absolute inset-0"
                >
                  {currentView.eyebrow}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 2. Headline Reel Slot (Text Turn / Roll Effect) */}
            <div className="h-[120px] sm:h-[100px] overflow-hidden relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.h2
                  key={`headline-${activeTab}`}
                  initial={prefersReducedMotion ? undefined : { y: scrollDirection > 0 ? 60 : -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { y: scrollDirection > 0 ? -60 : 60, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight absolute inset-0 flex items-start"
                >
                  {currentView.headline}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* 3. Description Reel Slot - Generous Height to prevent bottom text clipping */}
            <div className="h-[145px] sm:h-[130px] overflow-hidden relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={`desc-${activeTab}`}
                  initial={prefersReducedMotion ? undefined : { y: scrollDirection > 0 ? 30 : -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { y: scrollDirection > 0 ? -30 : 30, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed absolute inset-0"
                >
                  {currentView.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* 4. CTA Button Reel Slot */}
            <div className="h-14 overflow-hidden relative pt-1">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`cta-${activeTab}`}
                  initial={prefersReducedMotion ? undefined : { y: scrollDirection > 0 ? 24 : -24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { y: scrollDirection > 0 ? -24 : 24, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center"
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    <span>{currentView.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT COLUMN: Synchronized Workspace Mockup Stage */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/20 bg-zinc-900/90 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
              
              {/* Browser Window Header */}
              <div className="px-5 py-3.5 bg-zinc-950 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-zinc-400">{currentView.url}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-mono uppercase">
                    Live Demo
                  </Badge>
                </div>
              </div>

              {/* Dynamic Feature Content Box with AnimatePresence */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  {activeTab === 0 && (
                    <motion.div
                      key="mockup-investigation"
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs font-mono">
                            CRITICAL INCIDENT
                          </Badge>
                          <span className="text-xs text-zinc-400 font-mono">Triggered by PagerDuty #PD-7819</span>
                        </div>
                        <span className="text-xs text-zinc-400 font-mono">Started 4m ago &bull; 420 users impacted</span>
                      </div>

                      <h3 className="text-xl font-bold text-white">
                        High Latency &amp; Timeout Spike on Order Checkout API
                      </h3>

                      <div className="p-5 rounded-xl bg-zinc-950/80 border border-white/10 space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-400 font-semibold uppercase">Primary Ranked Candidate Cause</span>
                          <span className="text-emerald-400 font-bold">94% CONFIDENCE MATCH</span>
                        </div>

                        <div className="p-4 rounded-lg bg-zinc-900 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white flex items-center gap-2">
                              <span className="text-primary font-mono">&ndash;&gt;</span> payment-service (Commit #8f92a1c)
                            </span>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed Cause
                            </Badge>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            Deployed by <strong className="text-zinc-200">@alex-dev</strong> 4 minutes before alert. Modified database connection pool size configuration.
                          </p>
                          <div className="p-3 rounded bg-black/60 text-[11px] font-mono text-zinc-300 space-y-1">
                            <div className="text-zinc-400 font-semibold">PLAIN-ENGLISH EVIDENCE CHAIN:</div>
                            <div>&bull; Direct dependency update on payment-service connection limits.</div>
                            <div>&bull; Database socket pool exhaustion observed 90s post-deploy.</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 1 && (
                    <motion.div
                      key="mockup-dependencies"
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs font-mono">
                            SERVICE TOPOLOGY GRAPH
                          </Badge>
                          <span className="text-xs text-zinc-400 font-mono">14 Active Microservices</span>
                        </div>
                        <span className="text-xs text-amber-400 font-mono">1 Degraded Path Detected</span>
                      </div>

                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Server className="w-5 h-5 text-amber-400" />
                        <span>Upstream API Gateway &rarr; Auth &rarr; Database Cluster</span>
                      </h3>

                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="p-4 rounded-xl bg-zinc-950/80 border border-emerald-500/30 text-center space-y-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mx-auto" />
                          <div className="text-xs font-bold text-white">api-gateway</div>
                          <div className="text-[10px] font-mono text-emerald-400">99.98% Healthy</div>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-950/80 border border-rose-500/40 text-center space-y-2 relative">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping mx-auto" />
                          <div className="text-xs font-bold text-white">auth-service</div>
                          <div className="text-[10px] font-mono text-rose-400">Pool Bottleneck</div>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-950/80 border border-amber-500/30 text-center space-y-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mx-auto" />
                          <div className="text-xs font-bold text-white">postgres-primary</div>
                          <div className="text-[10px] font-mono text-amber-400">High Socket Wait</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 2 && (
                    <motion.div
                      key="mockup-risk"
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? undefined : { opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs font-mono">
                            PRE-DEPLOY RISK MATRIX
                          </Badge>
                          <span className="text-xs text-zinc-400 font-mono">PR #1048 &bull; @dev-team</span>
                        </div>
                        <span className="text-xs text-emerald-400 font-mono">Low Risk Score (14/100)</span>
                      </div>

                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-emerald-400" />
                        <span>Pre-deployment Blast Radius Assessment</span>
                      </h3>

                      <div className="p-5 rounded-xl bg-zinc-950/80 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-400">Impacted Downstream Services</span>
                          <span className="text-white font-bold">2 Services (Non-Critical)</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full w-[14%]" />
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                          No breaking API schema mutations detected. Safe to merge and auto-deploy to production staging environment.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Dots Indicator */}
              <div className="px-6 py-4 bg-zinc-950/60 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono">Feature {activeTab + 1} of 3</span>
                <div className="flex gap-2">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeTab === idx ? 'w-6 bg-primary' : 'w-1.5 bg-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Fallback Static Cards for Mobile Viewports */}
      <div className="md:hidden space-y-12 px-4 py-16">
        {views.map((view, i) => (
          <div key={view.id} className="p-6 rounded-2xl bg-zinc-900 border border-white/10 space-y-4">
            <div className="text-xs font-mono text-primary uppercase tracking-wider">{view.eyebrow}</div>
            <h2 className="text-2xl font-bold text-white">{view.headline}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{view.description}</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-xs"
            >
              <span>{view.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
