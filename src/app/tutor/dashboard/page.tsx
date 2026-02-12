import prisma from '@/lib/db/prisma';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Assignment {
    id: string;
    title: string;
    dueDate: Date | string | null;
}

// SVG Icons for better visual hierarchy
const UsersIcon = ({ className, color = "#4ECDC4" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const FileTextIcon = ({ className, color = "#FF6F61" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const ClockIcon = ({ className, color = "#6B7280" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
        <polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CalendarIcon = ({ className, color = "#6B7280" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none" />
        <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
    </svg>
);

async function getTutorDashboardData(tutorId: string) {
    // Get tutor's interests (acting as their courses)
    const tutor = await prisma.user.findUnique({
        where: { id: tutorId },
        select: { coursesOfInterest: true }
    });

    const courseTitles = tutor?.coursesOfInterest || [];

    // Count submissions for tutor's courses
    const submissionCount = await prisma.submission.count({
        where: { assignment: { courseTitle: { in: courseTitles } } },
    });

    // Get assignments due (dueDate in future)
    const assignmentsDue = await prisma.assignment.findMany({
        where: {
            courseTitle: { in: courseTitles },
            dueDate: { gte: new Date() },
        },
        select: {
            id: true,
            title: true,
            dueDate: true,
        },
        orderBy: {
            dueDate: 'asc',
        },
    });

    return { tutor, submissionCount, assignmentsDue };
}

export default async function TutorDashboard() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/auth/signin');
    }

    const tutorId = session.user.id;

    const { tutor, submissionCount, assignmentsDue } = await getTutorDashboardData(tutorId);

    const formatDate = (dateValue: Date | string | null) => {
        if (!dateValue) return 'No due date';
        const date = new Date(dateValue);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        if (diffDays > 1 && diffDays <= 7) return `Due in ${diffDays} days`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDateUrgency = (dateValue: Date | string | null) => {
        if (!dateValue) return 'default';
        const date = new Date(dateValue);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return 'urgent';
        if (diffDays <= 3) return 'warning';
        return 'default';
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-10 animate-fade-in-up">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                        Dashboard Overview
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Welcome back! Here's what's happening in your courses today.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {/* Courses Card */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                    My Courses
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {tutor?.coursesOfInterest.length || 0}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#267fc3]/10 dark:bg-[#267fc3]/20 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-[#267fc3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Submissions Card */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                    Total Submissions
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {submissionCount}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-green-100 dark:bg-green-500/10 group-hover:scale-110 transition-transform">
                                <FileTextIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    {/* Assignments Due Card */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                    Active Assignments
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {assignmentsDue.length}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-500/10 group-hover:scale-110 transition-transform">
                                <ClockIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </div>

                    {/* Learners Card */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                                    My Learners
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    -
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-yellow-100 dark:bg-yellow-500/10 group-hover:scale-110 transition-transform">
                                <UsersIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assignments Section */}
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden shadow-xl lg:col-span-2">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/30">
                        <div className="flex items-center space-x-3">
                            <CalendarIcon className="w-5 h-5 text-[#267fc3]" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Upcoming Deadlines
                            </h2>
                        </div>
                    </div>

                    <div className="p-6">
                        {assignmentsDue.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="bg-gray-100 dark:bg-gray-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClockIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                                    No upcoming assignments
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
                                    You can relax! There are no pending assignments for your courses at the moment.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left">
                                            <th className="pb-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-2">Assignment Name</th>
                                            <th className="pb-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                                            <th className="pb-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right pr-2">Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                        {assignmentsDue.map((assignment: Assignment) => {
                                            const urgency = getDateUrgency(assignment.dueDate);
                                            const urgencyStyles: Record<string, string> = {
                                                urgent: 'bg-red-500/10 text-red-500 dark:bg-red-500/20',
                                                warning: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20',
                                                default: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20'
                                            };

                                            return (
                                                <tr key={assignment.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200">
                                                    <td className="py-5 pl-2">
                                                        <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#267fc3] transition-colors">{assignment.title}</p>
                                                    </td>
                                                    <td className="py-5">
                                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${urgencyStyles[urgency]}`}>
                                                            {urgency === 'urgent' ? 'Closing Soon' : 'Accepting Submissions'}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 text-right pr-2">
                                                        <span className={`text-sm font-bold ${urgency === 'urgent' ? 'text-red-500' :
                                                            urgency === 'warning' ? 'text-yellow-500' :
                                                                'text-gray-500 dark:text-gray-400'
                                                            }`}>
                                                            {formatDate(assignment.dueDate)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
