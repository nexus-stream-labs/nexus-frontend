'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/stores/dashboard-store';
import {
  BarChart3,
  Database,
  Shield,
  Activity,
  Settings,
  Users,
  TrendingUp,
  Server,
  Menu,
  Zap,
  Bell,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: BarChart3,
    description: 'System overview & metrics',
    badge: null
  },
  {
    name: 'Topics',
    href: '/dashboard/topics',
    icon: Database,
    description: 'Manage streaming topics',
    badge: null
  },
  {
    name: 'Monitoring',
    href: '/dashboard/monitoring',
    icon: Activity,
    description: 'Real-time monitoring',
    badge: 'Live'
  },
  {
    name: 'Cluster',
    href: '/dashboard/cluster',
    icon: Server,
    description: 'Node management',
    badge: null
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
    description: 'Insights & reports',
    badge: null
  },
  {
    name: 'Security',
    href: '/dashboard/security',
    icon: Shield,
    description: 'Access control & audit',
    badge: null
  }
];

const bottomNavigation = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'System configuration'
  },
  {
    name: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle,
    description: 'Documentation & support'
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, alerts } = useDashboardStore();
  const unreadAlerts = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform bg-card/95 backdrop-blur-xl border-r border-border/50 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 border-b border-border/50">
            <motion.div 
              className="flex items-center space-x-2 sm:space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
                <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Nexus
                </span>
                <div className="text-xs text-muted-foreground hidden sm:block">Event Streaming</div>
              </div>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden p-1 sm:p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
            <nav className="space-y-2">
              <div className="px-2 sm:px-3 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                  Main Navigation
                </h2>
                <div className="space-y-1">
                  {navigation.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => {
                            // Close sidebar on mobile after navigation
                            if (window.innerWidth < 1024) {
                              toggleSidebar();
                            }
                          }}
                          className={cn(
                            "group flex items-center rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                            isActive
                              ? "bg-accent text-accent-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-colors",
                              isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{item.name}</span>
                              <div className="flex items-center space-x-1 ml-2">
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                                {item.name === 'Security' && unreadAlerts > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {unreadAlerts}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="px-2 sm:px-3 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                  System
                </h2>
                <div className="space-y-1">
                  {bottomNavigation.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navigation.length + index) * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => {
                            // Close sidebar on mobile after navigation
                            if (window.innerWidth < 1024) {
                              toggleSidebar();
                            }
                          }}
                          className={cn(
                            "group flex items-center rounded-lg sm:rounded-xl px-2 sm:px-3 py-2 sm:py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                            isActive
                              ? "bg-accent text-accent-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-colors",
                              isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </nav>
          </ScrollArea>

          {/* User Profile Section */}
          <div className="border-t border-border/50 p-3 sm:p-4">
            <motion.div 
              className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-accent transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-medium text-white">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@nexus.io
                </p>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}