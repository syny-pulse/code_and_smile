'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Submission {
    id: string;
    submittedAt: string;
    gradedAt: string | null;
    score: number | null;
    feedback: string | null;
    answers: any;
    assignment: {
        title: string;
        courseTitle: string;
        maxScore: number;
        type: string;
    };
}

export default function FeedbackPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const res = await fetch('/api/learner/feedback');
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error('Error loading feedback:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#267fc3]"></div>
            </div>
        );
    }

    // Filter to show only submissions that are either graded or have feedback, 
    // or just show all to give a complete history. Let's show all but emphasize graded.
    const hasSubmissions = submissions.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        My Feedback
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review scores and feedback from your tutors on your assignments.
                    </p>
                </div>

                {!hasSubmissions ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No assignments submitted yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Once you submit assignments and they are graded, your feedback will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {submissions.map((submission) => (
                            <div
                                key={submission.id}
                                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {submission.assignment.courseTitle.replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    • {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {submission.assignment.title}
                                            </h3>
                                        </div>

                                        <div className="flex-shrink-0">
                                            {submission.gradedAt ? (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                        Score
                                                    </span>
                                                    <span className={`text-2xl font-bold ${(submission.score || 0) / submission.assignment.maxScore >= 0.7
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-yellow-600 dark:text-yellow-400'
                                                        }`}>
                                                        {submission.score} <span className="text-lg text-gray-400 font-normal">/ {submission.assignment.maxScore}</span>
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                    Pending Grading
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {submission.feedback ? (
                                        <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700/50">
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                                Tutor Feedback
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                                                {submission.feedback}
                                            </p>
                                            {submission.gradedAt && (
                                                <p className="text-xs text-gray-400 mt-2 text-right">
                                                    Graded on {format(new Date(submission.gradedAt), 'MMM d, yyyy h:mm a')}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        submission.gradedAt ? (
                                            <p className="text-sm text-gray-500 italic mt-4">
                                                No written feedback provided.
                                            </p>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
