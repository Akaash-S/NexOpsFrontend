'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Search, Bell, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sidebar } from './sidebar'
import { CommandPalette } from './command-palette'
import { useAppState } from '@/lib/hooks/use-app-state'
import { NexOpsLogo } from '@/components/ui/nexops-logo'
import { cn } from '@/lib/utils'

export function TopNav() {
  const router = useRouter()
  const {
    setCommandPaletteOpen,
    getUnreadCount,
    notifications,
    markNotificationAsRead,
    markAllAsRead,
  } = useAppState()
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
            <Link href="/dashboard" className="flex items-center gap-2 whitespace-nowrap" prefetch={false}>
              <NexOpsLogo size="md" />
            </Link>

            {/* Workspace Switcher */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                    <span className="text-sm font-medium">Default</span>
                    <ChevronDown className="w-4 h-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 p-2">
                  <DropdownMenuItem className="font-semibold text-xs">Default</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-3 text-center text-xs text-muted-foreground select-none">
                    No other workspaces
                  </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-destructive text-[10px] font-bold text-destructive-foreground rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 z-50 overflow-hidden bg-card border border-border">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/20">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        markAllAsRead()
                      }}
                      className="text-xs font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer p-0"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* List Container */}
                <div className="max-h-[300px] overflow-y-auto divide-y divide-border/40">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-2 select-none">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Bell className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-foreground">You're all caught up</p>
                      <p className="text-[10px] text-muted-foreground max-w-[220px]">
                        No new notifications. We'll alert you if incidents or risk-deploys are detected.
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem
                        key={n.id}
                        className={cn(
                          "flex items-start gap-3 p-4 cursor-pointer focus:bg-muted/80 focus:text-foreground transition-all duration-200 border-none outline-none rounded-none select-none",
                          !n.read ? "bg-primary/5 hover:bg-primary/10 font-medium" : "hover:bg-muted/50"
                        )}
                        onClick={() => {
                          markNotificationAsRead(n.id)
                          if (n.link) {
                            router.push(n.link)
                          }
                        }}
                      >
                        {/* Status Indicator Dot */}
                        <span className={cn(
                          "w-2 h-2 rounded-full mt-1.5 flex-shrink-0 animate-pulse",
                          n.type === 'error' && 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]',
                          n.type === 'warning' && 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]',
                          n.type === 'success' && 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]',
                          n.type === 'info' && 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                        )} />

                        {/* Text Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-xs leading-none tracking-tight",
                              !n.read ? "text-foreground font-bold" : "text-muted-foreground"
                            )}>
                              {n.title}
                            </p>
                            <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                              {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', month: 'short', day: 'numeric' }).format(new Date(n.timestamp))}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-normal line-clamp-2">
                            {n.description}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
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
