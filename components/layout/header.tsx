'use client';

import { Bell, Menu, Search, Settings, Globe, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDashboardStore } from '@/stores/dashboard-store';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export function Header() {
  const { toggleSidebar, alerts, isRealTimeEnabled, toggleRealTime } = useDashboardStore();
  const unreadAlerts = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden hover:bg-accent"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <Search className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 sm:pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring text-sm"
            />
          </div>
        </div>

        {/* Center section - Real-time status (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-3 mx-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted/50">
            <motion.div
              className={`h-2 w-2 rounded-full ${
                isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'
              }`}
              animate={isRealTimeEnabled ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRealTime}
              className="text-xs h-auto p-0 hover:bg-transparent"
            >
              {isRealTimeEnabled ? 'Live' : 'Paused'}
            </Button>
          </div>
          
          <Badge variant="outline" className="text-xs px-2 py-1 hidden lg:flex">
            <Globe className="mr-1 h-3 w-3" />
            4 Regions
          </Badge>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {/* Mobile real-time indicator */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRealTime}
              className="p-2"
            >
              <motion.div
                className={`h-2 w-2 rounded-full ${
                  isRealTimeEnabled ? 'bg-green-500' : 'bg-gray-400'
                }`}
                animate={isRealTimeEnabled ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </Button>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-accent p-2">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {unreadAlerts > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-red-500 flex items-center justify-center"
                  >
                    <span className="text-xs text-white font-medium">
                      {unreadAlerts > 9 ? '9+' : unreadAlerts}
                    </span>
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm sm:text-base">Notifications</h4>
                  <Badge variant="secondary" className="text-xs">
                    {unreadAlerts} new
                  </Badge>
                </div>
              </div>
              <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                {alerts.slice(0, 5).map((alert) => (
                  <DropdownMenuItem key={alert.id} className="flex-col items-start p-3 sm:p-4 cursor-pointer">
                    <div className="flex w-full items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-medium truncate">{alert.title}</span>
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'destructive'
                            : alert.severity === 'warning'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-xs ml-2"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{alert.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{format(alert.timestamp, 'MMM dd, HH:mm')}</span>
                      <span>•</span>
                      <span className="truncate">{alert.source}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="ghost" className="w-full text-sm">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings - Hidden on mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-accent p-2 hidden sm:flex">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Zap className="mr-2 h-4 w-4" />
                API Keys
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem>
                Support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-accent p-1 sm:p-2">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">AD</span>
                </div>
                <ChevronDown className="h-3 w-3 ml-1 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@nexus.io</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem className="sm:hidden">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}