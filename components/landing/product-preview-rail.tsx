'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, GitCommitHorizontal, Layers, Activity } from 'lucide-react'

export function ProductPreviewRail() {
  const [activeTab, setActiveTab] = useState(0)

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

  // Auto-advance tabs slowly every 7s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % views.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [views.length])

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-black text-white border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-xs font-mono font-semibold tracking-wider text-primary uppercase mb-3">
          Unified Platform Interface
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Purpose-built for incident response and risk prevention
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal">
          Explore the key workflows designed to get your team from alert to resolution in seconds.
        </p>

        {/* Tab Controls */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {views.map((view, idx) => (
            <button
              key={view.id}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === idx
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Preview Frame */}
        <div className="mt-12 max-w-5xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden text-left">
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

          {/* Dynamic Screen Content */}
          <div className="p-6 sm:p-10 transition-all duration-500">
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
          </div>
        </div>
      </div>
    </section>
  )
}
