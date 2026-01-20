import prisma from '@/lib/db/prisma';
import React from 'react';

export const dynamic = 'force-dynamic';

// SVG Icons for better visual hierarchy
const UsersIcon = ({ className, color = "#267fc3" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BookIcon = ({ className, color = "#4ECDC4" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

const FileTextIcon = ({ className, color = "#FF6F61" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="16" y1="13" x2="8" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="17" x2="8" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const GraduationIcon = ({ className, color = "#ffc82e" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

async function getAdminDashboardData() {
  // Get total users count by role
  const userCounts = await prisma.user.groupBy({
    by: ['role'],
    _count: { id: true },
  });

  const totalUsers = userCounts.reduce((sum, item) => sum + item._count.id, 0);
  const adminCount = userCounts.find(u => u.role === 'ADMIN')?._count.id || 0;
  const tutorCount = userCounts.find(u => u.role === 'TUTOR')?._count.id || 0;
  const learnerCount = userCounts.find(u => u.role === 'LEARNER')?._count.id || 0;

  // Get total courses
  const totalCourses = await prisma.course.count();
  const publishedCourses = await prisma.course.count({ where: { isPublished: true } });

  // Get total enrollments
  const totalEnrollments = await prisma.enrollment.count();

  // Get total applications
  const totalApplications = await prisma.applicant.count();

  // Get recent users (last 5)
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // Get recent applications (last 5)
  const recentApplications = await prisma.applicant.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      courseOfInterest: true,
      createdAt: true,
    },
  });

  return {
    totalUsers,
    adminCount,
    tutorCount,
    learnerCount,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalApplications,
    recentUsers,
    recentApplications,
  };
}

export default async function AdminDashboard() {
  const {
    totalUsers,
    tutorCount,
    learnerCount,
    totalCourses,
    publishedCourses,
    totalEnrollments,
    totalApplications,
    recentUsers,
    recentApplications,
  } = await getAdminDashboardData();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'TUTOR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'LEARNER':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalUsers}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {tutorCount} tutors • {learnerCount} learners
                </p>
              </div>
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#267fc320' }}
              >
                <UsersIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Courses Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Courses
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalCourses}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {publishedCourses} published
                </p>
              </div>
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#4ECDC420' }}
              >
                <BookIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Enrollments Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Enrollments
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalEnrollments}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Active learners
                </p>
              </div>
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#ffc82e20' }}
              >
                <GraduationIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Applications
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalApplications}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Pending review
                </p>
              </div>
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#FF6F6120' }}
              >
                <FileTextIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Users
              </h2>
            </div>
            <div className="p-6">
              {recentUsers.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No users yet
                </p>
              ) : (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-[#267fc3] flex items-center justify-center text-white font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Applications
              </h2>
            </div>
            <div className="p-6">
              {recentApplications.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No applications yet
                </p>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-[#ffc82e] flex items-center justify-center text-gray-900 font-semibold">
                          {app.firstName[0]}{app.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {app.firstName} {app.lastName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {app.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          {app.courseOfInterest.replace(/_/g, ' ')}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(app.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
