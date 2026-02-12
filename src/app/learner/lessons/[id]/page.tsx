import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import PageHeading from "@/components/ui/pageHeading";
import LessonContent from "@/components/ui/LessonContent"; // Updated import

export default async function LessonPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/auth/signin');
    }

    const lesson = await prisma.lesson.findUnique({
        where: { id: params.id },
        include: {
            modules: {
                orderBy: { order: 'asc' }
            }
        }
    });

    if (!lesson) {
        return <div>Lesson not found</div>;
    }

    // Check if user is enrolled in the course
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coursesOfInterest: true }
    });

    const isEnrolled = user?.coursesOfInterest.includes(lesson.courseTitle);

    if (!isEnrolled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-6V4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                        You are not enrolled in the course <strong>{lesson.courseTitle.replace(/_/g, ' ')}</strong>.
                    </p>
                    <a href="/learner/dashboard" className="block w-full px-4 py-2.5 bg-[#267fc3] text-white rounded-lg hover:bg-[#1e6ca8] transition-colors font-medium">
                        Return to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    // Get user progress
    const progress = await prisma.progress.findUnique({
        where: {
            userId_lessonId: {
                userId: session.user.id,
                lessonId: lesson.id
            }
        }
    });

    const completedModules = progress?.completedModules || [];
    const isLessonComplete = progress?.completed || false;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            {/* Header / Breadcrumb area could go here if needed */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-8">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
                    <div className="flex flex-col gap-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Course / {lesson.courseTitle.replace(/_/g, ' ')}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {lesson.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Video Section */}
                        {lesson.videoUrl && (
                            <div className="bg-black rounded-xl overflow-hidden shadow-lg aspect-w-16 aspect-h-9">
                                <iframe
                                    src={lesson.videoUrl}
                                    title={lesson.title}
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            </div>
                        )}

                        {/* Description & Content */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">

                            {lesson.description && (
                                <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                        Overview
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {lesson.description}
                                    </p>
                                </div>
                            )}

                            {lesson.content ? (
                                <div className="prose dark:prose-invert max-w-none prose-img:rounded-lg prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-[#267fc3]">
                                    <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400 italic">
                                    No written content for this lesson.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Modules & Progress */}
                    <div className="lg:col-span-4">
                        <LessonContent
                            lessonId={lesson.id}
                            modules={lesson.modules}
                            completedModules={completedModules}
                            isLessonCompleted={isLessonComplete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
