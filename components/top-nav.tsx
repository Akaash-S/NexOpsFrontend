'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, Bell, Settings, User, Command, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sidebar } from './sidebar'
import { CommandPalette } from './command-palette'
import { useAppState } from '@/lib/hooks/use-app-state'
import { cn } from '@/lib/utils'

export function TopNav() {
  const { setCommandPaletteOpen, getUnreadCount } = useAppState()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const unreadCount = getUnreadCount()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-40">
        <div className="flex items-center justify-between h-full px-4 gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">N</span>
              </div>
              <span className="hidden sm:inline text-sm font-semibold">NexOps</span>
            </Link>

            {/* Workspace Switcher */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <span className="text-sm">Engineering</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Engineering</DropdownMenuItem>
                  <DropdownMenuItem>Platform</DropdownMenuItem>
                  <DropdownMenuItem>Infrastructure</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Center Section - Global Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full cursor-text group" onClick={() => setCommandPaletteOpen(true)}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div
                className="w-full pl-9 pr-3 h-9 text-sm flex items-center text-muted-foreground bg-muted/50 border border-border rounded-md hover:bg-muted/80 transition-colors"
              >
                Search pages, services, incidents...
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-2 py-0.5 text-xs bg-background rounded border border-border font-medium text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search Icon (Mobile) */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setCommandPaletteOpen(true)}>
              <Search className="w-5 h-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Command Palette */}
      <CommandPalette />
    </>
  )
}
