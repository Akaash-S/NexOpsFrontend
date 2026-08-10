'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
            <div className="h-6 overflow-hidden relative">
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
            <div className="h-[140px] sm:h-[120px] overflow-hidden relative">
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

            {/* 3. Description Reel Slot */}
            <div className="h-[110px] sm:h-[90px] overflow-hidden relative">
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
            <div className="h-12 overflow-hidden relative pt-1">
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
            <div className="border border-zinc-800 bg-zinc-950 rounded-2xl shadow-[0_25px_90px_rgba(0,0,0,0.9)] overflow-hidden text-left">
              {/* Top Browser Bar */}
              <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-4 py-1 rounded-md bg-black border border-zinc-800 text-xs font-mono text-zinc-400">
                  {currentView.url}
                </div>
                <div className="w-12" />
              </div>

              {/* Dynamic Screen Content with Crossfade */}
              <div className="p-6 sm:p-8 min-h-[300px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="w-full"
                  >
                    {activeTab === 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white">Investigation: High Checkout Latency</h3>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            Root Cause Identified
                          </Badge>
                        </div>
                        <div className="p-5 rounded-xl bg-zinc-900 border border-primary/40 space-y-3">
                          <div className="flex items-center justify-between text-sm font-semibold text-white">
                            <span>payment-service Commit #8f92a1c</span>
                            <span className="text-emerald-400 font-mono text-xs">94% Confidence</span>
                          </div>
                          <p className="text-xs font-mono text-zinc-300">
                            Reasoning: DB connection pool decreased from 50 to 10 right before alert spike.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 1 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white">Service & Dependency Topology</h3>
                          <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">
                            6 Microservices Connected
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                            <div className="font-bold text-white">api-gateway</div>
                            <div className="text-zinc-400 text-[11px]">Upstream Entry &bull; Healthy</div>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-primary/40 space-y-2">
                            <div className="font-bold text-primary">auth-service</div>
                            <div className="text-amber-400 text-[11px]">Root Cause Location</div>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                            <div className="font-bold text-white">payment-service</div>
                            <div className="text-rose-400 text-[11px]">Downstream Impacted</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white">Recent Changes Risk Matrix</h3>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                            Pre-Deploy Analysis
                          </Badge>
                        </div>
                        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                          <div className="flex items-center justify-between text-sm font-semibold text-white">
                            <span>PR #342: Refactor auth JWT verification</span>
                            <span className="text-amber-400 font-mono text-xs">Risk Score: 0.78 (High)</span>
                          </div>
                          <p className="text-xs font-mono text-zinc-400">
                            Risk Basis: Modifies core authentication package; impacts 4 downstream microservices.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Fallback: Simple consecutive static sections */}
      <div className="block md:hidden py-16 px-4 sm:px-6 space-y-16">
        {views.map((view) => (
          <div key={view.id} className="space-y-6 text-left">
            <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
              {view.eyebrow}
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              {view.headline}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              {view.description}
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
              <h3 className="text-sm font-bold text-white">
                {view.id === 'investigation'
                  ? 'Investigation: High Checkout Latency'
                  : view.id === 'dependencies'
                  ? 'Service & Dependency Topology'
                  : 'Recent Changes Risk Matrix'}
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                {view.id === 'investigation'
                  ? 'DB connection pool decreased from 50 to 10 right before alert spike.'
                  : view.id === 'dependencies'
                  ? 'auth-service \u2022 payment-service \u2022 api-gateway'
                  : 'PR #342 \u2022 Risk Score: 0.78 (High Risk)'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
