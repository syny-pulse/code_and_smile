'use client';

import { useState, useEffect } from 'react';

interface Submission {
    id: string;
    score: number | null;
    feedback: string | null;
    submittedAt: string;
    gradedAt: string | null;
    answers: Record<string, unknown>;
    user: { id: string; firstName: string; lastName: string; email: string };
    assignment: { title: string; maxScore: number; course: { title: string } };
}

const InboxIcon = ({ className, color = "#4ECDC4" }: { className?: string; color?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="22,12 16,12 14,15 10,15 8,12 2,12" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function TutorSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [feedbackForm, setFeedbackForm] = useState({ score: '', feedback: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/tutor/submissions');
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const openFeedbackModal = (submission: Submission) => {
        setSelectedSubmission(submission);
        setFeedbackForm({
            score: submission.score?.toString() || '',
            feedback: submission.feedback || ''
        });
    };

    const saveFeedback = async () => {
        if (!selectedSubmission) return;
        setSaving(true);

        try {
            const res = await fetch('/api/tutor/submissions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId: selectedSubmission.id,
                    score: feedbackForm.score ? parseInt(feedbackForm.score) : null,
                    feedback: feedbackForm.feedback
                })
            });

            if (res.ok) {
                const data = await res.json();
                setSubmissions(submissions.map(s =>
                    s.id === selectedSubmission.id ? { ...s, ...data.submission } : s
                ));
                setSelectedSubmission(null);
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
            month: 'short',
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submissions</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Review submissions and provide feedback</p>
            </div>

            {submissions.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <InboxIcon className="w-16 h-16 mx-auto mb-4" color="#9CA3AF" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No submissions yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">Submissions from your learners will appear here.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Student</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Assignment</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Submitted</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Score</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {submissions.map(submission => (
                                <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {submission.user.firstName} {submission.user.lastName}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{submission.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{submission.assignment.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{submission.assignment.course.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(submission.submittedAt)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {submission.score !== null ? (
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {submission.score}/{submission.assignment.maxScore}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${submission.gradedAt
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                            }`}>
                                            {submission.gradedAt ? 'Graded' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <a
                                                href={`/tutor/submissions/${submission.id}`}
                                                className="px-3 py-1.5 bg-[#4ECDC4] text-white text-sm rounded-lg hover:bg-[#3db9b1] inline-block"
                                            >
                                                View & Grade
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Feedback Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Grade Submission
                        </h2>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedSubmission.user.firstName} {selectedSubmission.user.lastName} • {selectedSubmission.assignment.title}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Score (out of {selectedSubmission.assignment.maxScore})
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={selectedSubmission.assignment.maxScore}
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={feedbackForm.score}
                                    onChange={e => setFeedbackForm({ ...feedbackForm, score: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Feedback
                                </label>
                                <textarea
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    rows={4}
                                    placeholder="Provide feedback for the learner..."
                                    value={feedbackForm.feedback}
                                    onChange={e => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveFeedback}
                                disabled={saving}
                                className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3db9b1] disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Feedback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
