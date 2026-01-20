import React from 'react';
import Sidebar from '@/components/ui/navigation/Sidebar';

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main className="flex-grow ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
