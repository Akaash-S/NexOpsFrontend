'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedButton } from './animated-button'

export function SpotlightNav() {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-5xl rounded-full border border-white/10 bg-[#090b0f]/60 backdrop-blur-xl px-6 py-2.5 z-50 shadow-2xl transition-all flex items-center justify-between">
      <Link href="/" className="flex items-center group">
        <span className="font-extrabold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
          NexOps
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Link href="/login">
          <AnimatedButton variant="outline" size="sm" className="rounded-full">
            Sign In
          </AnimatedButton>
        </Link>
        <Link href="/login">
          <AnimatedButton variant="primary" size="sm" glow={false} className="rounded-full">
            Launch Engine
            <ArrowRight className="w-3.5 h-3.5" />
          </AnimatedButton>
        </Link>
      </div>
    </header>
  )
}
