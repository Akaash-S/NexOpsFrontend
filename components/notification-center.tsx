'use client'

import { X, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useState, useMemo } from 'react'
import { getActiveAlerts, getInvestigatingIncidents } from '@/lib/mock-data'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

interface Notification {
  id: string
  type: 'alert' | 'incident' | 'info'
  title: string
  description: string
  timestamp: string
  read: boolean
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  const notifications: Notification[] = useMemo(() => {
    const alerts = getActiveAlerts().map((alert, idx) => ({
      id: `alert-${idx}`,
      type: 'alert' as const,
      title: alert.title,
      description: `Current: ${alert.current} (Threshold: ${alert.threshold})`,
      timestamp: new Date(alert.createdAt).toLocaleString(),
      read: readIds.has(`alert-${idx}`),
    }));

    const incidents = getInvestigatingIncidents().map((inc, idx) => ({
      id: `incident-${idx}`,
      type: 'incident' as const,
      title: inc.title,
      description: `${inc.affectedUsers} users affected - ${inc.service}`,
      timestamp: new Date(inc.startedAt).toLocaleString(),
      read: readIds.has(`incident-${idx}`),
    }));

    return [...alerts, ...incidents].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [readIds]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setReadIds(prev => new Set([...prev, id]));
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'alert':
        return { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' };
      case 'incident':
        return { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' };
      case 'info':
        return { icon: Info, color: 'text-info', bg: 'bg-info/10' };
      default:
        return { icon: Bell, color: 'text-foreground', bg: 'bg-secondary' };
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-background border-l border-border z-50 transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 min-h-0">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-success/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notif) => {
                  const config = getTypeConfig(notif.type);
                  const TypeIcon = config.icon;
                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className={cn(
                        'w-full text-left p-4 hover:bg-accent transition-colors',
                        !notif.read && 'bg-accent/20'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('mt-1', config.color)}>
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notif.description}</p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{notif.timestamp}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
