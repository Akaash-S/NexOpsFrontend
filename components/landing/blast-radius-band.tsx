'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, AlertTriangle, ArrowRight, Activity, Layers } from 'lucide-react'

export function BlastRadiusBand() {
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
          {/* Visual Left: Illustrative UI Mockup of Pre-Deploy Blast Radius Assessment */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-zinc-400">Pre-Deploy Risk Assessment</span>
                  <h4 className="text-lg font-bold text-white mt-0.5">
                    PR #342 &bull; auth-service
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-zinc-400">Risk Score</div>
                  <div className="text-xl font-bold font-mono text-amber-400">0.78 / 1.0 (High Risk)</div>
                </div>
              </div>

              {/* Blast Radius Basis */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Risk Basis Explanation</span>
                </div>
                <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                  Modifies shared JWT signing logic in core auth package. Touches 4 downstream microservices directly dependent on token validation.
                </p>
              </div>

              {/* Impacted Microservices Topology */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                  Downstream Blast Radius (4 Services Impacted)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-200">payment-service</span>
                    <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px]">Direct Dep</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-200">user-service</span>
                    <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-[10px]">Direct Dep</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-200">notification-service</span>
                    <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-[10px]">Downstream</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-200">analytics-service</span>
                    <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-[10px]">Downstream</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Right */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase">
              Forward Blast Radius Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Know your downstream blast radius before you ship
            </h2>
            <p className="text-base text-zinc-400 font-normal leading-relaxed">
              Prevent incidents before they reach customers. NexOps evaluates code changes against your service graph to compute risk scores and identify every direct and downstream service impacted — visible right on the change itself.
            </p>
            <ul className="space-y-3 text-sm text-zinc-300 font-normal">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Risk scores computed before code reaches production</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Plain-language risk basis explanation for reviewers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>Full service dependency topology visibility</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
