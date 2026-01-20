'use client';

export default function LearnerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          Learner Dashboard
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Welcome to the Learner Dashboard. Here you can access your courses and track your progress.
        </p>
      </div>
    </div>
  );
}
