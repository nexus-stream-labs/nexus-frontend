'use client';

import { MetricCard } from '@/components/charts/metric-card';
import { ThroughputChart } from '@/components/charts/throughput-chart';
import { ClusterHealth } from '@/components/dashboard/cluster-health';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Database, 
  Users, 
  AlertTriangle,
  TrendingUp,
  Zap,
  Server,
  Shield,
  Clock,
  BarChart3,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { currentMetrics, alerts, topics } = useDashboardStore();
  const { nodes, metricsHistory, isLoading } = useDashboardData();

  const activeTopics = topics?.filter(topic => topic.messageRate > 0).length || 0;
  const totalPartitions = topics?.reduce((sum, topic) => sum + topic.partitions, 0) || 0;
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged).length;

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
            Monitor your distributed streaming platform in real-time
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
            <Clock className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Last updated: {format(new Date(), 'HH:mm:ss')}
          </Badge>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Messages/sec"
          value={currentMetrics.messagesPerSecond || 0}
          change={5.2}
          trend="up"
          icon={<Zap className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
        <MetricCard
          title="Data Throughput"
          value={currentMetrics.bytesPerSecond || 0}
          change={-2.1}
          trend="down"
          format="bytes"
          icon={<Activity className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
        <MetricCard
          title="Active Topics"
          value={activeTopics}
          change={0}
          trend="stable"
          icon={<Database className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
        <MetricCard
          title="Total Partitions"
          value={totalPartitions}
          change={8.3}
          trend="up"
          icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />}
        />
      </div>

      {/* Cluster Health Section */}
      {nodes && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <ClusterHealth nodes={nodes} />
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 xl:grid-cols-3">
        {/* Throughput Chart - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {metricsHistory && (
              <ThroughputChart 
                data={metricsHistory.slice(-24)} 
                title="Real-time Performance Metrics"
                height={350}
              />
            )}
          </motion.div>
        </div>

        {/* Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="xl:col-span-1"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold flex items-center">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-500" />
                <span className="hidden sm:inline">System Alerts</span>
                <span className="sm:hidden">Alerts</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                {unacknowledgedAlerts > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unacknowledgedAlerts} new
                  </Badge>
                )}
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] sm:h-[350px] px-4 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {alerts.slice(0, 8).map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 sm:p-4 rounded-lg border transition-all hover:shadow-md ${
                        alert.acknowledged ? 'bg-muted/30 border-muted' : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <Badge
                              variant={
                                alert.severity === 'critical'
                                  ? 'destructive'
                                  : alert.severity === 'warning'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="text-xs w-fit"
                            >
                              {alert.severity}
                            </Badge>
                            <span className="text-sm font-medium truncate">{alert.title}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {alert.message}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                            <span>{format(alert.timestamp, 'MMM dd, HH:mm')}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate">{alert.source}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
              Consumer Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Active</span>
              <span className="text-sm sm:text-base font-semibold text-green-600">
                {topics?.reduce((sum, topic) => 
                  sum + topic.consumerGroups.filter(g => g.status === 'active').length, 0
                ) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Rebalancing</span>
              <span className="text-sm sm:text-base font-semibold text-amber-600">
                {topics?.reduce((sum, topic) => 
                  sum + topic.consumerGroups.filter(g => g.status === 'rebalancing').length, 0
                ) || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Inactive</span>
              <span className="text-sm sm:text-base font-semibold text-gray-500">
                {topics?.reduce((sum, topic) => 
                  sum + topic.consumerGroups.filter(g => g.status === 'inactive').length, 0
                ) || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Avg Latency</span>
              <span className="text-sm sm:text-base font-semibold">
                {currentMetrics.latency?.toFixed(0) || 0}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Error Rate</span>
              <span className="text-sm sm:text-base font-semibold text-red-600">
                {((currentMetrics.errorRate || 0) * 100).toFixed(3)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Uptime</span>
              <span className="text-sm sm:text-base font-semibold text-green-600">99.98%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center">
              <Server className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-500" />
              Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Healthy Nodes</span>
              <span className="text-sm sm:text-base font-semibold text-green-600">
                {nodes?.filter(n => n.status === 'healthy').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Total Nodes</span>
              <span className="text-sm sm:text-base font-semibold">
                {nodes?.length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Regions</span>
              <span className="text-sm sm:text-base font-semibold">4</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base flex items-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Active Sessions</span>
              <span className="text-sm sm:text-base font-semibold">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Failed Logins</span>
              <span className="text-sm sm:text-base font-semibold text-red-600">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Compliance</span>
              <span className="text-sm sm:text-base font-semibold text-green-600">SOC2</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2">
                <Database className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm">Create Topic</span>
              </Button>
              <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm">Add Consumer</span>
              </Button>
              <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm">Configure Cluster</span>
              </Button>
              <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-xs sm:text-sm">View Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}