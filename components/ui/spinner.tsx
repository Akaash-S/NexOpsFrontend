'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

function Spinner({ className, size = 'sm', ...props }: SpinnerProps) {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('inline-flex items-center justify-center relative select-none', className)}
      {...props}
    >
      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-sm animate-ping pointer-events-none" />
      <img
        src="/images/NexOp-Dark-Theme-Logo.png"
        alt="NexOps Loading"
        className={cn('object-contain animate-pulse duration-700 relative z-10', sizeMap[size] || 'w-5 h-5')}
      />
    </div>
  )
}

export { Spinner }
