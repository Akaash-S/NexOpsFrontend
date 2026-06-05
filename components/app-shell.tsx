'use client'

import { ReactNode } from 'react'
import { TopNav } from './top-nav'
import { PageLayout } from './layout'

/**
 * Main application shell wrapper
 * Handles top navigation, sidebar, and layout structure
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <TopNav />
      <PageLayout>
        {children}
      </PageLayout>
    </>
  )
}
