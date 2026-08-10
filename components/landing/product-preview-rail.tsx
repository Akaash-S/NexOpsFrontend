'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ProductPreviewRail() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Feature 2 (Service Topology) content layer vertical slide-up inside the stage (100% solid background)
  const feature2Y = useTransform(scrollYProgress, [0.22, 0.52], ['100%', '0%'])

  // Feature 3 (Pre-Deploy Risk) content layer vertical slide-up inside the stage (100% solid background)
  const feature3Y = useTransform(scrollYProgress, [0.58, 0.88], ['100%', '0%'])

  return (
    <section ref={sectionRef} className="relative bg-zinc-900 text-white md:h-[350vh]">
      {/* Single Fixed Background Section Viewport (Desktop Pinned Content Stage) */}
      <div className="hidden md:flex sticky top-0 h-screen items-center justify-center overflow-hidden w-full bg-zinc-900">
        {/* Inner Content Stage with Fixed Dimensions & Clipping */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[520px] overflow-hidden">
          {/* FEATURE LAYER 1 (Base Layer - Incident Investigation - 100% Solid Opaque) */}
          <div className="absolute inset-0 z-10 bg-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
                Unified Platform Interface
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Ranked root causes with plain-English evidence
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
                When an alert fires, NexOps immediately analyzes recent GitHub commits, pull requests, and deployment signals. Instead of forcing your team to dig through logs, NexOps presents ranked candidate causes with clear explanations.
              </p>
              <div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Explore Investigation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Mockup Column */}
            <div className="lg:col-span-7">
              <div className="border border-zinc-800 bg-zinc-950 rounded-2xl shadow-[0_25px_90px_rgba(0,0,0,0.9)] overflow-hidden text-left">
                <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-4 py-1 rounded-md bg-black border border-zinc-800 text-xs font-mono text-zinc-400">
                    nexops.asolvitra.tech/investigation
                  </div>
                  <div className="w-12" />
                </div>
                <div className="p-6 sm:p-8 space-y-6">
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
              </div>
            </div>
          </div>

          {/* FEATURE LAYER 2 (Middle Layer - Service Topology - Vertical Slide-Up Inside Stage) */}
          <motion.div
            style={prefersReducedMotion ? undefined : { y: feature2Y }}
            className="absolute inset-0 z-20 bg-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
                Dependency Graph & Health
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Map microservices and inter-service health
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
                Visualize real-time upstream entry points, core service bottlenecks, and downstream degraded dependency paths to isolate cascading infrastructure failures instantly.
              </p>
              <div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Explore Topology
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Mockup Column */}
            <div className="lg:col-span-7">
              <div className="border border-zinc-800 bg-zinc-950 rounded-2xl shadow-[0_25px_90px_rgba(0,0,0,0.9)] overflow-hidden text-left">
                <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-4 py-1 rounded-md bg-black border border-zinc-800 text-xs font-mono text-zinc-400">
                    nexops.asolvitra.tech/dependencies
                  </div>
                  <div className="w-12" />
                </div>
                <div className="p-6 sm:p-8 space-y-6">
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
              </div>
            </div>
          </motion.div>

          {/* FEATURE LAYER 3 (Top Layer - Pre-Deploy Risk - Vertical Slide-Up Inside Stage) */}
          <motion.div
            style={prefersReducedMotion ? undefined : { y: feature3Y }}
            className="absolute inset-0 z-30 bg-zinc-900 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
                Real-Time Risk Prevention
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Calculate blast radius before deployment
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
                Prevent incidents before they reach production by automatically analyzing pull requests, calculating risk scores, and evaluating downstream dependency impacts.
              </p>
              <div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Explore Risk Matrix
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Mockup Column */}
            <div className="lg:col-span-7">
              <div className="border border-zinc-800 bg-zinc-950 rounded-2xl shadow-[0_25px_90px_rgba(0,0,0,0.9)] overflow-hidden text-left">
                <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-4 py-1 rounded-md bg-black border border-zinc-800 text-xs font-mono text-zinc-400">
                    nexops.asolvitra.tech/risk
                  </div>
                  <div className="w-12" />
                </div>
                <div className="p-6 sm:p-8 space-y-6">
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Fallback: Simple consecutive static sections */}
      <div className="block md:hidden py-16 px-4 sm:px-6 space-y-16">
        {/* Mobile Feature 1 */}
        <div className="space-y-6 text-left">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
            Unified Platform Interface
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
            Ranked root causes with plain-English evidence
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            When an alert fires, NexOps presents ranked candidate causes with clear explanations.
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
            <h3 className="text-sm font-bold text-white">Investigation: High Checkout Latency</h3>
            <p className="text-xs font-mono text-zinc-400">
              DB connection pool decreased from 50 to 10 right before alert spike.
            </p>
          </div>
        </div>

        {/* Mobile Feature 2 */}
        <div className="space-y-6 text-left">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
            Dependency Graph & Health
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
            Map microservices and inter-service health
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Visualize real-time upstream entry points and core service bottlenecks.
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
            <h3 className="text-sm font-bold text-white">Service & Dependency Topology</h3>
            <p className="text-xs font-mono text-zinc-400">
              auth-service &bull; payment-service &bull; api-gateway
            </p>
          </div>
        </div>

        {/* Mobile Feature 3 */}
        <div className="space-y-6 text-left">
          <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
            Real-Time Risk Prevention
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
            Calculate blast radius before deployment
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
            Calculate risk scores and downstream impacts on every pull request.
          </p>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
            <h3 className="text-sm font-bold text-white">Recent Changes Risk Matrix</h3>
            <p className="text-xs font-mono text-zinc-400">
              PR #342 &bull; Risk Score: 0.78 (High Risk)
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
