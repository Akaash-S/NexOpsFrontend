'use client'

import Link from 'next/link'
import { NexOpsLogo } from '@/components/ui/nexops-logo'

export function SlimFooter() {
  return (
    <footer className="py-12 bg-black text-white border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <NexOpsLogo size="sm" showText={true} />
          <span className="text-xs text-zinc-600 ml-2">&copy; {new Date().getFullYear()} NexOps Inc.</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
          <Link href="/login" className="hover:text-white transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  )
}
