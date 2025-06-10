export interface ClusterNode {
  id: string;
  hostname: string;
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  isLeader: boolean;
  lastSeen: Date;
  region: string;
  zone: string;
  uptime: number;
  version: string;
}

export interface Topic {
  name: string;
  partitions: number;
  replicationFactor: number;
  messageRate: number;
  bytesPerSec: number;
  consumerGroups: ConsumerGroup[];
  retentionMs: number;
  size: string;
  compactionEnabled: boolean;
  created: Date;
  lastModified: Date;
}

export interface ConsumerGroup {
  id: string;
  members: number;
  lag: number;
  status: 'active' | 'inactive' | 'rebalancing';
  coordinator: string;
}

export interface StreamMetrics {
  timestamp: Date;
  messagesPerSecond: number;
  bytesPerSecond: number;
  partitionLag: Record<string, number>;
  errorRate: number;
  throughput: number;
  latency: number;
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'authentication' | 'authorization' | 'configuration' | 'access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user: string;
  action: string;
  resource: string;
  ip: string;
  success: boolean;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
  source: string;
}

export type MetricValue<T extends string> = {
  metric: T;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
};

export type DashboardWidget = 
  | { 
      id: string;
      type: 'chart'; 
      title: string;
      chartType: 'line' | 'bar' | 'area' | 'pie'; 
      data: any[];
      timeRange: string;
    }
  | { 
      id: string;
      type: 'metric'; 
      title: string;
      value: number; 
      label: string; 
      format: 'number' | 'bytes' | 'percentage' | 'duration';
      trend: 'up' | 'down' | 'stable';
    }
  | { 
      id: string;
      type: 'status'; 
      title: string;
      status: 'healthy' | 'warning' | 'critical'; 
      message: string;
      items: Array<{ label: string; value: string; status: string }>;
    };

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  lastLogin: Date;
  active: boolean;
  permissions: string[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created: Date;
  lastUsed?: Date;
  expiresAt?: Date;
}