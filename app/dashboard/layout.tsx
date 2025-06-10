'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useDashboardStore } from '@/stores/dashboard-store';
import { useRealTime } from '@/hooks/use-real-time';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useDashboardStore();
  
  // Initialize real-time updates and data loading
  useRealTime();
  useDashboardData();

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar />
      
      <motion.div 
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-72" : "ml-0"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-none">
            {children}
          </div>
        </main>
      </motion.div>
    </div>
  );
}