'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Module {
    id: string;
    title: string;
    order: number;
    resources: any;
}

interface LessonContentProps {
    lessonId: string;
    modules: Module[];
    completedModules: string[];
    isLessonCompleted: boolean;
}

export default function LessonContent({
    lessonId,
    modules,
    completedModules: initialCompletedModules,
    isLessonCompleted: initialLessonCompleted
}: LessonContentProps) {
    const router = useRouter();
    const [completedModules, setCompletedModules] = useState<string[]>(initialCompletedModules);
    const [isLessonCompleted, setIsLessonCompleted] = useState(initialLessonCompleted);
    const [isLoading, setIsLoading] = useState(false);

    const toggleModule = async (moduleId: string, currentStatus: boolean) => {
        if (isLoading) return;
        const newStatus = !currentStatus;

        // Optimistic update
        setCompletedModules(prev => {
            if (newStatus) return [...prev, moduleId];
            return prev.filter(id => id !== moduleId);
        });

        try {
            const res = await fetch('/api/progress/module', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, moduleId, completed: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update progress');

            // Check if all modules are complete to auto-complete lesson? 
            // The API might handle this, but for UI sync we can leave it or check response
            // For now, mainly user triggered manual lesson completion is separate but nice if auto.

            router.refresh();
        } catch (error) {
            console.error(error);
            // Revert
            setCompletedModules(prev => {
                if (newStatus) return prev.filter(id => id !== moduleId);
                return [...prev, moduleId];
            });
        }
    };

    const toggleLessonCompletion = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const newStatus = !isLessonCompleted;

        setIsLessonCompleted(newStatus); // Optimistic

        try {
            const res = await fetch('/api/progress/lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, completed: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update lesson status');

            router.refresh();
        } catch (error) {
            console.error(error);
            setIsLessonCompleted(!newStatus); // Revert
        } finally {
            setIsLoading(false);
        }
    };

    const progressPercentage = modules.length > 0
        ? Math.round((completedModules.length / modules.length) * 100)
        : (isLessonCompleted ? 100 : 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Lesson Progress</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {Math.round(progressPercentage)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-[#267fc3] h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            <div className="p-2">
                <div className="space-y-1">
                    {modules.map((module, idx) => {
                        const isCompleted = completedModules.includes(module.id);
                        return (
                            <div
                                key={module.id}
                                className={`group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${isCompleted
                                        ? 'bg-blue-50/50 dark:bg-blue-900/10'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleModule(module.id, isCompleted)}
                                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200 ${isCompleted
                                            ? 'bg-[#267fc3] border-[#267fc3] text-white'
                                            : 'border-gray-300 dark:border-gray-600 text-transparent hover:border-[#267fc3]'
                                        }`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium transition-colors ${isCompleted ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {module.title}
                                    </p>
                                    {module.resources && Array.isArray(module.resources) && module.resources.length > 0 && (
                                        <div className="mt-1.5 flex flex-wrap gap-2">
                                            {module.resources.map((resource: any, rIdx: number) => (
                                                <a
                                                    key={rIdx}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs text-gray-500 hover:text-[#267fc3] transition-colors"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                    </svg>
                                                    {resource.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {modules.length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm italic">
                            No modules in this lesson
                        </div>
                    )}
                </div>
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30">
                <button
                    onClick={toggleLessonCompletion}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${isLessonCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                            : 'bg-[#267fc3] text-white hover:bg-[#1e6ca8] shadow-sm hover:shadow'
                        }`}
                >
                    {isLessonCompleted ? (
                        <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Marked as Complete
                        </>
                    ) : (
                        'Mark Lesson Complete'
                    )}
                </button>
            </div>
        </div>
    );
}

