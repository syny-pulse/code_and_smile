'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function SignOutPage() {
  const [isSigningOut, setIsSigningOut] = useState(true);

  useEffect(() => {
    const performSignOut = async () => {
      try {
        await signOut({ redirect: false });
      } finally {
        setIsSigningOut(false);
      }
    };

    performSignOut();
  }, []);

  if (isSigningOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 text-[#267fc3] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Signing out...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20 flex items-center justify-center px-4 py-12">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#267fc3]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#ffc82e]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#267fc3] to-[#1a5a8a] flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">CAS Academy</span>
          </Link>
        </div>

        {/* Sign Out Card */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Signed Out Successfully</h2>
          <p className="text-gray-600 mb-8">
            You have been successfully signed out of your account.
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="btn-primary inline-flex items-center justify-center w-full"
            >
              Sign In Again
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center justify-center gap-2"
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
  );
}
