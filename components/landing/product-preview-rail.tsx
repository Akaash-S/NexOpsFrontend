'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export function ProductPreviewRail() {
  const [activeTab, setActiveTab] = useState(0)

  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Map scroll progress (0..1) to active view index (0..2) on desktop
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (prefersReducedMotion) return
    const computedIndex = Math.min(2, Math.floor(latest * 3))
    setActiveTab(computedIndex)
  })

  // Tab click handler: swaps view AND smoothly scrolls to that view's segment
  const handleTabClick = (idx: number) => {
    setActiveTab(idx)
    if (prefersReducedMotion || !sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const sectionTop = rect.top + window.scrollY
    const sectionHeight = sectionRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const scrollableDistance = sectionHeight - viewportHeight

    // Calculate center ratio of each view segment: 0 -> 16.6%, 1 -> 50%, 2 -> 83.3%
    const segmentCenterRatio = (idx + 0.5) / 3
    const targetY = sectionTop + segmentCenterRatio * scrollableDistance

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    })
  }

  // Stage expanding/scaling animation
  const inset = useTransform(scrollYProgress, [0, 0.5, 1], [24, 0, 0])
  const radius = useTransform(scrollYProgress, [0, 0.5, 1], [32, 12, 12])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 1])

  const views = [
    {
      id: 'investigation',
      label: 'Incident Investigation',
      title: 'Root Cause & Reasoning View',
      description: 'Ranked candidate causes with plain-English evidence and engineer confirmation controls.',
    },
    {
      id: 'dependencies',
      label: 'Service Topology',
      title: 'Microservices & Dependency Graph',
      description: 'Interactive service map showing inter-service connections and dependency health.',
    },
    {
      id: 'risk',
      label: 'Pre-Deploy Risk',
      title: 'Recent Changes & Risk Matrix',
      description: 'Real-time deployment tracking with risk scores and blast radius calculations.',
    },
  ]

  return (
    <section ref={sectionRef} className="relative bg-zinc-900 text-white md:h-[300vh]">
      {/* Desktop Pinned Viewport (Scroll-Driven 3-View Progression) */}
      <div className="hidden md:flex sticky top-0 h-screen items-center overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-3">
            Unified Platform Interface
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Purpose-built for incident response and risk prevention
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal">
            Explore the key workflows designed to get your team from alert to resolution in seconds.
          </p>

          {/* Tab Controls (Click Manual Override with Scroll Position Sync) */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {views.map((view, idx) => (
              <button
                key={view.id}
                onClick={() => handleTabClick(idx)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === idx
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-zinc-950/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>

          {/* Desktop Expanding Stage Container */}
          <motion.div
            style={prefersReducedMotion ? undefined : { paddingLeft: inset, paddingRight: inset }}
            className="mt-12 mx-auto max-w-5xl"
          >
            <motion.div
              style={prefersReducedMotion ? undefined : { borderRadius: radius, scale }}
              className="border border-zinc-800 bg-zinc-950 shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden text-left"
            >
              {/* Browser Window Bar */}
              <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-4 py-1 rounded-md bg-black/60 border border-zinc-800 text-xs font-mono text-zinc-400">
                  nexops.asolvitra.tech/{views[activeTab].id}
                </div>
                <div className="w-12" />
              </div>

              {/* Dynamic Screen Content with Smooth Opacity Crossfade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="p-6 sm:p-10"
                >
                  {activeTab === 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Investigation: High Checkout Latency</h3>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                          Root Cause Identified
                        </Badge>
                      </div>
                      <div className="p-5 rounded-xl bg-zinc-900/80 border border-primary/40 space-y-3">
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
                        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                          <div className="font-bold text-white">api-gateway</div>
                          <div className="text-zinc-400 text-[11px]">Upstream Entry &bull; Healthy</div>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-900/60 border border-primary/40 space-y-2">
                          <div className="font-bold text-primary">auth-service</div>
                          <div className="text-amber-400 text-[11px]">Root Cause Location</div>
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
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
                      <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
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
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Fallback: Simple static section with click-only tabs */}
      <div className="block md:hidden py-16 px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-2">
            Unified Platform Interface
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
            Purpose-built for incident response and risk prevention
          </h2>
          <p className="mt-3 text-xs text-zinc-400 font-normal">
            Explore the key workflows designed to get your team from alert to resolution in seconds.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {views.map((view, idx) => (
              <button
                key={view.id}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === idx
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-zinc-950 text-zinc-400'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden text-left p-4">
          {activeTab === 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Investigation: High Checkout Latency</h3>
              <p className="text-xs font-mono text-zinc-400">
                DB connection pool decreased from 50 to 10 right before alert spike.
              </p>
            </div>
          )}
          {activeTab === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Service & Dependency Topology</h3>
              <p className="text-xs font-mono text-zinc-400">
                auth-service &bull; payment-service &bull; api-gateway
              </p>
            </div>
          )}
          {activeTab === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">Recent Changes Risk Matrix</h3>
              <p className="text-xs font-mono text-zinc-400">
                PR #342 &bull; Risk Score: 0.78 (High Risk)
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
