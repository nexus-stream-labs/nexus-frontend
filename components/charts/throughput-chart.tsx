'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StreamMetrics } from '@/lib/types';
import { format } from 'date-fns';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThroughputChartProps {
  data: StreamMetrics[];
  title?: string;
  height?: number;
}

export function ThroughputChart({ 
  data, 
  title = "Performance Metrics", 
  height = 350 
}: ThroughputChartProps) {
  const chartData = data.map(item => ({
    time: format(item.timestamp, 'HH:mm'),
    messages: item.messagesPerSecond,
    bytes: item.bytesPerSecond / 1024 / 1024, // Convert to MB/s
    latency: item.latency
  }));

  const avgMessages = chartData.reduce((sum, item) => sum + item.messages, 0) / chartData.length;
  const avgBytes = chartData.reduce((sum, item) => sum + item.bytes, 0) / chartData.length;
  const avgLatency = chartData.reduce((sum, item) => sum + item.latency, 0) / chartData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
        
        <CardHeader className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg sm:text-xl font-semibold flex items-center">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-500" />
                <span className="truncate">{title}</span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Real-time streaming performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <TrendingUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Metric Summary */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
              <div className="text-sm sm:text-lg font-bold">{avgMessages.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Avg Messages/sec</div>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
              <div className="text-sm sm:text-lg font-bold">{avgBytes.toFixed(1)} MB/s</div>
              <div className="text-xs text-muted-foreground">Avg Throughput</div>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
              <div className="text-sm sm:text-lg font-bold">{avgLatency.toFixed(0)}ms</div>
              <div className="text-xs text-muted-foreground">Avg Latency</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 p-4 sm:p-6">
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="messagesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="bytesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="time" 
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                yAxisId="left"
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px'
                }}
                formatter={(value: number, name: string) => [
                  name === 'messages' 
                    ? `${value.toLocaleString()} msg/s`
                    : `${value.toFixed(2)} MB/s`,
                  name === 'messages' ? 'Messages' : 'Data Throughput'
                ]}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="messages"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#messagesGradient)"
                dot={false}
                activeDot={{ r: 4, stroke: 'hsl(var(--chart-1))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="bytes"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                fill="url(#bytesGradient)"
                dot={false}
                activeDot={{ r: 4, stroke: 'hsl(var(--chart-2))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}