'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Command as CommandPrimitive } from 'cmdk'
import { Search, X, FileText, Zap, Settings, BarChart3, AlertTriangle, Users, Plug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { SERVICES_DATA, INCIDENTS_DATA, ALERTS_DATA } from '@/lib/mock-data'
import { useAppState } from '@/lib/hooks/use-app-state'

interface Command {
  id: string
  title: string
  description: string
  category: string
  icon: React.ReactNode
  keywords: string[]
  action: () => void
}

const fuzzyMatch = (query: string, text: string) => {
  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  
  if (!queryLower) return true
  if (textLower.includes(queryLower)) return true
  
  let queryIndex = 0
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) queryIndex++
  }
  return queryIndex === queryLower.length
}

export function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppState()
  const [value, setValue] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  const onClose = () => setCommandPaletteOpen(false)

  const commands: Command[] = useMemo(() => {
    const baseCommands: Command[] = [
      // Navigation
      { 
        id: 'nav-dashboard', 
        title: 'Dashboard', 
        description: 'View your engineering command center',
        category: 'Navigation',
        icon: <BarChart3 className="w-4 h-4" />,
        keywords: ['dashboard', 'home', 'overview'],
        action: () => { router.push('/dashboard'); onClose() }
      },
      {
        id: 'nav-services',
        title: 'Services',
        description: 'View all services and their health',
        category: 'Navigation',
        icon: <FileText className="w-4 h-4" />,
        keywords: ['services', 'catalog', 'microservices'],
        action: () => { router.push('/services'); onClose() }
      },
      {
        id: 'nav-incidents',
        title: 'Incidents',
        description: 'View and manage incidents',
        category: 'Navigation',
        icon: <AlertTriangle className="w-4 h-4" />,
        keywords: ['incidents', 'issues', 'problems'],
        action: () => { router.push('/incidents'); onClose() }
      },
      {
        id: 'nav-alerts',
        title: 'Alerts',
        description: 'View active alerts and notifications',
        category: 'Navigation',
        icon: <Zap className="w-4 h-4" />,
        keywords: ['alerts', 'warnings', 'notifications'],
        action: () => { router.push('/alerts'); onClose() }
      },
      {
        id: 'nav-deployments',
        title: 'Deployments',
        description: 'View deployment history and status',
        category: 'Navigation',
        icon: <Zap className="w-4 h-4" />,
        keywords: ['deployments', 'releases'],
        action: () => { router.push('/deployments'); onClose() }
      },
      {
        id: 'nav-teams',
        title: 'Teams',
        description: 'Manage engineering teams',
        category: 'Navigation',
        icon: <Users className="w-4 h-4" />,
        keywords: ['teams', 'users', 'members'],
        action: () => { router.push('/teams'); onClose() }
      },
      {
        id: 'nav-integrations',
        title: 'Integrations',
        description: 'Connect external tools',
        category: 'Navigation',
        icon: <Plug className="w-4 h-4" />,
        keywords: ['integrations', 'plugins', 'apps'],
        action: () => { router.push('/integrations'); onClose() }
      },
      {
        id: 'settings',
        title: 'Settings',
        description: 'Manage your preferences',
        category: 'Settings',
        icon: <Settings className="w-4 h-4" />,
        keywords: ['settings', 'preferences', 'config'],
        action: () => { router.push('/settings'); onClose() }
      },
    ];

    // Add services to commands
    const serviceCommands: Command[] = SERVICES_DATA.slice(0, 3).map((svc) => ({
      id: `service-${svc.id}`,
      title: svc.name,
      description: `${svc.status === 'healthy' ? 'Healthy' : 'Degraded'} - ${svc.team}`,
      category: 'Services',
      icon: <FileText className="w-4 h-4" />,
      keywords: [svc.name.toLowerCase(), svc.team.toLowerCase()],
      action: () => { router.push(`/services?id=${svc.id}`); onClose() }
    }));

    // Add incidents to commands
    const incidentCommands: Command[] = INCIDENTS_DATA.slice(0, 2).map((inc) => ({
      id: `incident-${inc.id}`,
      title: inc.title,
      description: `${inc.severity} - ${inc.affectedServices.join(', ')}`,
      category: 'Incidents',
      icon: <AlertTriangle className="w-4 h-4" />,
      keywords: [inc.title.toLowerCase(), ...inc.affectedServices.map(s => s.toLowerCase())],
      action: () => { router.push(`/incidents?id=${inc.id}`); onClose() }
    }));

    return [...baseCommands, ...serviceCommands, ...incidentCommands];
  }, [router, onClose]);

  const filteredCommands = useMemo(() => {
    if (!value) return commands;
    return commands.filter((cmd) => 
      fuzzyMatch(value, cmd.title) || 
      fuzzyMatch(value, cmd.description) ||
      cmd.keywords.some(kw => fuzzyMatch(value, kw))
    );
  }, [value, commands]);

  const groupedCommands = useMemo(() => {
    const groups: { [key: string]: Command[] } = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <DialogContent className="p-0 shadow-lg max-w-2xl bg-background border-border" showCloseButton={false}>
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <div className="overflow-hidden rounded-lg">
          <div className="flex items-center border-b border-border px-4 py-3 bg-muted/30">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input
              placeholder="Search pages, services, incidents... (⌘K or Ctrl+K)"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="max-h-[60vh] overflow-auto divide-y divide-border bg-background">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No matching results found.</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category} className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {cmds.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                            {cmd.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{cmd.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{cmd.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
