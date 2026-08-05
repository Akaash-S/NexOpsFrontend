'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface NexOpsLoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  label?: string
}

export function NexOpsLoader({
  className,
  size = 'md',
  showText = false,
  label = 'Loading...',
}: NexOpsLoaderProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  const containerSizeMap = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4',
  }

  const imageClass = sizeMap[size] || 'w-10 h-10'

  return (
    <div className={cn('inline-flex flex-col items-center justify-center gap-3 select-none', className)}>
      <div className="relative flex items-center justify-center">
        {/* Pulsing Outer Glowing Ring */}
        <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-md animate-ping pointer-events-none" />
        
        {/* Animated Brand Logo Emblem */}
        <div className={cn('relative z-10 flex items-center justify-center rounded-2xl bg-[#0c0d12]/90 border border-zinc-800/80 shadow-2xl transition-all duration-300', containerSizeMap[size])}>
          <img
            src="/images/NexOp-Dark-Theme-Logo.png"
            alt="NexOps Loading"
            className={cn('w-auto object-contain animate-pulse duration-1000', imageClass)}
          />
        </div>
      </div>

      {showText && (
        <span className="font-mono text-xs font-semibold text-zinc-400 uppercase tracking-widest animate-pulse">
          {label}
        </span>
      )}
    </div>
  )
}
