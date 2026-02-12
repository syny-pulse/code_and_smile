import React from 'react';
import TutorSidebar from '@/components/ui/navigation/TutorSidebar';

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <TutorSidebar />
      <main className="flex-grow lg:ml-64 p-8 pt-16 lg:pt-8 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
