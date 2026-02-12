'use client';

import AdminSidebar from '@/components/ui/navigation/AdminSidebar';
import DashboardHeader from '@/components/ui/navigation/DashboardHeader';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <DashboardHeader
        onMenuClick={() => setIsSidebarOpen(true)}
        title="CAS Academy"
        role="Admin Panel"
      />
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-grow lg:ml-64 ml-0 p-4 md:p-8 pt-20 lg:pt-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
