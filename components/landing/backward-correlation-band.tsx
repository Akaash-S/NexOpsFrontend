'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, GitCommitHorizontal, MessageSquareCode } from 'lucide-react'

export function BackwardCorrelationBand() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-black text-white border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Text Content Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
              Backward Correlation Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Pinpoint breaking deploys with explainable evidence
            </h2>
            <p className="text-base text-zinc-400 font-normal leading-relaxed">
              NexOps correlates PagerDuty alerts with GitHub deployments in real time. Each candidate cause is presented with a clear explanation of why it was flagged.
            </p>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 leading-relaxed font-normal">
              <strong className="text-white">Engineering memory moat:</strong> Your team's confirmations and rejections make future root-cause answers more accurate for your systems specifically.
            </div>
          </div>

          {/* Visual Right: Illustrative UI Mockup of Candidate Causes with Feedback Loop */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-2xl space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                Ranked Candidates & Feedback Loop
              </div>

              {/* Candidate #1 */}
              <div className="p-5 rounded-xl bg-zinc-900/90 border border-primary/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-sm font-semibold text-white">
                    <GitCommitHorizontal className="w-4 h-4 text-primary" />
                    <span>auth-service #8f92a1c</span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                    Confirmed by On-Call
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-xs font-mono text-zinc-300">
                  Direct dependency update on database max connections within 4m of PagerDuty alert firing.
                </div>
              </div>

              {/* Candidate #2 */}
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-3 opacity-75 hover:opacity-100 transition-opacity">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono text-sm font-semibold text-zinc-300">
                    <GitCommitHorizontal className="w-4 h-4 text-zinc-400" />
                    <span>gateway-service #3b1104e</span>
                  </div>
                  <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">
                    42% Match Score
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 text-xs font-mono text-zinc-400">
                  Rate limiter configuration tweak deployed 18m prior. No direct error spike correlation observed.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
