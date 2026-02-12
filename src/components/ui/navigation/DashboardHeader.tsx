'use client';

import React from 'react';
import { Menu } from 'lucide-react';

interface DashboardHeaderProps {
    onMenuClick: () => void;
    title: string;
    role: string;
}

export default function DashboardHeader({ onMenuClick, title, role }: DashboardHeaderProps) {
    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-30 transition-colors duration-300">
            <div className="flex items-center space-x-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                    aria-label="Toggle Menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                        {title}
                    </h1>
                    <p className="text-[10px] font-medium text-[#267fc3] dark:text-[#4a9fe3] uppercase tracking-wider">
                        {role}
                    </p>
                </div>
            </div>

            {/* Logo/Icon on the right for mobile */}
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-[#267fc3] shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </header>
    );
}
