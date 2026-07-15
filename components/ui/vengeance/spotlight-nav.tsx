'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedButton } from './animated-button'

export function SpotlightNav() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-transparent border-b border-white/5 backdrop-blur-sm z-50 transition-colors">
      <div className="flex items-center justify-between h-full px-6 lg:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center group">
          <span className="font-extrabold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
            NexOps
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <AnimatedButton variant="outline" size="sm">
              Sign In
            </AnimatedButton>
          </Link>
          <Link href="/login">
            <AnimatedButton variant="primary" size="sm" glow={false}>
              Launch Engine
              <ArrowRight className="w-3.5 h-3.5" />
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </header>
  )
}
