import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import React from 'react';

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// SVG Icons (kept the same as before)
const BookIcon = ({ className, color = "#267fc3" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

const ClipboardIcon = ({ className, color = "#4ECDC4" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

const CheckCircleIcon = ({ className, color = "#22c55e" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="22,4 12,14.01 9,11.01" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrophyIcon = ({ className, color = "#ffc82e" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 22h16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Data fetching (unchanged)
async function getLearnerDashboardData(userId: string) {
  // 1. Get user's enrolled courses (interests)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { coursesOfInterest: true }
  });
  const enrolledTitles = user?.coursesOfInterest || [];

  // 2. Get all lessons and assignments for these courses to calculate totals
  const allLessons = await prisma.lesson.findMany({
    where: { courseTitle: { in: enrolledTitles } },
    select: { id: true, courseTitle: true }
  });

  const allAssignments = await prisma.assignment.findMany({
    where: { courseTitle: { in: enrolledTitles } },
    select: { id: true, courseTitle: true }
  });

  // 3. Get user's progress and submissions
  const lessonProgress = await prisma.progress.findMany({
    where: { userId, completed: true }
  });

  const submissions = await prisma.submission.findMany({
    where: { userId },
    include: { assignment: true } // Need assignment to know courseTitle if needed, or just id
  });

  // 4. Calculate Stats
  const totalEnrolledCourses = enrolledTitles.length;
  const completedLessonsCount = lessonProgress.length;
  const totalLessons = allLessons.length;

  // Pending assignments: Total assignments for enrolled courses - Submissions made
  // Note: This is an approximation. Ideally we check if submission exists for each assignment.
  const submittedAssignmentIds = submissions.map(s => s.assignmentId);
  const pendingAssignments = allAssignments.filter(a => !submittedAssignmentIds.includes(a.id)).length;

  // 5. Construct "Enrollment" objects for UI
  const enrollments = enrolledTitles.map(title => {
    const courseLessons = allLessons.filter(l => l.courseTitle === title);
    const courseAssignments = allAssignments.filter(a => a.courseTitle === title);

    // Calculate progress for this course
    const courseLessonIds = courseLessons.map(l => l.id);
    const courseCompletedCount = lessonProgress.filter(p => courseLessonIds.includes(p.lessonId)).length;
    const progress = courseLessons.length > 0 ? (courseCompletedCount / courseLessons.length) * 100 : 0;

    return {
      id: title, // Use title as ID
      course: {
        title: title.replace(/_/g, ' '),
        lessons: courseLessons,
        assignments: courseAssignments
      },
      progress: progress
    };
  });

  const recentFeedback = submissions
    .filter(s => s.feedback && s.gradedAt)
    .sort((a, b) => new Date(b.gradedAt!).getTime() - new Date(a.gradedAt!).getTime())
    .slice(0, 3);

  return { totalEnrolledCourses, completedLessons: completedLessonsCount, totalLessons, pendingAssignments, enrollments, recentFeedback };
}

export default async function LearnerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const userId = session.user.id;
  const userName = session.user.name || 'Learner';

  const {
    totalEnrolledCourses,
    completedLessons,
    totalLessons,
    pendingAssignments,
    enrollments,
  } = await getLearnerDashboardData(userId);

  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Enrolled Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalEnrolledCourses}</p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#267fc320' }}>
                <BookIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          {/* Completed Lessons */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Lessons Completed</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedLessons}/{totalLessons}</p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#22c55e20' }}>
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          {/* Pending Assignments */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pending Assignments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingAssignments}</p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4ECDC420' }}>
                <ClipboardIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          {/* Overall Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{progressPercentage}%</p>
              </div>
              <div className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ffc82e20' }}>
                <TrophyIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Courses</h2>
          </div>
          <div className="p-6">
            {enrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookIcon className="w-16 h-16 mx-auto mb-4" color="#9CA3AF" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses enrolled yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Start your learning journey by enrolling in a course.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments.map((enrollment) => {
                  const courseProgress = enrollment.progress || 0;
                  return (
                    <div key={enrollment.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{enrollment.course.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{enrollment.course.lessons.length} lessons • {enrollment.course.assignments.length} assignments</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-[#267fc3] h-2 rounded-full transition-all duration-300" style={{ width: `${courseProgress}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{Math.round(courseProgress)}% complete</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
