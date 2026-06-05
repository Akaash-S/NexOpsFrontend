'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
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
  clearNotifications: () => void;
  getUnreadCount: () => number;
  
  // User state
  currentUser: { name: string; email: string; avatar?: string } | null;
  setCurrentUser: (user: { name: string; email: string; avatar?: string } | null) => void;
  
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Modals/Drawers
  isAddClusterOpen: boolean;
  setAddClusterOpen: (open: boolean) => void;
  isRegisterServiceOpen: boolean;
  setRegisterServiceOpen: (open: boolean) => void;
  isConnectRepoOpen: boolean;
  setConnectRepoOpen: (open: boolean) => void;
  isConnectPipelineOpen: boolean;
  setConnectPipelineOpen: (open: boolean) => void;
  isCreateDeploymentOpen: boolean;
  setCreateDeploymentOpen: (open: boolean) => void;
  isCreateReleaseOpen: boolean;
  setCreateReleaseOpen: (open: boolean) => void;
  isCreateAlertRuleOpen: boolean;
  setCreateAlertRuleOpen: (open: boolean) => void;
  isDeclareIncidentOpen: boolean;
  setDeclareIncidentOpen: (open: boolean) => void;
  isConfigureSloOpen: boolean;
  setConfigureSloOpen: (open: boolean) => void;
  isRunSimulationOpen: boolean;
  setRunSimulationOpen: (open: boolean) => void;
  isRunRiskAssessmentOpen: boolean;
  setRunRiskAssessmentOpen: (open: boolean) => void;
  isImplementRecOpen: boolean;
  setImplementRecOpen: (open: boolean, recId?: string) => void;
  selectedRecToImplement: string | null;
  isCreateRuleOpen: boolean;
  setCreateRuleOpen: (open: boolean) => void;
  isCreateWorkflowOpen: boolean;
  setCreateWorkflowOpen: (open: boolean) => void;
  isCreateTeamOpen: boolean;
  setCreateTeamOpen: (open: boolean) => void;
  isConnectIntegrationOpen: boolean;
  setConnectIntegrationOpen: (open: boolean) => void;
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
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar?: string } | null>(
    { name: 'John Doe', email: 'john@example.com' }
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAddClusterOpen, setAddClusterOpen] = useState(false);
  const [isRegisterServiceOpen, setRegisterServiceOpen] = useState(false);
  const [isConnectRepoOpen, setConnectRepoOpen] = useState(false);
  const [isConnectPipelineOpen, setConnectPipelineOpen] = useState(false);
  const [isCreateDeploymentOpen, setCreateDeploymentOpen] = useState(false);
  const [isCreateReleaseOpen, setCreateReleaseOpen] = useState(false);
  const [isCreateAlertRuleOpen, setCreateAlertRuleOpen] = useState(false);
  const [isDeclareIncidentOpen, setDeclareIncidentOpen] = useState(false);
  const [isConfigureSloOpen, setConfigureSloOpen] = useState(false);
  const [isRunSimulationOpen, setRunSimulationOpen] = useState(false);
  const [isRunRiskAssessmentOpen, setRunRiskAssessmentOpen] = useState(false);
  const [isImplementRecOpen, setIsImplementRecOpen] = useState(false);
  const [selectedRecToImplement, setSelectedRecToImplement] = useState<string | null>(null);
  const [isCreateRuleOpen, setCreateRuleOpen] = useState(false);
  const [isCreateWorkflowOpen, setCreateWorkflowOpen] = useState(false);
  const [isCreateTeamOpen, setCreateTeamOpen] = useState(false);
  const [isConnectIntegrationOpen, setConnectIntegrationOpen] = useState(false);

  const setImplementRecOpen = useCallback((open: boolean, recId?: string) => {
    setIsImplementRecOpen(open);
    if (open && recId) {
      setSelectedRecToImplement(recId);
    } else if (!open) {
      // Don't immediately clear the ID so the exit animation has context
    }
  }, []);

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
    clearNotifications,
    getUnreadCount,
    currentUser,
    setCurrentUser,
    sidebarOpen,
    setSidebarOpen,
    isAddClusterOpen,
    setAddClusterOpen,
    isRegisterServiceOpen,
    setRegisterServiceOpen,
    isConnectRepoOpen,
    setConnectRepoOpen,
    isConnectPipelineOpen,
    setConnectPipelineOpen,
    isCreateDeploymentOpen,
    setCreateDeploymentOpen,
    isCreateReleaseOpen,
    setCreateReleaseOpen,
    isCreateAlertRuleOpen,
    setCreateAlertRuleOpen,
    isDeclareIncidentOpen,
    setDeclareIncidentOpen,
    isConfigureSloOpen,
    setConfigureSloOpen,
    isRunSimulationOpen,
    setRunSimulationOpen,
    isRunRiskAssessmentOpen,
    setRunRiskAssessmentOpen,
    isImplementRecOpen,
    setImplementRecOpen,
    selectedRecToImplement,
    isCreateRuleOpen,
    setCreateRuleOpen,
    isCreateWorkflowOpen,
    setCreateWorkflowOpen,
    isCreateTeamOpen,
    setCreateTeamOpen,
    isConnectIntegrationOpen,
    setConnectIntegrationOpen,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
