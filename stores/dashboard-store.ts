import { create } from 'zustand';
import { StreamMetrics, ClusterNode, Topic, Alert } from '@/lib/types';

interface DashboardState {
  // Real-time metrics
  currentMetrics: Partial<StreamMetrics>;
  metricsHistory: StreamMetrics[];
  
  // Cluster state
  nodes: ClusterNode[];
  topics: Topic[];
  alerts: Alert[];
  
  // UI state
  selectedTimeRange: string;
  isRealTimeEnabled: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  updateMetrics: (metrics: Partial<StreamMetrics>) => void;
  addMetricsToHistory: (metrics: StreamMetrics) => void;
  updateNodes: (nodes: ClusterNode[]) => void;
  updateTopics: (topics: Topic[]) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;
  setTimeRange: (range: string) => void;
  toggleRealTime: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  currentMetrics: {},
  metricsHistory: [],
  nodes: [],
  topics: [],
  alerts: [],
  selectedTimeRange: '24h',
  isRealTimeEnabled: true,
  sidebarOpen: true,
  theme: 'dark',
  
  // Actions
  updateMetrics: (metrics) =>
    set({ currentMetrics: { ...get().currentMetrics, ...metrics } }),
    
  addMetricsToHistory: (metrics) =>
    set((state) => ({
      metricsHistory: [...state.metricsHistory.slice(-100), metrics]
    })),
    
  updateNodes: (nodes) => set({ nodes }),
  updateTopics: (topics) => set({ topics }),
  
  addAlert: (alert) =>
    set((state) => ({ alerts: [alert, ...state.alerts] })),
    
  acknowledgeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    })),
    
  setTimeRange: (range) => set({ selectedTimeRange: range }),
  toggleRealTime: () => set((state) => ({ isRealTimeEnabled: !state.isRealTimeEnabled })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme })
}));