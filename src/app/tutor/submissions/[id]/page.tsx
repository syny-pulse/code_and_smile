'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Submission {
    id: string;
    score: number | null;
    feedback: string | null;
    submittedAt: string;
    gradedAt: string | null;
    answers: any;
    user: { id: string; firstName: string; lastName: string; email: string; avatar: string | null };
    assignment: {
        id: string;
        title: string;
        description: string;
        maxScore: number;
        courseTitle: string;
        type: string;
        submissionFormats: string[];
    };
}

export default function SubmissionDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [feedbackForm, setFeedbackForm] = useState({ score: '', feedback: '' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSubmission();
    }, [params.id]);

    const fetchSubmission = async () => {
        try {
            const res = await fetch(`/api/tutor/submissions/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setSubmission(data.submission);
                setFeedbackForm({
                    score: data.submission.score?.toString() || '',
                    feedback: data.submission.feedback || ''
                });
            } else {
                setError('Failed to load submission');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const saveFeedback = async () => {
        if (!submission) return;
        setSaving(true);

        try {
            const res = await fetch('/api/tutor/submissions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId: submission.id,
                    score: feedbackForm.score ? parseInt(feedbackForm.score) : null,
                    feedback: feedbackForm.feedback
                })
            });

            if (res.ok) {
                const data = await res.json();
                setSubmission({ ...submission, ...data.submission });
                alert('Feedback saved successfully');
                router.refresh();
            } else {
                alert('Failed to save feedback');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ECDC4]"></div>
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="p-8 text-center text-red-500">
                {error || 'Submission not found'}
                <div className="mt-4">
                    <button onClick={() => router.back()} className="text-blue-500 underline">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Helper to render answers (JSON) based on assignment type or generic
    const renderAnswers = () => {
        const answers = submission.answers;
        if (!answers) return <p className="text-gray-500 italic">No answers provided.</p>;

        if (Array.isArray(answers)) {
            // Assume quiz/list format
            return (
                <ul className="space-y-4">
                    {answers.map((ans: any, idx: number) => (
                        <li key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                            <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">
                                Question {idx + 1}
                            </p>
                            <p className="text-gray-900 dark:text-white">
                                {typeof ans === 'object' ? JSON.stringify(ans) : ans}
                            </p>
                        </li>
                    ))}
                </ul>
            );
        }

        if (typeof answers === 'object') {
            // Key-value pairs or file object
            return (
                <div className="space-y-4">
                    {Object.entries(answers).map(([key, value]: [string, any]) => (
                        <div key={key} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                            <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1 capitalized">
                                {key.replace(/_/g, ' ')}
                            </p>
                            {/* Check if value looks like a file link or text */}
                            <div className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                {typeof value === 'string' && (value.startsWith('http') || value.startsWith('/')) ? (
                                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download/View File
                                    </a>
                                ) : (
                                    typeof value === 'object' ? JSON.stringify(value) : value
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return <p className="whitespace-pre-wrap">{String(answers)}</p>;
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <button
                onClick={() => router.back()}
                className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Submissions
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Submission Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {submission.assignment.title}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Course: <span className="font-medium text-gray-700 dark:text-gray-300">{submission.assignment.courseTitle.replace(/_/g, ' ')}</span>
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${submission.gradedAt
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                {submission.gradedAt ? 'Graded' : 'Pending Grading'}
                            </span>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 overflow-hidden">
                                {submission.user.avatar ? (
                                    <img src={submission.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{submission.user.firstName[0]}</span>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-lg">
                                    {submission.user.firstName} {submission.user.lastName}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Submitted on {formatDate(submission.submittedAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submission Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Submission Content
                        </h2>

                        <div className="prose dark:prose-invert max-w-none">
                            {renderAnswers()}
                        </div>
                    </div>
                </div>

                {/* Right Column: Grading */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Grading
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Score <span className="text-gray-400 font-normal">(Max: {submission.assignment.maxScore})</span>
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={submission.assignment.maxScore}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent outline-none transition-all"
                                    placeholder="0"
                                    value={feedbackForm.score}
                                    onChange={e => setFeedbackForm({ ...feedbackForm, score: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Feedback Comments
                                </label>
                                <textarea
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent outline-none transition-all h-40 resize-none"
                                    placeholder="Provide constructive feedback..."
                                    value={feedbackForm.feedback}
                                    onChange={e => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={saveFeedback}
                                disabled={saving}
                                className="w-full py-3 bg-[#4ECDC4] text-white font-medium rounded-lg hover:bg-[#3db9b1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {saving ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    'Save Grade & Feedback'
                                )}
                            </button>

                            {submission.gradedAt && (
                                <p className="text-center text-xs text-gray-400">
                                    Last graded on {formatDate(submission.gradedAt)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
