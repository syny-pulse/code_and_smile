import prisma from '@/lib/db/prisma';
import Image from 'next/image';

export default async function AdminCoursesPage() {
    // Group lessons by courseTitle to simulate "Courses"
    const content = await prisma.lesson.groupBy({
        by: ['courseTitle'],
        _count: {
            id: true, // count lessons
        },
        orderBy: {
            courseTitle: 'asc'
        }
    });

    const courses = content.map(item => ({
        title: item.courseTitle,
        lessonCount: item._count.id
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Active Courses
                </h1>
                <div className="text-sm text-gray-500">
                    {courses.length} courses found
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-medium">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4 text-center">Lessons</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {courses.map((course, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* Fallback Icon */}
                                            <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                {course.title.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white max-w-xs truncate" title={course.title}>
                                                {course.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {course.lessonCount} lessons
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-gray-500">
                                        <p className="text-base font-medium text-gray-900 dark:text-white mb-1">No courses found</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Courses appear here when Tutors create lessons.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
