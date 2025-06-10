'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { TableSkeleton } from '@/components/ui/loading-skeleton';
import { 
  Search, 
  MoreHorizontal, 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi,
  Crown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Power,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function ClusterPage() {
  const { nodes } = useDashboardStore();
  const { isLoading } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || node.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const healthyNodes = nodes.filter(node => node.status === 'healthy').length;
  const warningNodes = nodes.filter(node => node.status === 'warning').length;
  const criticalNodes = nodes.filter(node => node.status === 'critical').length;
  const leaderNode = nodes.find(node => node.isLeader);

  if (isLoading) {
    return <TableSkeleton />;
  }

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
          <h1 className="text-3xl font-bold">Cluster Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage your distributed cluster nodes
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Cluster Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyNodes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningNodes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalNodes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leader</CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">
              {leaderNode?.hostname || 'None'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Node Management */}
      <Card>
        <CardHeader>
          <CardTitle>Cluster Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Status: {selectedStatus === 'all' ? 'All' : selectedStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus('all')}>
                  All Nodes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('healthy')}>
                  Healthy Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('warning')}>
                  Warning Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('critical')}>
                  Critical Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Nodes Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Node</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead>Disk</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNodes.map((node, index) => (
                  <motion.tr
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(node.status)}
                        <div>
                          <div className="font-medium">{node.hostname}</div>
                          <div className="text-xs text-muted-foreground">{node.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(node.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {node.isLeader && <Crown className="h-3 w-3 text-yellow-500" />}
                        <span>{node.isLeader ? 'Leader' : 'Follower'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{node.cpu.toFixed(1)}%</span>
                        </div>
                        <Progress value={node.cpu} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{node.memory.toFixed(1)}%</span>
                        </div>
                        <Progress value={node.memory} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{node.disk.toFixed(1)}%</span>
                        </div>
                        <Progress value={node.disk} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{node.region}</div>
                        <div className="text-xs text-muted-foreground">{node.zone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatUptime(node.uptime)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(node.lastSeen, 'MMM dd, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Logs</DropdownMenuItem>
                          <DropdownMenuItem>Configure</DropdownMenuItem>
                          <DropdownMenuItem>Restart</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Remove Node
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Resource Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cpu className="h-5 w-5" />
              <span>CPU Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nodes.slice(0, 5).map((node) => (
                <div key={node.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{node.hostname}</span>
                    <span>{node.cpu.toFixed(1)}%</span>
                  </div>
                  <Progress value={node.cpu} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <span>Memory Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nodes.slice(0, 5).map((node) => (
                <div key={node.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{node.hostname}</span>
                    <span>{node.memory.toFixed(1)}%</span>
                  </div>
                  <Progress value={node.memory} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>Network I/O</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nodes.slice(0, 5).map((node) => (
                <div key={node.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{node.hostname}</span>
                    <span>{node.network.toFixed(1)}%</span>
                  </div>
                  <Progress value={node.network} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}