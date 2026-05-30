'use client'

import { ReactNode } from 'react'
import { TopNav } from './top-nav'

/**
 * Main application shell wrapper
 * Handles top navigation, sidebar, and layout structure
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav />
      {children}
    </>
  )
}
