'use client';
import prisma from '@/lib/db/prisma';
import React from 'react';

interface Assignment {
  id: string;
  title: string;
  dueDate: string | null;
}

// SVG Icons for better visual hierarchy
const UsersIcon = ({ className, color = "#4ECDC4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FileTextIcon = ({ className, color = "#FF6F61" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ClockIcon = ({ className, color = "#6B7280" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
    <polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = ({ className, color = "#6B7280" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2" fill="none"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2"/>
  </svg>
);

async function getTutorDashboardData(tutorId: string) {
  // Get courses by tutor
  const courses = await prisma.course.findMany({
    where: { tutorId },
    select: { id: true },
  });
  const courseIds = courses.map((course: { id: string }) => course.id);

  // Count enrollments for tutor's courses
  const enrollmentCount = await prisma.enrollment.count({
    where: { courseId: { in: courseIds } },
  });

  // Count submissions for tutor's courses
  const submissionCount = await prisma.submission.count({
    where: { assignment: { courseId: { in: courseIds } } },
  });

  // Get assignments due (dueDate in future)
  const assignmentsDue = await prisma.assignment.findMany({
    where: {
      courseId: { in: courseIds },
      dueDate: { gte: new Date() },
    },
    select: {
      id: true,
      title: true,
      dueDate: true,
    },
    orderBy: {
      dueDate: 'asc',
    },
  });

  return { enrollmentCount, submissionCount, assignmentsDue };
}

export default async function TutorDashboard() {
  // TODO: Replace with actual tutorId from session/auth
  const tutorId = 'replace-with-tutor-id';

  const { enrollmentCount, submissionCount, assignmentsDue } = await getTutorDashboardData(tutorId);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `Due in ${diffDays} days`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDateUrgency = (dateString: string | null) => {
    if (!dateString) return 'default';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'urgent';
    if (diffDays <= 3) return 'warning';
    return 'default';
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.cdnfonts.com/css/futura-lt-bt');
        
        * {
          font-family: 'Futura Lt BT', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with your courses.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Enrollments Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total Enrollments
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {enrollmentCount}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Active students
                  </p>
                </div>
                <div 
                  className="h-12 w-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#4ECDC4' + '20' }}
                >
                  <UsersIcon className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Submissions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total Submissions
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {submissionCount}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Completed work
                  </p>
                </div>
                <div 
                  className="h-12 w-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#FF6F61' + '20' }}
                >
                  <FileTextIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Assignments Due Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <ClockIcon className="w-5 h-5" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upcoming Assignments
                </h2>
                {assignmentsDue.length > 0 && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                    {assignmentsDue.length} due
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              {assignmentsDue.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                    No upcoming assignments
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    All caught up! Your students don't have any pending assignments.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignmentsDue.map((assignment: Assignment) => {
                    const urgency = getDateUrgency(assignment.dueDate);
                    const urgencyColors = {
                      urgent: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
                      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
                      default: 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    };
                    
                    return (
                      <div
                        key={assignment.id}
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${urgencyColors[urgency]}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                              {assignment.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Assignment due for students
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            <span className={`font-medium ${
                              urgency === 'urgent' ? 'text-red-600 dark:text-red-400' :
                              urgency === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-gray-600 dark:text-gray-400'
                            }`}>
                              {formatDate(assignment.dueDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}