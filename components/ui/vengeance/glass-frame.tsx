'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GlassFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function GlassFrame({ children, className, ...props }: GlassFrameProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-primary/20 bg-card/40 p-2 backdrop-blur-md shadow-[0_0_50px_rgba(100,149,237,0.12)] transition-all duration-300',
        className
      )}
      {...props}
    >
      {/* Decorative Top Window Controls Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 mb-2 rounded-t-xl bg-background/60">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">nexops-triage-console.v1</span>
        <div className="w-10" />
      </div>

      {children}
    </div>
  )
}
