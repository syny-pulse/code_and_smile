'use client';

import React, { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import { useSession } from 'next-auth/react';

interface Course {
  id: string;
  title: string;
  enrollmentsCount: number;
  submissionsCount: number;
  description: string;
  tutorId: string;
}

const initialFormState = {
  title: '',
  description: '',
};

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const tutorId = session?.user?.id;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string>('');

  const fetchCourses = async () => {
    if (!tutorId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError('Error loading courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [tutorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? target.checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tutorId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create course');
      }
      setFormData(initialFormState);
      setShowForm(false);
      fetchCourses();
    } catch (err: any) {
      setError(err.message || 'Error creating course');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-8 py-10 transition-colors duration-300">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">My Courses</h1>

      <Button onClick={() => setShowForm(!showForm)} className="mb-6">
        {showForm ? 'Cancel' : 'Add New Course'}
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-8 space-y-4 max-w-2xl">
          {error && <p className="text-red-600">{error}</p>}

          <div>
            <label htmlFor="title" className="block font-semibold mb-1">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              rows={4}
            />
          </div>

          <Button type="submit">Save Course</Button>
        </form>
      )}

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Course Name</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Enrollments</th>
              <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Submissions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{course.title}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{course.enrollmentsCount}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{course.submissionsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
