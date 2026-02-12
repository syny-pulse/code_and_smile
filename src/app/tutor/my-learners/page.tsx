'use client';

import { useState, useEffect } from 'react';

interface Learner {
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        createdAt: string;
        lastLoggedIn: string | null;
    };
    courses: {
        id: string;
        title: string;
        enrolledAt: string;
        progress: number;
    }[];
}

const UsersIcon = ({ className, color = "#4ECDC4" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function MyLearnersPage() {
    const [learners, setLearners] = useState<Learner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLearners();
    }, []);

    const fetchLearners = async () => {
        try {
            const res = await fetch('/api/tutor/learners');
            if (res.ok) {
                const data = await res.json();
                setLearners(data.learners);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ECDC4]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">My Learners</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">View learners enrolled in your courses</p>
                    </div>
                </div>

                {learners.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 p-24 text-center shadow-xl max-w-4xl mx-auto">
                        <div className="h-24 w-24 bg-[#267fc3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <UsersIcon className="w-12 h-12" color="#267fc3" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No learners yet</h3>
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Learners enrolled in your courses will appear here once they join.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {learners.map(learner => (
                            <div
                                key={learner.user.id}
                                className="group bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 p-8 hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-[#267fc3]/10 rounded-2xl flex items-center justify-center border border-[#267fc3]/20 group-hover:scale-110 transition-transform">
                                            <span className="text-[#267fc3] font-bold text-2xl">
                                                {learner.user.firstName[0]}{learner.user.lastName[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#267fc3] transition-colors">
                                                {learner.user.firstName} {learner.user.lastName}
                                            </h3>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{learner.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        Last active: {formatDate(learner.user.lastLoggedIn)}
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700/50">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Course Progress</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {learner.courses.map(course => (
                                            <div
                                                key={course.id}
                                                className="p-5 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-[#267fc3]/30 transition-colors"
                                            >
                                                <p className="font-bold text-gray-900 dark:text-white mb-4 line-clamp-1">{course.title}</p>
                                                <div className="">
                                                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
                                                        <span>Progress</span>
                                                        <span className="text-[#267fc3]">{Math.round(course.progress)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-[#267fc3] h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(38,127,195,0.4)]"
                                                            style={{ width: `${course.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
