'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDashboardStore } from '@/stores/dashboard-store';
import { ThroughputChart } from '@/components/charts/throughput-chart';
import { MetricCard } from '@/components/charts/metric-card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Calendar as CalendarIcon,
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const { topics, currentMetrics } = useDashboardStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('throughput');
  const [date, setDate] = useState<Date>();

  // Generate analytics data
  const topicPerformanceData = topics.slice(0, 10).map(topic => ({
    name: topic.name.length > 15 ? topic.name.substring(0, 15) + '...' : topic.name,
    messages: topic.messageRate,
    bytes: topic.bytesPerSec / 1024 / 1024,
    consumers: topic.consumerGroups.length
  }));

  const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    throughput: Math.floor(Math.random() * 10000) + 5000,
    latency: Math.floor(Math.random() * 50) + 10,
    errors: Math.floor(Math.random() * 100)
  }));

  const partitionDistribution = [
    { name: 'Low Load', value: 35, color: '#10b981' },
    { name: 'Medium Load', value: 45, color: '#f59e0b' },
    { name: 'High Load', value: 20, color: '#ef4444' }
  ];

  const consumerGroupData = topics.slice(0, 8).map(topic => ({
    topic: topic.name.substring(0, 12),
    active: topic.consumerGroups.filter(g => g.status === 'active').length,
    rebalancing: topic.consumerGroups.filter(g => g.status === 'rebalancing').length,
    inactive: topic.consumerGroups.filter(g => g.status === 'inactive').length
  }));

  const performanceMetrics = [
    {
      title: 'Peak Throughput',
      value: '125.4K',
      change: 12.5,
      trend: 'up' as const,
      period: 'Last 24h'
    },
    {
      title: 'Avg Latency',
      value: '23ms',
      change: -8.2,
      trend: 'down' as const,
      period: 'Last 24h'
    },
    {
      title: 'Error Rate',
      value: '0.02%',
      change: -15.3,
      trend: 'down' as const,
      period: 'Last 24h'
    },
    {
      title: 'Data Processed',
      value: '2.8TB',
      change: 18.7,
      trend: 'up' as const,
      period: 'Last 24h'
    }
  ];

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
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Deep dive into your streaming platform performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Time Range:</span>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Metric:</span>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="throughput">Throughput</SelectItem>
              <SelectItem value="latency">Latency</SelectItem>
              <SelectItem value="errors">Error Rate</SelectItem>
              <SelectItem value="consumers">Consumers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-1 text-xs">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={cn(
                    'font-medium',
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-muted-foreground">{metric.period}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Topic Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Topic Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topicPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs fill-muted-foreground"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="messages" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Partition Load Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5" />
              <span>Partition Load Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={partitionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {partitionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {partitionDistribution.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="hour" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Area
                type="monotone"
                dataKey="throughput"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Consumer Group Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Consumer Group Status by Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consumerGroupData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="topic" 
                className="text-xs fill-muted-foreground"
              />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="active" stackId="a" fill="#10b981" />
              <Bar dataKey="rebalancing" stackId="a" fill="#f59e0b" />
              <Bar dataKey="inactive" stackId="a" fill="#6b7280" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm">Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-sm">Rebalancing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-gray-500" />
              <span className="text-sm">Inactive</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className="text-sm font-medium">Optimal Performance</p>
                <p className="text-xs text-muted-foreground">
                  Your cluster is operating within optimal parameters with 99.98% uptime.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
              <div>
                <p className="text-sm font-medium">Consumer Lag Detected</p>
                <p className="text-xs text-muted-foreground">
                  Topic 'user-events' shows increasing consumer lag during peak hours.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="text-sm font-medium">Scaling Opportunity</p>
                <p className="text-xs text-muted-foreground">
                  Consider adding partitions to high-traffic topics for better parallelism.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity Planning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Utilization</span>
                <span>68%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network Bandwidth</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>72%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Based on current growth trends, consider scaling in the next 30 days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}