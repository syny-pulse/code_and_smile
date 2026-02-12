import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import PageHeading from "@/components/ui/pageHeading";
import AssignmentSubmissionForm from "./AssignmentSubmissionForm";

export default async function AssignmentDetailsPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/auth/signin');
    }

    const assignment = await prisma.assignment.findUnique({
        where: { id: params.id },
        include: {
            submissions: {
                where: { userId: session.user.id },
                take: 1
            }
        }
    });

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    // Check if user is enrolled in the course
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coursesOfInterest: true }
    });

    const isEnrolled = user?.coursesOfInterest.includes(assignment.courseTitle);

    if (!isEnrolled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You are not enrolled in the course <strong>{assignment.courseTitle.replace(/_/g, ' ')}</strong>.
                    </p>
                    <a href="/learner/assignments" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                        Back to Assignments
                    </a>
                </div>
            </div>
        );
    }

    const submission = assignment.submissions[0];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <Link href="/learner/assignments" className="text-sm text-gray-500 hover:text-primary mb-2 inline-block">
                        ← Back to Assignments
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {assignment.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Course: {assignment.courseTitle.replace(/_/g, ' ')}</span>
                        {assignment.dueDate && (
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        )}
                        <span>Max Score: {assignment.maxScore}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Instructions</h2>
                            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {assignment.description}
                            </div>
                        </div>

                        {/* Submission Status if submitted */}
                        {submission && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Submission Status</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Submitted on:</span> {new Date(submission.submittedAt).toLocaleString()}</p>
                                    {submission.gradedAt ? (
                                        <>
                                            <p><span className="font-medium">Status:</span> Graded</p>
                                            <p><span className="font-medium">Score:</span> {submission.score} / {assignment.maxScore}</p>
                                            {submission.feedback && (
                                                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                                                    <p className="font-medium mb-1">Feedback:</p>
                                                    <p className="italic text-gray-700 dark:text-gray-300">{submission.feedback}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p><span className="font-medium">Status:</span> Pending Grading</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {submission ? 'Resubmit Work' : 'Submit Work'}
                            </h2>

                            <AssignmentSubmissionForm
                                assignmentId={assignment.id}
                                submissionFormats={assignment.submissionFormats}
                                existingSubmission={submission}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import Link from "next/link";
