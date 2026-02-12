'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'next-auth/react';

// SVG Icons matching your design system
const DashboardIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="2" fill="none" />
    </svg>
);

const BookIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth="2" fill="none" />
    </svg>
);

const UsersIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UserIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LogOutIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16,17 21,12 16,7" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const ComputerIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="12" rx="2" stroke={color} strokeWidth="2" fill="none" />
        <path d="M8 18h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const ChevronLeftIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="15,18 9,12 15,6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRightIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="9,18 15,12 9,6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ClipboardIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke={color} strokeWidth="2" fill="none" />
    </svg>
);

const InboxIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="22,12 16,12 14,15 10,15 8,12 2,12" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BriefcaseIcon = ({ className, color = "currentColor" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const navItems = [
    {
        label: 'Dashboard',
        href: '/tutor/dashboard',
        icon: DashboardIcon
    },
    {
        label: 'My Courses',
        href: '/tutor/my-courses',
        icon: BookIcon
    },
    {
        label: 'Lessons',
        href: '/tutor/lessons',
        icon: BookIcon
    },
    {
        label: 'Assignments',
        href: '/tutor/assignments',
        icon: ClipboardIcon
    },
    {
        label: 'Submissions',
        href: '/tutor/submissions',
        icon: InboxIcon
    },
    {
        label: 'My Learners',
        href: '/tutor/my-learners',
        icon: UsersIcon
    },
    {
        label: 'My Profile',
        href: '/tutor/my-profile',
        icon: UserIcon
    },
];

export default function TutorSidebar() {
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
                                    className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm"
                                    style={{ backgroundColor: '#267fc3' }}
                                >
                                    <ComputerIcon className="w-5 h-5" color="white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                                        CAS Academy
                                    </h1>
                                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tutor Portal
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={toggleCollapse}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
                        const isActive = pathname === href || pathname?.startsWith(`${href}/`);
                        return (
                            <div key={href} className="relative group">
                                <Link
                                    href={href}
                                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-[#267fc3]/10 text-[#267fc3]'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    title={isCollapsed ? label : ''}
                                >
                                    <div className="relative flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                                        <Icon
                                            className="w-5 h-5"
                                            color={isActive ? '#267fc3' : '#6B7280'}
                                        />
                                    </div>

                                    {!isCollapsed && (
                                        <span className={`ml-3 font-medium text-sm ${isActive ? 'font-semibold' : ''}`}>
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
                        <LogOutIcon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-1" />
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
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={toggleCollapse}
                />
            )}
        </>
    );
}
