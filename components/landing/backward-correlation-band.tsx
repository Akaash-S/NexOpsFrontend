'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { GitCommit, GitPullRequest, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react'

export function BackwardCorrelationBand() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-3">
              Backward Correlation Engine
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Trace incident alerts backward to exact code commits
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              NexOps continuously maps your active infrastructure telemetry against recent GitHub pull requests and commit histories. When latency spikes or error rates climb, NexOps isolates the specific code changes deployed right before the anomaly.
            </p>

            <div className="mt-8 space-y-4 font-mono text-sm text-zinc-300">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Automatic correlation across 50+ microservices</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>GitHub PR & Commit diff line-level indexing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Continuous alert-to-deploy window evaluation</span>
              </div>
            </div>
          </motion.div>

          {/* Visual Right Column (Interactive Visual Card) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-white">Pull Request #4182</span>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                Merged 6 mins ago
              </Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/60 border border-zinc-800/80 text-zinc-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-zinc-500" />
                  <span>commit c92a18f &bull; update gRPC timeout</span>
                </div>
                <span className="text-zinc-400">@dev-lead</span>
              </div>
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>PagerDuty Alert #PD-991 firing</span>
                </div>
                <span className="text-rose-400 font-bold">Matched +94%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="text-xs font-mono text-zinc-400 uppercase font-semibold">
                NexOps Correlation Output
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-mono">
                gRPC client timeout decreased from 30s to 2s in commit c92a18f. High correlation with downstream payment-gateway RPC context canceled errors.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
