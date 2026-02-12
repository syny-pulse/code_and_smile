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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">My Courses</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Manage your course content and structure.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all h-fit">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-bold">{showForm ? 'Cancel' : 'Add New Course'}</span>
          </Button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 p-8 mb-10 shadow-2xl max-w-2xl mx-auto animate-fade-in-down">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-[#267fc3]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#267fc3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Course</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium animate-pulse">{error}</div>}

              <div>
                <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Course Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#267fc3] focus:border-transparent transition-all outline-none"
                  placeholder="e.g., Introduction to React"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Description</label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#267fc3] focus:border-transparent transition-all outline-none"
                  rows={4}
                  placeholder="Brief summary of the course content..."
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="px-8 py-3 rounded-xl font-bold">Create Course</Button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-white/50 dark:bg-gray-800/30 rounded-2xl animate-pulse border border-gray-200 dark:border-gray-700/50"></div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-xl max-w-4xl mx-auto">
            <div className="h-24 w-24 bg-[#267fc3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#267fc3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No courses yet</h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-10">Create your first course to start adding content and enrolling students.</p>
            <Button onClick={() => setShowForm(true)} className="px-10 py-4 text-base font-bold shadow-xl">Add Your First Course</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <div key={course.id} className="group bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-40 bg-[#267fc3]/5 border-b border-gray-100 dark:border-gray-700/30 flex items-center justify-center relative overflow-hidden group-hover:bg-[#267fc3]/10 transition-colors">
                  <svg className="w-24 h-24 text-[#267fc3]/5 absolute -bottom-6 -right-6 transform rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-[#267fc3] relative z-10 px-8 text-center line-clamp-2">{course.title}</h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-xl text-center border border-gray-100 dark:border-gray-700/50 group-hover:border-[#267fc3]/30 transition-colors">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{course.enrollmentsCount}</p>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Enrolled</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-xl text-center border border-gray-100 dark:border-gray-700/50 group-hover:border-[#267fc3]/30 transition-colors">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{course.submissionsCount}</p>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Submissions</p>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-700/50 flex justify-between items-center">
                    <button className="text-sm font-bold text-[#267fc3] hover:text-[#1e6ca8] transition-colors flex items-center gap-2 group/btn">
                      View Course Details
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
