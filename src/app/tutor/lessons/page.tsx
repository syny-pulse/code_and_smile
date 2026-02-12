'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Module {
    id: string;
    title: string;
    resources: { name: string; url: string }[];
    order: number;
}

interface Lesson {
    id: string;
    title: string;
    description: string | null;
    order: number;
    createdAt: string;
    courseTitle: string; // Added courseTitle
    course: { title: string }; // Kept for compatibility if API sends it
    modules: Module[];
    _count: { assignments: number };
}

interface Course {
    id: string;
    title: string;
}

const BookIcon = ({ className, color = "#4ECDC4" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth="2" fill="none" />
    </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

export default function TutorLessonsPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const res = await fetch('/api/tutor/lessons');
            if (res.ok) {
                const data = await res.json();
                setLessons(data.lessons);
                setCourses(data.courses);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteLesson = async (id: string) => {
        if (!confirm('Are you sure you want to delete this lesson?')) return;

        try {
            const res = await fetch(`/api/tutor/lessons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLessons(lessons.filter(l => l.id !== id));
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete lesson');
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
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Lessons</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Create and manage your course lessons</p>
                    </div>
                    <Link
                        href="/tutor/lessons/create"
                        className="px-6 py-3 bg-[#267fc3] text-white rounded-xl hover:bg-[#1e6ca8] flex items-center gap-2 transition-all shadow-lg hover:shadow-xl font-bold h-fit"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create Lesson
                    </Link>
                </div>

                {courses.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 p-24 text-center shadow-xl max-w-4xl mx-auto">
                        <div className="h-24 w-24 bg-[#267fc3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookIcon className="w-12 h-12" color="#267fc3" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No courses yet</h3>
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-sm mx-auto">You need to have courses assigned to create lessons. Check with your administrator.</p>
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 p-24 text-center shadow-xl max-w-4xl mx-auto">
                        <div className="h-24 w-24 bg-[#267fc3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookIcon className="w-12 h-12" color="#267fc3" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No lessons yet</h3>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto">Start by creating your first lesson to begin sharing knowledge.</p>
                        <Link
                            href="/tutor/lessons/create"
                            className="inline-flex items-center px-10 py-4 bg-[#267fc3] text-white rounded-xl hover:bg-[#1e6ca8] font-bold shadow-xl transition-all"
                        >
                            <PlusIcon className="w-5 h-5 mr-3" />
                            Create Your First Lesson
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className="group bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#267fc3] transition-colors">
                                                {lesson.title}
                                            </h3>
                                            <span className="px-3 py-1 bg-[#267fc3]/10 text-[#267fc3] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#267fc3]/20">
                                                {lesson.course?.title || lesson.courseTitle}
                                            </span>
                                        </div>
                                        {lesson.description && (
                                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed max-w-3xl line-clamp-2">{lesson.description}</p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                                {lesson.modules.length} modules
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                                {lesson._count.assignments} assignments
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>
                                                Order: {lesson.order + 1}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700/50">
                                        <Link
                                            href={`/tutor/lessons/${lesson.id}/edit`}
                                            className="flex-1 lg:flex-none px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm border border-gray-100 dark:border-gray-700/50 hover:bg-[#267fc3] hover:text-white hover:border-[#267fc3] transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteLesson(lesson.id)}
                                            className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
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
