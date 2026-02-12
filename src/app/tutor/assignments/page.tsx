'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Assignment {
    id: string;
    title: string;
    description: string;
    type: string;
    submissionFormats: string[];
    maxScore: number;
    dueDate: string | null;
    createdAt: string;
    course: { title: string };
    lesson: { title: string } | null;
    _count: { submissions: number };
}

const ClipboardIcon = ({ className, color = "#4ECDC4" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke={color} strokeWidth="2" fill="none" />
    </svg>
);

export default function TutorAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const res = await fetch('/api/tutor/assignments');
            if (res.ok) {
                const data = await res.json();
                setAssignments(data.assignments);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'No due date';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'QUIZ': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'CODING': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'ESSAY': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
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
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Assignments</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Create and manage assignments for your learners</p>
                    </div>
                    <Link
                        href="/tutor/assignments/create"
                        className="px-6 py-3 bg-[#267fc3] text-white rounded-xl hover:bg-[#1e6ca8] flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-bold h-fit"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Assignment
                    </Link>
                </div>

                {assignments.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 p-24 text-center shadow-xl max-w-4xl mx-auto">
                        <div className="h-24 w-24 bg-[#267fc3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ClipboardIcon className="w-12 h-12" color="#267fc3" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No assignments yet</h3>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto">Start by creating your first assignment to engage with your learners.</p>
                        <Link
                            href="/tutor/assignments/create"
                            className="inline-flex items-center px-10 py-4 bg-[#267fc3] text-white rounded-xl hover:bg-[#1e6ca8] font-bold shadow-xl transition-all"
                        >
                            Create Your First Assignment
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-700/50">
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Assignment</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Linked Content</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Due Date</th>
                                        <th className="px-8 py-5 text-right text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Submissions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                    {assignments.map(assignment => (
                                        <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200 group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-10 w-10 rounded-lg bg-[#267fc3]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <ClipboardIcon className="w-5 h-5" color="#267fc3" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#267fc3] transition-colors">{assignment.title}</p>
                                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{assignment.course.title}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${getTypeColor(assignment.type)}`}>
                                                    {assignment.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        {assignment.lesson?.title || 'No linked lesson'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                                    {formatDate(assignment.dueDate)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-sm font-bold text-[#267fc3] border border-gray-100 dark:border-gray-700/50 shadow-sm group-hover:bg-[#267fc3]/5 group-hover:border-[#267fc3]/20 transition-all">
                                                    {assignment._count.submissions} Submissions
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
