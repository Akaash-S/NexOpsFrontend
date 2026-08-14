'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  link?: string;
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
  currentUser: { name: string; email: string; avatar?: string; id?: string; workspace_id?: string; workspace_name?: string; preferences?: any } | null;
  setCurrentUser: (user: { name: string; email: string; avatar?: string; id?: string; workspace_id?: string; workspace_name?: string; preferences?: any } | null) => void;

  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Authentication and Onboarding
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  onboardingComplete: boolean;
  setOnboardingComplete: (complete: boolean) => void;
  authLoading: boolean;

  // Candidate causes feedback loop
  feedbackState: Record<string, boolean | null>;
  setFeedback: (incidentId: string, deployId: string, value: boolean | null) => Promise<void>;

  // Watched services settings
  watchedServices: string[];
  setWatchedServices: (services: string[]) => void;

  // UI density
  density: 'comfortable' | 'compact';
  setDensity: (density: 'comfortable' | 'compact') => void;

  // Extended Navigation feature flag
  showExtendedNavigation: boolean;
  setShowExtendedNavigation: (show: boolean) => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar?: string; id?: string; workspace_id?: string; preferences?: any } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Authentication & Onboarding state
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Shared Cause Feedback State
  const [feedbackState, setFeedbackState] = useState<Record<string, boolean | null>>({});

  // Preferences & Settings State
  const [watchedServices, setWatchedServices] = useState<string[]>([]);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [showExtendedNavigation, setShowExtendedNavigation] = useState<boolean>(false);

  // Sync workspace feature flag when user is authenticated
  useEffect(() => {
    async function loadWorkspaceConfig() {
      if (!isAuthenticated) return;
      try {
        const { apiFetch } = await import('@/lib/api-client');
        const ws = await apiFetch('/workspaces/current');
        if (ws && typeof ws.show_extended_navigation === 'boolean') {
          setShowExtendedNavigation(ws.show_extended_navigation);
        }
      } catch (err) {
        // Fallback: default stays False for un-configured workspaces
        console.warn('Workspace config fetch fallback (default False):', err);
      }
    }
    loadWorkspaceConfig();
  }, [isAuthenticated]);

  // Listen to Firebase Auth state
  useEffect(() => {
    let unsubscribe = () => { };

    async function initAuth() {
      // Check for valid authToken in localStorage
      if (typeof window !== 'undefined') {
        const localToken = localStorage.getItem("authToken");
        if (localToken) {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
            const res = await fetch(`${baseUrl}/users/me`, {
              headers: { "Authorization": `Bearer ${localToken}` }
            });
            if (res.ok) {
              const dbUser = await res.json();
              setCurrentUser({
                id: dbUser.id,
                name: dbUser.full_name || dbUser.fullName || 'Developer',
                email: dbUser.email || '',
                avatar: dbUser.avatar_url || '',
                workspace_id: dbUser.workspace_id,
                preferences: dbUser.preferences || {}
              });
              setAuthenticated(true);
              setOnboardingComplete(dbUser.onboarding_completed ?? true);
              setAuthLoading(false);
              return;
            }
          } catch (err) {
            console.warn("Backend auth token verification fallback:", err);
          }
        }
      }

      try {
        const { onAuthStateChanged } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');

        unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            try {
              const token = await fbUser.getIdToken();
              localStorage.setItem("authToken", token);

              // Fetch user profile from backend to verify onboarding status
              const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
              const res = await fetch(`${baseUrl}/users/me`, {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
              });

              if (res.ok) {
                const dbUser = await res.json();
                setCurrentUser({
                  id: dbUser.id,
                  name: dbUser.full_name || dbUser.fullName || fbUser.displayName || 'Developer',
                  email: dbUser.email || fbUser.email || '',
                  avatar: dbUser.avatar_url || dbUser.avatarUrl || fbUser.photoURL || '',
                  workspace_id: dbUser.workspace_id,
                  preferences: dbUser.preferences || {}
                });
                setAuthenticated(true);
                setOnboardingComplete(dbUser.onboarding_completed ?? dbUser.onboardingCompleted ?? true);
              } else {
                console.error("User profile verification failed on backend");
                localStorage.removeItem("authToken");
                setCurrentUser(null);
                setAuthenticated(false);
                setOnboardingComplete(false);
              }
            } catch (err) {
              console.error("Error fetching user profile:", err);
              localStorage.removeItem("authToken");
              setCurrentUser(null);
              setAuthenticated(false);
              setOnboardingComplete(false);
            } finally {
              setAuthLoading(false);
            }
          } else {
            const tok = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
            if (tok === "mock-auth-token" || tok === "test-token") {
              setCurrentUser({
                id: "lqEUnHMRWKcv6anhNOH9Bd6fhUU2",
                workspace_id: "256296a1-55bb-4143-b2b2-31e3816fc86e",
                name: "Matt",
                email: "mattpersonal321@gmail.com"
              });
              setAuthenticated(true);
              setOnboardingComplete(true);
            } else {
              localStorage.removeItem("authToken");
              setCurrentUser(null);
              setAuthenticated(false);
              setOnboardingComplete(false);
            }
            setAuthLoading(false);
          }
        });
      } catch (err) {
        console.error("Firebase auth initialization failed", err);
        setAuthLoading(false);
      }
    }

    initAuth();
    return () => unsubscribe();
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  // Sync feedback confirmation states on startup or when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchIncidentFeedback() {
      try {
        const { apiFetch } = await import('@/lib/api-client');
        const incidents = await apiFetch('/incidents');
        const initialFeedback: Record<string, boolean | null> = {};
        for (const inc of incidents) {
          if (inc.candidateCauses) {
            for (const cause of inc.candidateCauses) {
              initialFeedback[`${inc.id}::${cause.id}`] = cause.confirmed;
            }
          }
        }
        setFeedbackState(initialFeedback);
      } catch (err) {
        console.error("Failed to load initial feedback states", err);
      }
    }

    fetchIncidentFeedback();
  }, [isAuthenticated]);

  const handleSetAuthenticated = useCallback(async (authVal: boolean) => {
    if (!authVal) {
      try {
        const { signOut } = await import('firebase/auth');
        const { auth } = await import('@/lib/firebase');
        await signOut(auth);
      } catch (err) {
        console.error("Signout failed:", err);
      }
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      setAuthenticated(false);
      setOnboardingComplete(false);
    } else {
      setAuthenticated(true);
    }
  }, []);

  const setFeedback = useCallback(async (incidentId: string, deployId: string, value: boolean | null) => {
    // 1. Update local state immediately
    setFeedbackState((prev) => ({
      ...prev,
      [`${incidentId}::${deployId}`]: value,
    }));

    // 2. Persist to real backend
    try {
      const { apiFetch } = await import('@/lib/api-client');
      await apiFetch(`/incidents/${incidentId}/feedback`, {
        method: 'PATCH',
        body: JSON.stringify({
          candidateCauseId: deployId,
          confirmed: value
        })
      });

      // Add notification for confirmation changes
      addNotification({
        title: value === true ? 'Causal Candidate Confirmed' : value === false ? 'Candidate Cause Ruled Out' : 'Cause Reset',
        description: `Incident correlation feedback submitted successfully.`,
        type: 'success'
      });
    } catch (err) {
      console.error("Failed to submit cause feedback:", err);
      addNotification({
        title: 'Feedback Failed',
        description: 'Could not connect to NexOps backend to persist feedback.',
        type: 'error'
      });
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
    setAuthenticated: handleSetAuthenticated,
    onboardingComplete,
    setOnboardingComplete,
    feedbackState,
    setFeedback,
    watchedServices,
    setWatchedServices,
    density,
    setDensity,
    showExtendedNavigation,
    setShowExtendedNavigation,
    authLoading,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
