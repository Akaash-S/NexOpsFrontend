'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface NexOpsLogoProps {
  className?: string
  imgClassName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  alt?: string
}

export function NexOpsLogo({
  className,
  imgClassName,
  size = 'md',
  alt = 'NexOps',
}: NexOpsLogoProps) {
  const sizeMap = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  }

  const hClass = sizeMap[size] || 'h-10'

  return (
    <div className={cn("inline-flex items-center select-none", className)}>
      {/* Dark Theme Logo (shown when application is in dark theme) */}
      <img
        src="/images/NexOp-Dark-Theme-Logo.png"
        alt={alt}
        className={cn("hidden dark:block w-auto object-contain transition-opacity duration-200", hClass, imgClassName)}
      />
      {/* Light Theme Logo (shown when application is in light theme) */}
      <img
        src="/images/NexOps-Light-Theme-Logo.png"
        alt={alt}
        className={cn("block dark:hidden w-auto object-contain transition-opacity duration-200", hClass, imgClassName)}
      />
    </div>
  )
}
