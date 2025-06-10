import { ClusterNode, Topic, ConsumerGroup, StreamMetrics, Alert, SecurityEvent, User, ApiKey } from './types';
import { addDays, subDays, subHours, subMinutes } from 'date-fns';

// Generate realistic cluster nodes
export const generateClusterNodes = (): ClusterNode[] => {
  const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];
  const zones = ['a', 'b', 'c'];
  
  return Array.from({ length: 15 }, (_, i) => {
    const region = regions[i % regions.length];
    const zone = zones[i % zones.length];
    const isHealthy = Math.random() > 0.15;
    const isWarning = !isHealthy && Math.random() > 0.3;
    
    return {
      id: `node-${i + 1}`,
      hostname: `nexus-${region}-${zone}-${String(i + 1).padStart(3, '0')}`,
      status: isHealthy ? 'healthy' : isWarning ? 'warning' : 'critical',
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 100,
      isLeader: i === 0,
      lastSeen: subMinutes(new Date(), Math.random() * 60),
      region,
      zone: `${region}${zone}`,
      uptime: Math.random() * 365 * 24 * 60 * 60 * 1000,
      version: '2.8.1'
    };
  });
};

// Generate realistic topics
export const generateTopics = (): Topic[] => {
  const topicNames = [
    'user-events', 'payment-transactions', 'order-updates', 'inventory-changes',
    'user-sessions', 'email-notifications', 'audit-logs', 'metrics-data',
    'search-queries', 'cart-events', 'recommendation-events', 'fraud-detection',
    'customer-support', 'delivery-tracking', 'product-reviews', 'analytics-events',
    'marketing-campaigns', 'system-health', 'security-events', 'billing-events'
  ];

  return topicNames.map((name, i) => ({
    name,
    partitions: Math.floor(Math.random() * 32) + 1,
    replicationFactor: Math.floor(Math.random() * 3) + 1,
    messageRate: Math.random() * 10000,
    bytesPerSec: Math.random() * 1024 * 1024,
    consumerGroups: generateConsumerGroups(Math.floor(Math.random() * 5) + 1),
    retentionMs: (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000,
    size: `${(Math.random() * 100).toFixed(2)} GB`,
    compactionEnabled: Math.random() > 0.5,
    created: subDays(new Date(), Math.random() * 365),
    lastModified: subHours(new Date(), Math.random() * 24)
  }));
};

const generateConsumerGroups = (count: number): ConsumerGroup[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `consumer-group-${i + 1}`,
    members: Math.floor(Math.random() * 10) + 1,
    lag: Math.random() * 1000,
    status: Math.random() > 0.8 ? 'rebalancing' : Math.random() > 0.1 ? 'active' : 'inactive',
    coordinator: `node-${Math.floor(Math.random() * 15) + 1}`
  }));
};

// Generate time series metrics
export const generateMetricsTimeSeries = (hours: number = 24): StreamMetrics[] => {
  const metrics: StreamMetrics[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = subHours(now, i);
    const baseRate = 5000 + Math.sin(i / 4) * 2000; // Simulate daily patterns
    const noise = (Math.random() - 0.5) * 1000;
    
    metrics.push({
      timestamp,
      messagesPerSecond: Math.max(0, baseRate + noise),
      bytesPerSecond: Math.max(0, (baseRate + noise) * 256),
      partitionLag: {
        'partition-0': Math.random() * 100,
        'partition-1': Math.random() * 100,
        'partition-2': Math.random() * 100
      },
      errorRate: Math.random() * 0.01,
      throughput: Math.max(0, baseRate + noise),
      latency: Math.random() * 100 + 10
    });
  }
  
  return metrics;
};

// Generate alerts
export const generateAlerts = (): Alert[] => {
  const alertTypes = [
    { title: 'High Consumer Lag', message: 'Consumer group lag exceeds threshold', severity: 'warning' as const },
    { title: 'Node Offline', message: 'Cluster node became unresponsive', severity: 'critical' as const },
    { title: 'Disk Space Low', message: 'Disk usage above 85%', severity: 'warning' as const },
    { title: 'Replication Failed', message: 'Topic replication factor violated', severity: 'error' as const },
    { title: 'Authentication Failed', message: 'Multiple failed login attempts detected', severity: 'warning' as const },
    { title: 'Performance Degraded', message: 'Message processing latency increased', severity: 'info' as const }
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    return {
      id: `alert-${i + 1}`,
      ...alert,
      timestamp: subMinutes(new Date(), Math.random() * 1440), // Last 24 hours
      acknowledged: Math.random() > 0.7,
      source: `node-${Math.floor(Math.random() * 15) + 1}`
    };
  });
};

// Generate security events
export const generateSecurityEvents = (): SecurityEvent[] => {
  const actions = ['login', 'logout', 'topic-create', 'topic-delete', 'config-change', 'key-generate'];
  const users = ['admin@nexus.io', 'operator@nexus.io', 'viewer@nexus.io', 'external-api'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    id: `event-${i + 1}`,
    timestamp: subMinutes(new Date(), Math.random() * 10080), // Last week
    type: Math.random() > 0.5 ? 'authentication' : Math.random() > 0.5 ? 'authorization' : 'configuration',
    severity: Math.random() > 0.9 ? 'critical' : Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
    user: users[Math.floor(Math.random() * users.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    resource: `topic-${Math.floor(Math.random() * 20) + 1}`,
    ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    success: Math.random() > 0.1
  }));
};

// Generate users
export const generateUsers = (): User[] => {
  const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eve Brown'];
  const roles = ['admin', 'operator', 'viewer'] as const;
  
  return names.map((name, i) => ({
    id: `user-${i + 1}`,
    email: name.toLowerCase().replace(' ', '.') + '@nexus.io',
    name,
    role: roles[i % roles.length],
    lastLogin: subHours(new Date(), Math.random() * 168),
    active: Math.random() > 0.1,
    permissions: ['read', 'write', 'admin'].slice(0, Math.floor(Math.random() * 3) + 1)
  }));
};

// Generate API keys
export const generateApiKeys = (): ApiKey[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `key-${i + 1}`,
    name: `API Key ${i + 1}`,
    key: `nk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    permissions: ['read', 'write'].slice(0, Math.floor(Math.random() * 2) + 1),
    created: subDays(new Date(), Math.random() * 90),
    lastUsed: Math.random() > 0.3 ? subHours(new Date(), Math.random() * 24) : undefined,
    expiresAt: Math.random() > 0.5 ? addDays(new Date(), Math.random() * 365) : undefined
  }));
};

// Real-time data simulation
export const generateRealtimeMetrics = (): Partial<StreamMetrics> => {
  const baseRate = 5000 + Math.sin(Date.now() / 60000) * 2000;
  const noise = (Math.random() - 0.5) * 1000;
  
  return {
    timestamp: new Date(),
    messagesPerSecond: Math.max(0, baseRate + noise),
    bytesPerSecond: Math.max(0, (baseRate + noise) * 256),
    errorRate: Math.random() * 0.01,
    throughput: Math.max(0, baseRate + noise),
    latency: Math.random() * 100 + 10
  };
};