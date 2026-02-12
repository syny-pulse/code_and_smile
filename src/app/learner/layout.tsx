import React from 'react';
import LearnerSidebar from '@/components/ui/navigation/LearnerSidebar';

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <LearnerSidebar />
            <main className="flex-grow ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
