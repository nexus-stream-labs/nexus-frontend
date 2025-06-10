'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/stores/dashboard-store';
import { generateRealtimeMetrics } from '@/lib/mock-data';

export const useRealTime = () => {
  const { isRealTimeEnabled, updateMetrics, addMetricsToHistory } = useDashboardStore();

  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      const newMetrics = generateRealtimeMetrics();
      updateMetrics(newMetrics);
      
      // Add complete metrics to history every 30 seconds
      if (Date.now() % 30000 < 3000) {
        addMetricsToHistory({
          timestamp: new Date(),
          messagesPerSecond: newMetrics.messagesPerSecond || 0,
          bytesPerSecond: newMetrics.bytesPerSecond || 0,
          partitionLag: {},
          errorRate: newMetrics.errorRate || 0,
          throughput: newMetrics.throughput || 0,
          latency: newMetrics.latency || 0
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, updateMetrics, addMetricsToHistory]);
};