'use client'

import { useState, useEffect, useMemo } from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { Search, X, FileText, Zap, Settings, BarChart3, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { mockServices, mockIncidents, mockAlerts } from '@/lib/mock-data'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

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

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [value, setValue] = useState('')

  const commands: Command[] = useMemo(() => {
    const baseCommands: Command[] = [
      // Navigation
      { 
        id: 'nav-dashboard', 
        title: 'Go to Dashboard', 
        description: 'View your engineering command center',
        category: 'Navigation',
        icon: <BarChart3 className="w-4 h-4" />,
        keywords: ['dashboard', 'home', 'overview'],
        action: () => { window.location.href = '/dashboard'; onClose() }
      },
      {
        id: 'nav-services',
        title: 'Go to Services',
        description: 'View all services and their health',
        category: 'Navigation',
        icon: <FileText className="w-4 h-4" />,
        keywords: ['services', 'catalog', 'microservices'],
        action: () => { window.location.href = '/services'; onClose() }
      },
      {
        id: 'nav-incidents',
        title: 'Go to Incidents',
        description: 'View and manage incidents',
        category: 'Navigation',
        icon: <AlertTriangle className="w-4 h-4" />,
        keywords: ['incidents', 'issues', 'problems'],
        action: () => { window.location.href = '/incidents'; onClose() }
      },
      {
        id: 'nav-alerts',
        title: 'Go to Alerts',
        description: 'View active alerts and notifications',
        category: 'Navigation',
        icon: <Zap className="w-4 h-4" />,
        keywords: ['alerts', 'warnings', 'notifications'],
        action: () => { window.location.href = '/alerts'; onClose() }
      },
      {
        id: 'nav-deployments',
        title: 'Go to Deployments',
        description: 'View deployment history and status',
        category: 'Navigation',
        icon: <Zap className="w-4 h-4" />,
        keywords: ['deployments', 'releases', 'releases'],
        action: () => { window.location.href = '/deployments'; onClose() }
      },
      {
        id: 'settings',
        title: 'Settings',
        description: 'Manage your preferences',
        category: 'Settings',
        icon: <Settings className="w-4 h-4" />,
        keywords: ['settings', 'preferences', 'config'],
        action: () => { window.location.href = '/settings'; onClose() }
      },
    ];

    // Add services to commands
    const serviceCommands: Command[] = mockServices.slice(0, 3).map((svc) => ({
      id: `service-${svc.id}`,
      title: svc.name,
      description: `${svc.status === 'healthy' ? 'Healthy' : 'Degraded'} - ${svc.team}`,
      category: 'Services',
      icon: <FileText className="w-4 h-4" />,
      keywords: [svc.name.toLowerCase(), svc.team.toLowerCase()],
      action: () => { window.location.href = `/services?id=${svc.id}`; onClose() }
    }));

    // Add incidents to commands
    const incidentCommands: Command[] = mockIncidents.slice(0, 2).map((inc) => ({
      id: `incident-${inc.id}`,
      title: inc.title,
      description: `${inc.severity} - ${inc.service}`,
      category: 'Incidents',
      icon: <AlertTriangle className="w-4 h-4" />,
      keywords: [inc.title.toLowerCase(), inc.service.toLowerCase()],
      action: () => { window.location.href = `/incidents?id=${inc.id}`; onClose() }
    }));

    return [...baseCommands, ...serviceCommands, ...incidentCommands];
  }, [onClose]);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 shadow-lg max-w-2xl">
        <DialogHeader className="sr-only">
          Command Palette
        </DialogHeader>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="w-4 h-4 text-muted-foreground mr-3" />
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
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          <div className="max-h-96 overflow-auto divide-y divide-border">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-muted-foreground">No commands found</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category} className="p-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {cmds.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1 text-muted-foreground">{cmd.icon}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{cmd.title}</p>
                            <p className="text-xs text-muted-foreground">{cmd.description}</p>
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
