'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

// SVG Icons matching design system
const DashboardIcon = ({ className, color = "#267fc3" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none" />
    </svg>
);

const BookOpenIcon = ({ className, color = "#267fc3" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ClipboardIcon = ({ className, color = "#267fc3" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke={color} strokeWidth="2" fill="none" />
        <line x1="12" y1="11" x2="12" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="9" y1="14" x2="15" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const MessageIcon = ({ className, color = "#267fc3" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UserIcon = ({ className, color = "#267fc3" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LogOutIcon = ({ className, color = "#FF6F61" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16,17 21,12 16,7" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const GraduationIcon = ({ className, color = "#267fc3" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronLeftIcon = ({ className, color = "#6B7280" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="15,18 9,12 15,6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRightIcon = ({ className, color = "#6B7280" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="9,18 15,12 9,6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const navItems = [
    {
        label: 'My Dashboard',
        href: '/learner/dashboard',
        icon: DashboardIcon
    },
    {
        label: 'Lessons',
        href: '/learner/lessons',
        icon: BookOpenIcon
    },
    {
        label: 'Assignments',
        href: '/learner/assignments',
        icon: ClipboardIcon
    },
    {
        label: 'Feedback',
        href: '/learner/feedback',
        icon: MessageIcon
    },
    {
        label: 'My Account',
        href: '/learner/my-account',
        icon: UserIcon
    },
];

export default function LearnerSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/auth/signin' });
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-64'
                }`}>

                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        {!isCollapsed && (
                            <div className="flex items-center space-x-3">
                                <div
                                    className="h-8 w-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: '#267fc3' }}
                                >
                                    <GraduationIcon className="w-5 h-5" color="white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                                        CAS Academy
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Learner Portal
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={toggleCollapse}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? (
                                <ChevronRightIcon className="w-4 h-4" />
                            ) : (
                                <ChevronLeftIcon className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href || (href !== '/learner/dashboard' && pathname.startsWith(href));
                        return (
                            <div key={href} className="relative">
                                <Link
                                    href={href}
                                    className={`group flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-[#267fc3]/10 text-[#267fc3]'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    title={isCollapsed ? label : ''}
                                >
                                    <div className="relative flex-shrink-0">
                                        <Icon
                                            className="w-5 h-5"
                                            color={isActive ? '#267fc3' : '#6B7280'}
                                        />
                                    </div>

                                    {!isCollapsed && (
                                        <span className="ml-3 font-medium text-sm">
                                            {label}
                                        </span>
                                    )}

                                    {!isCollapsed && isActive && (
                                        <div
                                            className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0"
                                            style={{ backgroundColor: '#267fc3' }}
                                        />
                                    )}
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Section */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 group"
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <LogOutIcon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium text-sm">
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            {/* Backdrop for mobile */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleCollapse}
                />
            )}
        </>
    );
}
