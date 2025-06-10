'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { TableSkeleton } from '@/components/ui/loading-skeleton';
import { Search, Plus, MoreHorizontal, Database, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function TopicsPage() {
  const { topics } = useDashboardStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && topic.messageRate > 0) ||
      (selectedStatus === 'inactive' && topic.messageRate === 0);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (messageRate: number) => {
    if (messageRate > 1000) return <Badge className="bg-green-100 text-green-800">High Traffic</Badge>;
    if (messageRate > 0) return <Badge variant="secondary">Active</Badge>;
    return <Badge variant="outline">Inactive</Badge>;
  };

  const formatBytes = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB/s`;
  };

  if (!topics.length) {
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
          <h1 className="text-3xl font-bold">Topics Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor your streaming topics
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Topic
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topics.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Topics</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topics.filter(t => t.messageRate > 0).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partitions</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topics.reduce((sum, topic) => sum + topic.partitions, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumer Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topics.reduce((sum, topic) => sum + topic.consumerGroups.length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
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
                  All Topics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('active')}>
                  Active Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('inactive')}>
                  Inactive Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Topics Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Partitions</TableHead>
                  <TableHead>Replication</TableHead>
                  <TableHead>Message Rate</TableHead>
                  <TableHead>Data Rate</TableHead>
                  <TableHead>Consumer Groups</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTopics.map((topic, index) => (
                  <motion.tr
                    key={topic.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{topic.name}</TableCell>
                    <TableCell>{getStatusBadge(topic.messageRate)}</TableCell>
                    <TableCell>{topic.partitions}</TableCell>
                    <TableCell>{topic.replicationFactor}</TableCell>
                    <TableCell>{topic.messageRate.toLocaleString()}/s</TableCell>
                    <TableCell>{formatBytes(topic.bytesPerSec)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span>{topic.consumerGroups.length}</span>
                        <div className="flex space-x-1">
                          {topic.consumerGroups.slice(0, 3).map((group, i) => (
                            <div
                              key={i}
                              className={`h-2 w-2 rounded-full ${
                                group.status === 'active' ? 'bg-green-500' :
                                group.status === 'rebalancing' ? 'bg-yellow-500' :
                                'bg-gray-400'
                              }`}
                              title={`${group.id} - ${group.status}`}
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(topic.lastModified, 'MMM dd, HH:mm')}
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
                          <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                          <DropdownMenuItem>View Messages</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete Topic
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
    </motion.div>
  );
}