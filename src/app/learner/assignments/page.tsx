import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AssignmentsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/auth/signin');
    }

    // Get user's enrolled courses (interests)
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coursesOfInterest: true }
    });
    const enrolledTitles = user?.coursesOfInterest || [];

    // Get all assignments for these courses
    const assignments = await prisma.assignment.findMany({
        where: { courseTitle: { in: enrolledTitles } },
        orderBy: { dueDate: 'asc' },
        include: {
            submissions: {
                where: { userId: session.user.id },
                select: { id: true, submittedAt: true, gradedAt: true, score: true }
            }
        }
    });

    const getStatus = (assignment: any) => {
        const submission = assignment.submissions[0];
        if (submission) {
            if (submission.gradedAt) return 'graded';
            return 'submitted';
        }
        if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
            return 'overdue';
        }
        return 'pending';
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        graded: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Assignments
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and submit your course assignments.
                    </p>
                </div>

                {/* Assignments List */}
                <div className="space-y-4">
                    {assignments.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                            <div className="text-gray-500 dark:text-gray-400">
                                No assignments found for your enrolled courses.
                            </div>
                        </div>
                    ) : (
                        assignments.map((assignment) => {
                            const status = getStatus(assignment);
                            const submission = assignment.submissions[0];

                            return (
                                <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {assignment.title}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}>
                                                    {status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Course: {assignment.courseTitle.replace(/_/g, ' ')}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                {assignment.description}
                                            </p>

                                            {status === 'graded' && submission.score && (
                                                <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                                    Score: {submission.score} / {assignment.maxScore}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {assignment.dueDate && (
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {new Date(assignment.dueDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}

                                            <Link
                                                href={`/learner/assignments/${assignment.id}`}
                                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
                                            >
                                                {status === 'pending' || status === 'overdue' ? 'Submit Work' : 'View Submission'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
