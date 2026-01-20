import React from 'react';
import AdminSidebar from '@/components/ui/navigation/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <AdminSidebar />
      <main className="flex-grow ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
