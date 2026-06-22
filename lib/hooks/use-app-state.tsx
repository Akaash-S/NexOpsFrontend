'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { mockIncidents } from '@/lib/mock-data';

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface CommandPaletteItem {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: string[];
  action: () => void;
}

interface AppContextType {
  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadCount: () => number;
  
  // User state
  currentUser: { name: string; email: string; avatar?: string } | null;
  setCurrentUser: (user: { name: string; email: string; avatar?: string } | null) => void;
  
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Mock Authentication and Onboarding
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;

  // Candidate causes feedback loop (shared state)
  feedbackState: Record<string, boolean | null>;
  setFeedback: (incidentId: string, deployId: string, value: boolean | null) => void;

  // Watched services settings
  watchedServices: string[];
  setWatchedServices: (services: string[]) => void;
  
  // Dashboard density settings
  density: 'comfortable' | 'compact';
  setDensity: (density: 'comfortable' | 'compact') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => [
    {
      id: 'notif-1',
      title: 'New Incident: Payment Processing Slowdown',
      description: 'Active investigating incident detected on watched service: Payment Service.',
      type: 'error',
      timestamp: '12m ago',
      read: false,
      link: '/incidents/inc-1',
    },
    {
      id: 'notif-2',
      title: 'Cause Candidate Awaiting Review',
      description: 'GitHub deployment dep-2024-003 is flagged as a 91% match for incident inc-2.',
      type: 'warning',
      timestamp: '45m ago',
      read: false,
      link: '/incidents/inc-2',
    },
    {
      id: 'notif-3',
      title: 'High-Risk Deploy: User Service v3.2.1',
      description: 'Deployment dep-2024-003 has a calculated risk score of 91.',
      type: 'warning',
      timestamp: '2h ago',
      read: true,
      link: '/recent-changes',
    },
    {
      id: 'notif-4',
      title: 'Database connection stabilized',
      description: 'Telemetry indicates database connection pool exhaustion has resolved.',
      type: 'success',
      timestamp: '4h ago',
      read: true,
      link: '/dashboard',
    },
    {
      id: 'notif-5',
      title: 'New incident: Auth Token Failures',
      description: 'Active critical failures detected on watched service: Auth Service.',
      type: 'error',
      timestamp: '1d ago',
      read: true,
      link: '/incidents/inc-2',
    }
  ]);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar?: string } | null>(
    { name: 'John Doe', email: 'john.doe@nexops.internal', avatar: '' }
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock Authentication & Onboarding state
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  // Shared Cause Feedback State initialized from mockIncidents dataset
  const [feedbackState, setFeedbackState] = useState<Record<string, boolean | null>>(() => {
    const initial: Record<string, boolean | null> = {};
    mockIncidents.forEach((inc) => {
      inc.candidateCauses.forEach((c) => {
        initial[`${inc.id}::${c.deployId}`] = c.confirmed;
      });
    });
    return initial;
  });

  const setFeedback = useCallback((incidentId: string, deployId: string, value: boolean | null) => {
    setFeedbackState((prev) => ({
      ...prev,
      [`${incidentId}::${deployId}`]: value,
    }));
  }, []);

  // Preferences & Settings State
  const [watchedServices, setWatchedServices] = useState<string[]>(['payment-service', 'auth-service']);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    if (notification.type === 'info') {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, 5000);
    }
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const value: AppContextType = {
    commandPaletteOpen,
    setCommandPaletteOpen,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications,
    getUnreadCount,
    currentUser,
    setCurrentUser,
    sidebarOpen,
    setSidebarOpen,
    isAuthenticated,
    setAuthenticated,
    onboardingComplete,
    setOnboardingComplete,
    feedbackState,
    setFeedback,
    watchedServices,
    setWatchedServices,
    density,
    setDensity,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
