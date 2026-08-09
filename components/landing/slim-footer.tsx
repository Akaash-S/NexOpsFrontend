'use client'

import Link from 'next/link'
import { NexOpsLogo } from '@/components/ui/nexops-logo'

export function SlimFooter() {
  return (
    <footer className="py-12 bg-black text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Wordmark & Tagline */}
        <div className="flex items-center gap-3">
          <NexOpsLogo size="sm" showText={true} />
          <span className="text-zinc-600 hidden sm:inline">&bull;</span>
          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
            Instant incident root-cause intelligence
          </span>
        </div>

        {/* Center: Real Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
          <a href="#product" className="hover:text-white transition-colors duration-200">
            Product
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors duration-200">
            How it works
          </a>
          <a href="#faq" className="hover:text-white transition-colors duration-200">
            FAQ
          </a>
          <Link href="/terms" className="hover:text-white transition-colors duration-200">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors duration-200">
            Privacy Policy
          </Link>
        </div>

        {/* Right: Copyright */}
        <div className="text-xs text-zinc-500 font-mono">
          &copy; 2026 NexOps. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
