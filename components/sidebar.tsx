'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  BarChart3,
  Package,
  Boxes,
  GitBranch,
  Network,
  Zap,
  Layers,
  Bug,
  AlertTriangle,
  HeartHandshake,
  Target,
  TrendingUp,
  Lightbulb,
  Gauge,
  Workflow,
  Settings,
  Users,
  Plug,
  ChevronDown,
  Star,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  items?: NavItem[]
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
      { label: 'Clusters', href: '/clusters', icon: <Boxes className="w-4 h-4" /> },
      { label: 'Services', href: '/services', icon: <Package className="w-4 h-4" /> },
      { label: 'Repositories', href: '/repositories', icon: <GitBranch className="w-4 h-4" /> },
      { label: 'Dependencies', href: '/dependencies', icon: <Network className="w-4 h-4" /> },
    ],
  },
  {
    title: 'DELIVERY',
    items: [
      { label: 'Pipelines', href: '/pipelines', icon: <Zap className="w-4 h-4" /> },
      { label: 'Deployments', href: '/deployments', icon: <Layers className="w-4 h-4" /> },
      { label: 'Releases', href: '/releases', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Alerts', href: '/alerts', icon: <AlertTriangle className="w-4 h-4" /> },
      { label: 'Incidents', href: '/incidents', icon: <Bug className="w-4 h-4" /> },
      { label: 'Health Center', href: '/health', icon: <HeartHandshake className="w-4 h-4" /> },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { label: 'Change Impact', href: '/change-impact', icon: <Target className="w-4 h-4" /> },
      { label: 'Risk Analysis', href: '/risk-analysis', icon: <TrendingUp className="w-4 h-4" /> },
      { label: 'Recommendations', href: '/recommendations', icon: <Lightbulb className="w-4 h-4" /> },
    ],
  },
  {
    title: 'AUTOMATION',
    items: [
      { label: 'Rules', href: '/rules', icon: <Gauge className="w-4 h-4" /> },
      { label: 'Workflows', href: '/workflows', icon: <Workflow className="w-4 h-4" /> },
    ],
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { label: 'Teams', href: '/teams', icon: <Users className="w-4 h-4" /> },
      { label: 'Integrations', href: '/integrations', icon: <Plug className="w-4 h-4" /> },
      { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
]

function NavItemComponent({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  if (item.items) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-between px-3 h-9 text-sm',
            isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.label}
          </span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </Button>
        {isOpen && (
          <div className="pl-4 mt-1 space-y-1">
            {item.items.map((subitem) => (
              <Link key={subitem.href} href={subitem.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'w-full justify-start px-3 h-8 text-xs',
                    isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                >
                  {subitem.icon}
                  {subitem.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link href={item.href}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'w-full justify-start px-3 h-9 text-sm gap-2',
          isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
        )}
      >
        {item.icon}
        {item.label}
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
            {/* Favorites Section */}
            <div>
              <div className="text-xs font-semibold text-sidebar-foreground/60 mb-2 flex items-center gap-2">
                <Star className="w-3 h-3" />
                FAVORITES
              </div>
              <div className="space-y-1">
                {/* Placeholder for favorites */}
                <div className="text-xs text-sidebar-foreground/50 px-3 py-2">
                  No favorites yet
                </div>
              </div>
            </div>

            {/* Recently Viewed Section */}
            <div>
              <div className="text-xs font-semibold text-sidebar-foreground/60 mb-2 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                RECENTLY VIEWED
              </div>
              <div className="space-y-1">
                {/* Placeholder for recently viewed */}
                <div className="text-xs text-sidebar-foreground/50 px-3 py-2">
                  No recent items
                </div>
              </div>
            </div>

            {/* Navigation Sections */}
            {navSections.map((section) => (
              <div key={section.title}>
                <div className="text-xs font-semibold text-sidebar-foreground/60 mb-2 px-3">
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.items?.some((subitem) => pathname === subitem.href) ?? false)
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
