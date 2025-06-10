'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { ThroughputChart } from '@/components/charts/throughput-chart';
import { MetricCard } from '@/components/charts/metric-card';
import { CardSkeleton } from '@/components/ui/loading-skeleton';
import { 
  Activity, 
  Zap, 
  AlertTriangle, 
  Play, 
  Pause,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function MonitoringPage() {
  const { currentMetrics, topics, isRealTimeEnabled, toggleRealTime } = useDashboardStore();
  const { metricsHistory, isLoading } = useDashboardData();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const activeStreams = topics?.filter(topic => topic.messageRate > 0).length || 0;
  const totalThroughput = topics?.reduce((sum, topic) => sum + topic.messageRate, 0) || 0;
  const avgLatency = currentMetrics.latency || 0;
  const errorRate = (currentMetrics.errorRate || 0) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-time Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor stream processing and message flows in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isRealTimeEnabled ? "default" : "outline"}
            onClick={toggleRealTime}
            className="flex items-center space-x-2"
          >
            {isRealTimeEnabled ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Resume</span>
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className={`h-3 w-3 rounded-full ${
                  isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'
                }`}
                animate={isRealTimeEnabled ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <div>
                <p className="font-medium">
                  {isRealTimeEnabled ? 'Live Monitoring Active' : 'Monitoring Paused'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {format(new Date(), 'HH:mm:ss')}
                </p>
              </div>
            </div>
            <Badge variant={isRealTimeEnabled ? "default" : "secondary"}>
              {isRealTimeEnabled ? 'LIVE' : 'PAUSED'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Streams"
          value={activeStreams}
          change={2.1}
          trend="up"
          icon={<Activity className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Throughput"
          value={totalThroughput}
          change={-1.2}
          trend="down"
          format="number"
          icon={<Zap className="h-4 w-4" />}
        />
        <MetricCard
          title="Avg Latency"
          value={avgLatency}
          change={5.8}
          trend="up"
          format="duration"
          icon={<Activity className="h-4 w-4" />}
        />
        <MetricCard
          title="Error Rate"
          value={errorRate}
          change={-12.3}
          trend="down"
          format="percentage"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      {/* Main Monitoring Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Stream Flow Visualization */}
        <div className="lg:col-span-2">
          {metricsHistory && (
            <ThroughputChart 
              data={metricsHistory.slice(-24)} 
              title="Message Flow (Last 24 Hours)"
              height={400}
            />
          )}
        </div>

        {/* Active Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Topics</span>
              <Badge variant="outline">{activeStreams} active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px]">
              <div className="space-y-3">
                {topics?.filter(topic => topic.messageRate > 0).map((topic, index) => (
                  <motion.div
                    key={topic.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTopic === topic.name ? 'bg-accent' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedTopic(topic.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{topic.name}</span>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Rate</span>
                        <span className="font-medium">{topic.messageRate.toLocaleString()}/s</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Partitions</span>
                        <span className="font-medium">{topic.partitions}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Consumers</span>
                        <span className="font-medium">{topic.consumerGroups.length}</span>
                      </div>
                      <Progress 
                        value={(topic.messageRate / Math.max(...topics.map(t => t.messageRate))) * 100} 
                        className="h-1"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Stream Processing Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Stream Processing Pipeline</span>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Producers */}
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Producers</h3>
              <p className="text-2xl font-bold">{topics?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Active producers</p>
            </div>

            {/* Brokers */}
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-3 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Brokers</h3>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-muted-foreground">Healthy nodes</p>
            </div>

            {/* Consumers */}
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium mb-1">Consumers</h3>
              <p className="text-2xl font-bold">
                {topics?.reduce((sum, topic) => sum + topic.consumerGroups.length, 0) || 0}
              </p>
              <p className="text-xs text-muted-foreground">Consumer groups</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}