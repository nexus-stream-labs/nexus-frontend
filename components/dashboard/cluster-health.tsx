'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ClusterNode } from '@/lib/types';
import { Server, Cpu, HardDrive, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClusterHealthProps {
  nodes: ClusterNode[];
}

export function ClusterHealth({ nodes }: ClusterHealthProps) {
  const healthyNodes = nodes.filter(node => node.status === 'healthy').length;
  const warningNodes = nodes.filter(node => node.status === 'warning').length;
  const criticalNodes = nodes.filter(node => node.status === 'critical').length;
  
  const avgCpu = nodes.reduce((sum, node) => sum + node.cpu, 0) / nodes.length;
  const avgMemory = nodes.reduce((sum, node) => sum + node.memory, 0) / nodes.length;
  const avgDisk = nodes.reduce((sum, node) => sum + node.disk, 0) / nodes.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Cluster Overview */}
      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
            <Server className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Cluster Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Nodes</span>
              <span className="text-xl sm:text-2xl font-bold">{nodes.length}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600">{healthyNodes}</div>
                <div className="text-xs text-muted-foreground">Healthy</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-yellow-600">{warningNodes}</div>
                <div className="text-xs text-muted-foreground">Warning</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-red-600">{criticalNodes}</div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </div>
            </div>

            {/* Node grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 mt-4">
              {nodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`h-3 w-3 sm:h-4 sm:w-4 rounded-sm ${getStatusColor(node.status)} relative group cursor-pointer`}
                  title={`${node.hostname} - ${node.status}`}
                >
                  {node.isLeader && (
                    <div className="absolute -top-1 -right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-500 rounded-full" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Utilization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center space-x-2">
            <Cpu className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>CPU Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm">Average</span>
              <span className="text-xs sm:text-sm font-medium">{avgCpu.toFixed(1)}%</span>
            </div>
            <Progress value={avgCpu} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center space-x-2">
            <HardDrive className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Memory</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm">Average</span>
              <span className="text-xs sm:text-sm font-medium">{avgMemory.toFixed(1)}%</span>
            </div>
            <Progress value={avgMemory} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}