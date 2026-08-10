'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Network, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react'

export function BlastRadiusBand() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-white">Pre-Deploy Blast Radius Simulation</span>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs font-mono">
                Risk Score: High (0.82)
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="text-xs font-mono text-zinc-400 font-semibold uppercase">
                  Target Service
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-white font-mono">
                  <span>auth-service v2.4.0</span>
                  <span className="text-amber-400 text-xs">4 Downstream Dependents</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-rose-500/30 text-rose-300">
                  <div className="font-bold">user-dashboard</div>
                  <div className="text-[11px] text-rose-400/80 mt-1">High Outage Risk</div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-amber-500/30 text-amber-300">
                  <div className="font-bold">payment-gateway</div>
                  <div className="text-[11px] text-amber-400/80 mt-1">Medium Latency Impact</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="text-xs font-mono font-semibold tracking-wider text-amber-400 uppercase mb-3">
              Predictive Impact Analysis
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Know the downstream blast radius before merging
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              Don't wait for production alerts to reveal service dependencies. NexOps calculates exact downstream blast radiuses on every pull request, warning developers before breaking changes hit staging.
            </p>

            <div className="mt-8 space-y-4 font-mono text-sm text-zinc-300">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Automated PR risk scoring in GitHub actions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Real-time downstream service graph traversal</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
