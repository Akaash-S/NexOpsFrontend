'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export function FinalCtaBanner() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-zinc-900 text-white relative overflow-hidden">
      {/* Background Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Design Partner Pilot &bull; Limited Access</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Ready to reduce MTTR from hours to minutes?
        </h2>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Join leading engineering teams using NexOps to eliminate 2 AM guesswork and prevent risky deployments before they reach production.
        </p>

        <div className="pt-4">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-xl text-base transition-all shadow-xl shadow-primary/25"
          >
            <Link href="/login" className="flex items-center gap-2">
              <span>Join the pilot now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
