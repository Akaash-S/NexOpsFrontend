'use client'

import React, { forwardRef } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PerspectiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  gridSize?: number
  spotlightColor?: string
}

export const PerspectiveGrid = forwardRef<HTMLDivElement, PerspectiveGridProps>(
  function PerspectiveGrid(
    {
      children,
      className,
      gridSize = 40,
      spotlightColor = 'rgba(100, 149, 237, 0.15)',
      ...props
    },
    ref
  ) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
      const { left, top } = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden bg-background border border-border/40',
          className
        )}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {/* Perspective Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
          }}
        />

        {/* Mouse Radial Spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl transition duration-300"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                ${spotlightColor},
                transparent 80%
              )
            `,
          }}
        />

        {children}
      </div>
    )
  }
)
