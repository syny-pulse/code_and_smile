import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LessonsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/auth/signin');
    }

    // 1. Get user's enrolled courses
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coursesOfInterest: true }
    });

    const enrolledTitles = user?.coursesOfInterest || [];

    // 2. Fetch lessons for these courses
    const lessons = await prisma.lesson.findMany({
        where: { courseTitle: { in: enrolledTitles } },
        orderBy: [
            { courseTitle: 'asc' },
            { order: 'asc' }
        ],
        include: {
            progress: {
                where: { userId: session.user.id }
            },
            modules: {
                select: { id: true }
            }
        }
    });

    // Group lessons by course
    const lessonsByCourse: Record<string, typeof lessons> = {};
    lessons.forEach(lesson => {
        if (!lessonsByCourse[lesson.courseTitle]) {
            lessonsByCourse[lesson.courseTitle] = [];
        }
        lessonsByCourse[lesson.courseTitle].push(lesson);
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        My Lessons
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and continue your course lessons.
                    </p>
                </div>

                {/* Content */}
                {Object.keys(lessonsByCourse).length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No lessons available yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {enrolledTitles.length === 0
                                    ? "You haven't enrolled in any courses yet."
                                    : "No lessons have been published for your enrolled courses."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(lessonsByCourse).map(([courseTitle, courseLessons]) => (
                            <div key={courseTitle} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {courseTitle.replace(/_/g, ' ')}
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {courseLessons.map((lesson) => {
                                        const progress = lesson.progress[0];
                                        const isCompleted = progress?.completed;
                                        const moduleCount = lesson.modules.length;
                                        const completedModulesCount = progress?.completedModules?.length || 0;

                                        return (
                                            <div key={lesson.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                                {lesson.title}
                                                            </h3>
                                                            {isCompleted && (
                                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                                    Completed
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                                                            {lesson.description}
                                                        </p>
                                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                                                            <span>{moduleCount} Modules</span>
                                                            {moduleCount > 0 && (
                                                                <span>{Math.round((completedModulesCount / moduleCount) * 100)}% Progress</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/learner/lessons/${lesson.id}`}
                                                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium whitespace-nowrap text-center"
                                                    >
                                                        {isCompleted ? 'Review Lesson' : progress ? 'Continue Lesson' : 'Start Lesson'}
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
