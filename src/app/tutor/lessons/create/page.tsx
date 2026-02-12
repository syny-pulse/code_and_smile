'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Resource {
    name: string;
    url: string;
}

interface Module {
    title: string;
    resources: Resource[];
}

interface Course {
    id: string;
    title: string;
}

export default function CreateLessonPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        courseId: '',
        title: '',
        description: ''
    });
    const [modules, setModules] = useState<Module[]>([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/tutor/lessons');
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses);
                if (data.courses.length > 0) {
                    setFormData(prev => ({ ...prev, courseId: data.courses[0].id }));
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addModule = () => {
        setModules([...modules, { title: '', resources: [] }]);
    };

    const removeModule = (index: number) => {
        setModules(modules.filter((_, i) => i !== index));
    };

    const updateModule = (index: number, field: string, value: string) => {
        const updated = [...modules];
        updated[index] = { ...updated[index], [field]: value };
        setModules(updated);
    };

    const addResource = (moduleIndex: number) => {
        const updated = [...modules];
        updated[moduleIndex].resources.push({ name: '', url: '' });
        setModules(updated);
    };

    const removeResource = (moduleIndex: number, resourceIndex: number) => {
        const updated = [...modules];
        updated[moduleIndex].resources = updated[moduleIndex].resources.filter((_, i) => i !== resourceIndex);
        setModules(updated);
    };

    const updateResource = (moduleIndex: number, resourceIndex: number, field: string, value: string) => {
        const updated = [...modules];
        updated[moduleIndex].resources[resourceIndex] = {
            ...updated[moduleIndex].resources[resourceIndex],
            [field]: value
        };
        setModules(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/tutor/lessons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    modules: modules.filter(m => m.title.trim()).map((m, idx) => ({
                        ...m,
                        order: idx,
                        resources: m.resources.filter(r => r.name.trim() && r.url.trim())
                    }))
                })
            });

            if (res.ok) {
                router.push('/tutor/lessons');
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to create lesson');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Lesson</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Create a new lesson with modules and resources</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lesson Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                            <select
                                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={formData.courseId}
                                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                                required
                            >
                                <option value="">Select a Course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lesson Title</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="e.g., Introduction to Web Development"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea
                                className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                rows={3}
                                placeholder="Brief description of this lesson"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Modules */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Modules</h2>
                        <button
                            type="button"
                            onClick={addModule}
                            className="px-3 py-1.5 bg-[#4ECDC4] text-white rounded-lg text-sm hover:bg-[#3db9b1]"
                        >
                            + Add Module
                        </button>
                    </div>

                    {modules.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>No modules yet. Click "Add Module" to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {modules.map((module, moduleIndex) => (
                                <div key={moduleIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                    <div className="flex items-start gap-4 mb-3">
                                        <span className="flex-shrink-0 w-8 h-8 bg-[#4ECDC4] text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {moduleIndex + 1}
                                        </span>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                placeholder="Module title"
                                                value={module.title}
                                                onChange={e => updateModule(moduleIndex, 'title', e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeModule(moduleIndex)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Resources */}
                                    <div className="ml-12 space-y-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Resources:</p>
                                        {module.resources.map((resource, resourceIndex) => (
                                            <div key={resourceIndex} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 border rounded-lg p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    placeholder="Resource name"
                                                    value={resource.name}
                                                    onChange={e => updateResource(moduleIndex, resourceIndex, 'name', e.target.value)}
                                                />
                                                <input
                                                    type="url"
                                                    className="flex-1 border rounded-lg p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                    placeholder="https://..."
                                                    value={resource.url}
                                                    onChange={e => updateResource(moduleIndex, resourceIndex, 'url', e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeResource(moduleIndex, resourceIndex)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addResource(moduleIndex)}
                                            className="text-sm text-[#4ECDC4] hover:underline"
                                        >
                                            + Add Resource
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
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
                        disabled={loading || !formData.courseId}
                        className="px-6 py-2 bg-[#4ECDC4] text-white rounded-lg hover:bg-[#3db9b1] disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Lesson'}
                    </button>
                </div>
            </form>
        </div>
    );
}
