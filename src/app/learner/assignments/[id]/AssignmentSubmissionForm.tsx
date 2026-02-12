'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AssignmentSubmissionFormProps {
    assignmentId: string;
    submissionFormats: string[];
    existingSubmission?: any;
}

export default function AssignmentSubmissionForm({ assignmentId, submissionFormats, existingSubmission }: AssignmentSubmissionFormProps) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [notes, setNotes] = useState(existingSubmission?.answers?.notes || '');
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        setMessage(null);

        try {
            let fileUrl = existingSubmission?.answers?.fileUrl;

            // 1. Upload File (if selected)
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) {
                    throw new Error('File upload failed');
                }

                const uploadData = await uploadRes.json();
                fileUrl = uploadData.url;
            }

            if (!fileUrl && !notes.trim()) {
                throw new Error('Please upload a file or add notes.');
            }

            setIsUploading(false);
            setIsSubmitting(true);

            // 2. Submit Assignment
            const submissionRes = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId,
                    answers: {
                        fileUrl,
                        notes,
                        submittedAt: new Date().toISOString()
                    }
                })
            });

            if (!submissionRes.ok) {
                throw new Error('Submission failed');
            }

            setMessage({ type: 'success', text: 'Assignment submitted successfully!' });
            router.refresh();
            setFile(null); // Clear file input

        } catch (error: any) {
            console.error(error);
            setMessage({ type: 'error', text: error.message || 'Something went wrong.' });
        } finally {
            setIsUploading(false);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {/* File Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload File
                </label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary/90
                    "
                />
                {existingSubmission?.answers?.fileUrl && !file && (
                    <p className="mt-2 text-xs text-gray-500">
                        Current file: <a href={existingSubmission.answers.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View File</a>
                    </p>
                )}
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes / Comments
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Add any comments here..."
                />
            </div>

            <button
                type="submit"
                disabled={isUploading || isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isUploading ? 'Uploading...' : isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
        </form>
    );
}
