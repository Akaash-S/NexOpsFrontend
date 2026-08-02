'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface NexOpsLogoProps {
  className?: string
  imgClassName?: string
  textClassName?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  alt?: string
  showText?: boolean
}

export function NexOpsLogo({
  className,
  imgClassName,
  textClassName,
  size = 'md',
  alt = 'NexOps',
  showText = true,
}: NexOpsLogoProps) {
  const sizeMap = {
    xs: 'h-6',
    sm: 'h-7',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-14',
  }

  const textSizeMap = {
    xs: 'text-xs font-bold',
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold sm:text-lg',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl font-extrabold',
  }

  const hClass = sizeMap[size] || 'h-8'

  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      {/* Dark Theme Logo Emblem */}
      <img
        src="/images/NexOp-Dark-Theme-Logo.png"
        alt={alt}
        className={cn("hidden dark:block w-auto object-contain transition-opacity duration-200", hClass, imgClassName)}
      />
      {/* Light Theme Logo Emblem */}
      <img
        src="/images/NexOps-Light-Theme-Logo.png"
        alt={alt}
        className={cn("block dark:hidden w-auto object-contain transition-opacity duration-200", hClass, imgClassName)}
      />
      {showText && (
        <span className={cn("font-extrabold tracking-tight text-foreground leading-none", textSizeMap[size] || "text-lg", textClassName)}>
          NexOps
        </span>
      )}
    </div>
  )
}
