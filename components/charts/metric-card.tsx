'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'bytes' | 'percentage' | 'duration';
  icon?: React.ReactNode;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  trend = 'stable',
  format = 'number',
  icon,
  loading
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'bytes':
        return `${(val / 1024 / 1024).toFixed(2)} MB/s`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'duration':
        return `${val.toFixed(0)}ms`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="h-3 w-16 sm:h-4 sm:w-24 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-6 w-20 sm:h-8 sm:w-32 bg-muted animate-pulse rounded mb-2" />
          <div className="h-2 w-12 sm:h-3 sm:w-16 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 relative z-10">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <motion.div 
              className="text-muted-foreground group-hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {icon}
            </motion.div>
          )}
        </CardHeader>
        
        <CardContent className="relative z-10">
          <motion.div 
            className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          >
            {formatValue(value)}
          </motion.div>
          
          {change !== undefined && (
            <motion.div 
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getTrendIcon()}
              <span className={cn('font-medium', getTrendColor())}>
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              <span className="text-muted-foreground hidden sm:inline">vs last hour</span>
            </motion.div>
          )}
        </CardContent>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
             style={{ padding: '1px' }}>
          <div className="h-full w-full rounded-lg bg-card" />
        </div>
      </Card>
    </motion.div>
  );
}