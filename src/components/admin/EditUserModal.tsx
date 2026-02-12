'use client';

import { useState, useEffect } from 'react';

const COURSES = [
    'BASIC_DIGITAL_LITERACY',
    'DIGITAL_MARKETING',
    'GRAPHICS_DESIGN',
    'PROJECT_MANAGEMENT',
    'WEB_DESIGN',
    'DIGITAL_FINANCIAL_LITERACY',
];

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    coursesOfInterest?: string[];
}

export default function EditUserModal({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: User | null }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'LEARNER',
        coursesOfInterest: [] as string[],
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                coursesOfInterest: user.coursesOfInterest || [],
            });
        }
    }, [user]);

    const toggleCourse = (course: string) => {
        setFormData(prev => ({
            ...prev,
            coursesOfInterest: prev.coursesOfInterest.includes(course)
                ? prev.coursesOfInterest.filter(c => c !== course)
                : [...prev.coursesOfInterest, course]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    ...formData
                }),
            });

            if (response.ok) {
                alert('User updated successfully!');
                onClose();
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to update user');
            }
        } catch (error) {
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Edit User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">First Name</label>
                            <input
                                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Last Name</label>
                            <input
                                className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Role</label>
                        <select
                            className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="LEARNER">Learner</option>
                            <option value="TUTOR">Tutor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    {(formData.role === 'LEARNER' || formData.role === 'TUTOR') && (
                        <div>
                            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Courses</label>
                            <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 dark:border-gray-600">
                                {COURSES.map(course => (
                                    <label key={course} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.coursesOfInterest.includes(course)}
                                            onChange={() => toggleCourse(course)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm dark:text-gray-300">
                                            {course.replace(/_/g, ' ')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[#267fc3] text-white rounded-lg hover:bg-[#1a5a8a] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
