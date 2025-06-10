'use client';

import { useQuery } from '@tanstack/react-query';
import { useDashboardStore } from '@/stores/dashboard-store';
import { 
  generateClusterNodes, 
  generateTopics, 
  generateAlerts, 
  generateMetricsTimeSeries 
} from '@/lib/mock-data';

export const useDashboardData = () => {
  const { updateNodes, updateTopics, alerts, addAlert } = useDashboardStore();

  const { data: nodes, isLoading: nodesLoading } = useQuery({
    queryKey: ['cluster-nodes'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const nodes = generateClusterNodes();
      updateNodes(nodes);
      return nodes;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: topics, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const topics = generateTopics();
      updateTopics(topics);
      return topics;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: metricsHistory, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics-history'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return generateMetricsTimeSeries(24);
    },
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Load initial alerts
  useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      if (alerts.length === 0) {
        const initialAlerts = generateAlerts();
        initialAlerts.forEach(addAlert);
        return initialAlerts;
      }
      return alerts;
    },
    enabled: alerts.length === 0,
  });

  return {
    nodes,
    topics,
    metricsHistory,
    isLoading: nodesLoading || topicsLoading || metricsLoading
  };
};