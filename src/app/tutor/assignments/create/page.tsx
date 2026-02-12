'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
    id: string;
    title: string;
}

interface Lesson {
    id: string;
    title: string;
    courseId: string;
}

const SUBMISSION_FORMAT_OPTIONS = ['PDF', 'DOC', 'DOCX', 'TXT', 'ZIP', 'LINK', 'IMAGE'];
const ASSIGNMENT_TYPES = [
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'CODING', label: 'Coding' },
    { value: 'ESSAY', label: 'Essay' }
];

export default function CreateAssignmentPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        courseId: '',
        lessonId: '',
        title: '',
        description: '',
        type: 'ESSAY' as 'QUIZ' | 'CODING' | 'ESSAY',
        submissionFormats: [] as string[],
        maxScore: 100,
        dueDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (formData.courseId) {
            setFilteredLessons(lessons.filter(l => l.courseId === formData.courseId));
            setFormData(prev => ({ ...prev, lessonId: '' }));
        } else {
            setFilteredLessons([]);
        }
    }, [formData.courseId, lessons]);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/tutor/assignments');
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses);
                setLessons(data.lessons);
                if (data.courses.length > 0) {
                    setFormData(prev => ({ ...prev, courseId: data.courses[0].id }));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFormat = (format: string) => {
        setFormData(prev => ({
            ...prev,
            submissionFormats: prev.submissionFormats.includes(format)
                ? prev.submissionFormats.filter(f => f !== format)
                : [...prev.submissionFormats, format]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/tutor/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    lessonId: formData.lessonId || null,
                    dueDate: formData.dueDate || null
                })
            });

            if (res.ok) {
                router.push('/tutor/assignments');
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to create assignment');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Assignment</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Create a new assignment for your learners</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assignment Details</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                                <select
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.courseId}
                                    onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                                    required
                                >
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link to Lesson (Optional)</label>
                                <select
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.lessonId}
                                    onChange={e => setFormData({ ...formData, lessonId: e.target.value })}
                                >
                                    <option value="">No lesson linked</option>
                                    {filteredLessons.map(lesson => (
                                        <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="e.g., Week 1 Assignment"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea
                                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows={4}
                                placeholder="Describe what learners need to do"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                <select
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as 'QUIZ' | 'CODING' | 'ESSAY' })}
                                >
                                    {ASSIGNMENT_TYPES.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Score</label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    min={1}
                                    value={formData.maxScore}
                                    onChange={e => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date (Optional)</label>
                            <input
                                type="datetime-local"
                                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={formData.dueDate}
                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accepted Submission Formats</label>
                            <div className="flex flex-wrap gap-2">
                                {SUBMISSION_FORMAT_OPTIONS.map(format => (
                                    <button
                                        key={format}
                                        type="button"
                                        onClick={() => toggleFormat(format)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${formData.submissionFormats.includes(format)
                                                ? 'bg-[#4ECDC4] text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {format}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !formData.title || !formData.description}
                        className="px-6 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3db9b1] disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Assignment'}
                    </button>
                </div>
            </form>
        </div>
    );
}
