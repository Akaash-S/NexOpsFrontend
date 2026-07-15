'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

export function AnimatedButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  glow = true,
  ...props
}: AnimatedButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl font-semibold',
  }

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 border border-primary/30',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/60',
    outline: 'bg-background/80 text-foreground hover:bg-muted/40 border border-border/80 backdrop-blur-md',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 cursor-pointer font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {glow && variant === 'primary' && (
        <span 
          className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary via-accent to-primary opacity-40 blur-sm pointer-events-none transition duration-500 group-hover:opacity-75"
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}
