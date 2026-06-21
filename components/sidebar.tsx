'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Network,
  Bug,
  GitCommitHorizontal,
  Plug,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
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
    <Link href={item.href}>
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

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()

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
          'fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        <ScrollArea className="h-full w-full">
          <div className="p-4 space-y-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <div className="text-[10px] font-semibold tracking-widest text-sidebar-foreground/40 mb-2 px-3 uppercase">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
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
            ))}
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}
