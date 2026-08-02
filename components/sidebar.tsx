'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Network,
  Bug,
  GitCommitHorizontal,
  Activity,
  Plug,
  Settings,
  ChevronRight,
  ChevronsUpDown,
  Sparkles,
  HelpCircle,
  LogOut,
  ExternalLink,
  Send,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/hooks/use-app-state'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  extended?: boolean
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="w-4 h-4" />, extended: true },
    ],
  },
  {
    title: 'ENGINEERING',
    items: [
      { label: 'Services', href: '/services', icon: <Package className="w-4 h-4" /> },
      { label: 'Dependencies', href: '/dependencies', icon: <Network className="w-4 h-4" /> },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Incidents', href: '/incidents', icon: <Bug className="w-4 h-4" /> },
      { label: 'Recent Changes', href: '/recent-changes', icon: <GitCommitHorizontal className="w-4 h-4" /> },
      { label: 'Activity Stream', href: '/activity', icon: <Activity className="w-4 h-4" />, extended: true },
    ],
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { label: 'Integrations', href: '/integrations', icon: <Plug className="w-4 h-4" /> },
      { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
]

function NavItemComponent({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link href={item.href} prefetch={false}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'w-full justify-start px-3 h-9 text-sm gap-2 group',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
            : 'text-sidebar-foreground/80 hover:text-sidebar-foreground'
        )}
      >
        {item.icon}
        <span className="flex-1 text-left">{item.label}</span>
        {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
      </Button>
    </Link>
  )
}

function SidebarProfileMenu({ onCloseMobile }: { onCloseMobile: () => void }) {
  const { currentUser, setAuthenticated, addNotification } = useAppState()
  const router = useRouter()
  const [paidModalOpen, setPaidModalOpen] = useState(false)
  const [submittingInquiry, setSubmittingInquiry] = useState(false)
  const [requirements, setRequirements] = useState('')
  const [teamSize, setTeamSize] = useState('10-50 Services')

  const userName = currentUser?.name || 'Matt'
  const userEmail = currentUser?.email || 'mattpersonal321@gmail.com'
  const workspaceName = currentUser?.workspace_name || (currentUser as any)?.workspaceName || 'Default'

  const initials =
    userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

  const handleLogout = async () => {
    addNotification({
      title: 'Signed Out',
      description: 'Your authenticated session has been terminated.',
      type: 'info',
    })
    await setAuthenticated(false)
    router.push('/login')
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingInquiry(true)
    setTimeout(() => {
      setSubmittingInquiry(false)
      setPaidModalOpen(false)
      addNotification({
        title: 'Enterprise Inquiry Submitted',
        description: `Thank you, ${userName}! Our engineering lead will contact ${userEmail} regarding paid plan options.`,
        type: 'success',
      })
      setRequirements('')
    }, 500)
  }

  return (
    <>
      <div className="p-3 border-t border-sidebar-border bg-sidebar shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/70 transition-colors text-left group outline-none cursor-pointer"
            >
              {/* User Avatar */}
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover border border-sidebar-border shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {initials}
                </div>
              )}

              {/* User & Workspace Label */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-sidebar-foreground truncate leading-tight">
                  {userName}
                </p>
                <p className="text-[10px] text-sidebar-foreground/60 truncate leading-tight">
                  {workspaceName}
                </p>
              </div>

              {/* Chevron indicator */}
              <ChevronsUpDown className="w-4 h-4 text-sidebar-foreground/40 group-hover:text-sidebar-foreground transition-colors shrink-0" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={8}
            className="w-64 p-1.5 bg-sidebar border border-sidebar-border shadow-xl z-[60]"
          >
            {/* Real authenticated user email header */}
            <div className="px-3 py-2 border-b border-sidebar-border/60 mb-1">
              <p className="text-[10px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                Signed in as
              </p>
              <p
                className="text-xs font-semibold text-sidebar-foreground truncate mt-0.5"
                title={userEmail}
              >
                {userEmail}
              </p>
            </div>

            {/* Settings Link */}
            <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2 text-xs text-sidebar-foreground focus:bg-sidebar-accent">
              <Link href="/settings" prefetch={false} onClick={onCloseMobile}>
                <Settings className="w-4 h-4 text-sidebar-foreground/70" />
                <span className="flex-1">Settings</span>
              </Link>
            </DropdownMenuItem>

            {/* Paid Plan Inquiry */}
            <DropdownMenuItem
              onClick={() => setPaidModalOpen(true)}
              className="cursor-pointer gap-2 py-2 text-xs text-sidebar-foreground focus:bg-sidebar-accent"
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="flex-1">Interested in a paid plan?</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-amber-500/30 text-amber-500">
                Enterprise
              </Badge>
            </DropdownMenuItem>

            {/* Get Help Link (Live support email per /terms) */}
            <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2 text-xs text-sidebar-foreground focus:bg-sidebar-accent">
              <a
                href="mailto:akaashgithub21@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onCloseMobile}
              >
                <HelpCircle className="w-4 h-4 text-sidebar-foreground/70" />
                <span className="flex-1">Get Help</span>
                <ExternalLink className="w-3 h-3 text-sidebar-foreground/50 ml-auto" />
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-sidebar-border/60" />

            {/* Real Proven Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer gap-2 py-2 text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Paid Plan Inquiry Modal */}
      <Dialog open={paidModalOpen} onOpenChange={setPaidModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Interested in a Paid Plan?
            </DialogTitle>
            <DialogDescription className="text-xs">
              NexOps Enterprise offers custom SLA correlation rules, dedicated data retention, and 24/7 incident escalation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInquirySubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Account Email</label>
              <Input value={userEmail} disabled className="h-8 text-xs bg-muted/30" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Monitored Architecture Scale</label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full h-8 text-xs rounded-md border border-input bg-background px-3 text-foreground"
              >
                <option value="1-10 Services">1 - 10 Microservices</option>
                <option value="10-50 Services">10 - 50 Microservices</option>
                <option value="50+ Services">50+ Microservices & Multi-Cloud</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Requirements / Needs</label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Tell us what custom integrations, retention limits, or SSO features you need..."
                className="w-full text-xs rounded-md border border-input bg-background p-2 focus:outline-none focus:ring-1 focus:ring-primary resize-none text-foreground"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setPaidModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submittingInquiry} className="gap-1.5">
                {submittingInquiry ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Submit Inquiry
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { showExtendedNavigation } = useAppState()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 flex flex-col justify-between',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        <ScrollArea className="flex-1 w-full">
          <div className="p-4 space-y-6">
            {navSections.map((section) => {
              const visibleItems = section.items.filter((item) => !item.extended || showExtendedNavigation)
              if (visibleItems.length === 0) return null
              return (
                <div key={section.title}>
                  <div className="text-[10px] font-semibold tracking-widest text-sidebar-foreground/40 mb-2 px-3 uppercase">
                    {section.title}
                  </div>
                  <div className="space-y-0.5">
                    {visibleItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
                      return (
                        <NavItemComponent
                          key={item.href}
                          item={item}
                          isActive={isActive}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* Persistent Bottom Profile & Account Menu */}
        <SidebarProfileMenu onCloseMobile={onClose} />
      </aside>
    </>
  )
}
