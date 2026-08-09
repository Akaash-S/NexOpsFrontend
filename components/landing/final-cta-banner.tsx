'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'

export function FinalCtaBanner() {
  return (
    <section className="py-20 md:py-28 lg:py-32 bg-black text-white border-t border-zinc-900 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto p-10 sm:p-16 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl backdrop-blur-xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Get NexOps on your next incident.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal">
            Connect GitHub and PagerDuty in under two minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3.5 text-base rounded-xl transition-all shadow-xl shadow-primary/30 hover:shadow-primary/50"
            >
              <Link href="/login" className="flex items-center gap-2">
                <span>Join the pilot</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
