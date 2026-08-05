'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  X,
  FileText,
  Settings,
  BarChart3,
  AlertTriangle,
  Plug,
  Network,
  GitCommitHorizontal,
  CornerDownLeft,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
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
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [services, setServices] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])

  const onClose = useCallback(() => {
    setCommandPaletteOpen(false)
    setValue('')
    setSelectedIndex(0)
  }, [setCommandPaletteOpen])

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

  useEffect(() => {
    if (!commandPaletteOpen) return

    async function loadData() {
      try {
        const { apiFetch } = await import('@/lib/api-client')
        const [repos, incs] = await Promise.all([
          apiFetch('/repos'),
          apiFetch('/incidents')
        ])
        setServices(repos || [])
        setIncidents(incs || [])
      } catch (err) {
        console.error("Failed to load command palette data:", err)
      }
    }

    loadData()
  }, [commandPaletteOpen])

  const commands: Command[] = useMemo(() => {
    const baseCommands: Command[] = [
      { 
        id: 'nav-dashboard', 
        title: 'Dashboard', 
        description: 'View the correlation engine dashboard',
        category: 'Navigation',
        icon: <BarChart3 className="w-4 h-4" />,
        keywords: ['dashboard', 'home', 'overview', 'correlation'],
        action: () => { router.push('/dashboard'); onClose() }
      },
      {
        id: 'nav-services',
        title: 'Services Catalog',
        description: 'View all microservices and health metrics',
        category: 'Navigation',
        icon: <FileText className="w-4 h-4" />,
        keywords: ['services', 'catalog', 'microservices'],
        action: () => { router.push('/services'); onClose() }
      },
      {
        id: 'nav-dependencies',
        title: 'Dependencies & Topology',
        description: 'View 2D/3D service dependency graph',
        category: 'Navigation',
        icon: <Network className="w-4 h-4" />,
        keywords: ['dependencies', 'graph', 'topology', 'impact', 'map'],
        action: () => { router.push('/dependencies'); onClose() }
      },
      {
        id: 'nav-incidents',
        title: 'Incidents & Evidence',
        description: 'Investigate active outages and candidate causes',
        category: 'Navigation',
        icon: <AlertTriangle className="w-4 h-4" />,
        keywords: ['incidents', 'issues', 'problems', 'causal', 'outage'],
        action: () => { router.push('/incidents'); onClose() }
      },
      {
        id: 'nav-recent-changes',
        title: 'Recent Changes & Deploys',
        description: 'View deployment commits and config deltas',
        category: 'Navigation',
        icon: <GitCommitHorizontal className="w-4 h-4 text-emerald-400" />,
        keywords: ['changes', 'deployments', 'deploys', 'commits', 'blast radius'],
        action: () => { router.push('/recent-changes'); onClose() }
      },
      {
        id: 'nav-analytics',
        title: 'Analytics & MTTR Trends',
        description: 'View resolution speed and score accuracy',
        category: 'Navigation',
        icon: <Activity className="w-4 h-4" />,
        keywords: ['analytics', 'mttr', 'metrics', 'performance', 'accuracy'],
        action: () => { router.push('/analytics'); onClose() }
      },
      {
        id: 'nav-integrations',
        title: 'Integrations Stack',
        description: 'Manage GitHub, PagerDuty, and telemetry webhooks',
        category: 'Navigation',
        icon: <Plug className="w-4 h-4" />,
        keywords: ['integrations', 'plugins', 'apps', 'github', 'pagerduty', 'datadog'],
        action: () => { router.push('/integrations'); onClose() }
      },
      {
        id: 'settings',
        title: 'Workspace Settings',
        description: 'Manage security, roles, and credential rotation',
        category: 'Settings',
        icon: <Settings className="w-4 h-4" />,
        keywords: ['settings', 'preferences', 'config', 'security', 'profile'],
        action: () => { router.push('/settings'); onClose() }
      },
    ];

    const serviceCommands: Command[] = services.slice(0, 5).map((svc) => ({
      id: `service-${svc.id}`,
      title: `Service: ${svc.name}`,
      description: `${svc.ci_status === 'passing' || svc.status === 'passing' ? 'Healthy' : 'Degraded'} • Owner: ${svc.owner || 'infra-team'}`,
      category: 'Services',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      keywords: [svc.name.toLowerCase(), (svc.owner || '').toLowerCase()],
      action: () => { router.push(`/services?id=${svc.id}`); onClose() }
    }));

    const incidentCommands: Command[] = incidents.slice(0, 5).map((inc) => ({
      id: `incident-${inc.id}`,
      title: `Incident: ${inc.title}`,
      description: `${inc.severity || 'HIGH'} • Target: ${inc.service || 'payments-api'}`,
      category: 'Incidents',
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      keywords: [(inc.title || '').toLowerCase(), (inc.service || '').toLowerCase()],
      action: () => { router.push(`/incidents/${inc.id}`); onClose() }
    }));

    return [...baseCommands, ...serviceCommands, ...incidentCommands];
  }, [router, onClose, services, incidents]);

  const filteredCommands = useMemo(() => {
    if (!value.trim()) return commands;
    return commands.filter((cmd) => 
      fuzzyMatch(value, cmd.title) || 
      fuzzyMatch(value, cmd.description) ||
      cmd.keywords.some(kw => fuzzyMatch(value, kw))
    );
  }, [value, commands]);

  const selectedCommand = useMemo(() => {
    if (filteredCommands.length === 0) return null;
    const safeIndex = Math.min(selectedIndex, filteredCommands.length - 1);
    return filteredCommands[safeIndex] || filteredCommands[0];
  }, [filteredCommands, selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredCommands.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedCommand) {
        selectedCommand.action()
      }
    }
  }

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
      <DialogContent className="p-0 shadow-2xl max-w-2xl bg-background border-border" showCloseButton={false}>
        <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <div className="overflow-hidden rounded-lg">
          <div className="flex items-center border-b border-border px-4 py-3 bg-muted/40">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input
              placeholder="Search pages, services, incidents... (Type & press Enter to open)"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-medium text-foreground"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setSelectedIndex(0)
              }}
              onKeyDown={handleKeyDown}
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
              <div className="p-8 text-center space-y-1">
                <p className="text-sm font-semibold text-foreground">No matching results found.</p>
                <p className="text-xs text-muted-foreground">Try searching for "dashboard", "incidents", or "services".</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category} className="p-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {cmds.map((cmd) => {
                      const isSelected = selectedCommand?.id === cmd.id
                      const flatIndex = filteredCommands.findIndex(c => c.id === cmd.id)

                      return (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          onMouseEnter={() => {
                            if (flatIndex >= 0) setSelectedIndex(flatIndex)
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-md transition-all flex items-center justify-between gap-3 group ${
                            isSelected
                              ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm'
                              : 'hover:bg-muted/50 text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10'
                            }`}>
                              {cmd.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                {cmd.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{cmd.description}</p>
                            </div>
                          </div>

                          {isSelected && (
                            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/40 font-mono text-[10px] font-bold gap-1 animate-fade-in shrink-0">
                              <span>Open</span>
                              <CornerDownLeft className="w-3 h-3" />
                            </Badge>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 bg-muted/30 border-t border-border flex justify-between items-center text-[11px] text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <span><kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">↑</kbd> <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">↓</kbd> to navigate</span>
              <span>•</span>
              <span><kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">↵ Enter</kbd> to open top result</span>
            </div>
            <span><kbd className="px-1.5 py-0.5 bg-muted rounded border border-border">Esc</kbd> to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
