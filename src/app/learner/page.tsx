'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ComputerIcon = () => (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
    <path d="M8 21h8M12 17v4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="16,18 22,12 16,6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="8,6 2,12 8,18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function LearnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      if (email.toLowerCase().includes('tutor')) {
        router.push('/tutor');
      } else if (email.toLowerCase().includes('learner')) {
        router.push('/learner/dashboard');
      } else {
        setError('Invalid credentials.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#267fc3] to-[#1a5a8a] relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 opacity-10">
              <ComputerIcon />
            </div>
            <div className="absolute bottom-32 right-20 opacity-10">
              <CodeIcon />
            </div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#ffc82e]/10 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-16 space-y-8">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-white text-3xl font-bold">C</span>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-white">
                  Welcome back to
                  <br />
                  <span className="text-[#ffc82e]">your learning journey</span>
                </h2>
                <p className="text-xl text-white/80 max-w-lg leading-relaxed">
                  Continue building your digital skills and unlock new opportunities in the global digital economy.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {['JA', 'MK', 'SW'].map((initials, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-white/80 text-sm">
                  Join 150+ students learning with CAS Academy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-12 bg-gray-50">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Branding */}
            <div className="lg:hidden text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#267fc3] to-[#1a5a8a] rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CAS Academy</h1>
                <p className="text-sm text-[#267fc3]">Learner Portal</p>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Sign in to your account
                </h2>
                <p className="text-gray-500">
                  Continue your digital skills journey
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <UserIcon />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#267fc3]/20 focus:border-[#267fc3] transition-all bg-gray-50 hover:bg-white"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <LockIcon />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#267fc3]/20 focus:border-[#267fc3] transition-all bg-gray-50 hover:bg-white"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <a href="#" className="text-sm font-medium text-[#267fc3] hover:text-[#1a5a8a] transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </form>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
