'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to access this resource.',
  },
  Verification: {
    title: 'Verification Error',
    description: 'The verification link may have expired or already been used.',
  },
  OAuthSignin: {
    title: 'OAuth Sign-in Error',
    description: 'Could not start the sign-in process. Please try again.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'Could not complete the sign-in process. Please try again.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'Could not create your account. The email may already be in use.',
  },
  EmailCreateAccount: {
    title: 'Account Creation Error',
    description: 'Could not create your account. Please try again.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'An error occurred during the authentication callback.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'This email is already associated with another account. Please sign in using your original method.',
  },
  EmailSignin: {
    title: 'Email Sign-in Error',
    description: 'Could not send the sign-in email. Please try again.',
  },
  CredentialsSignin: {
    title: 'Sign-in Failed',
    description: 'Invalid email or password. Please check your credentials and try again.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'Please sign in to access this page.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred. Please try again.',
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  const { title, description } = errorMessages[error] || errorMessages.Default;

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

        {/* Error Card */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-8">{description}</p>

          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="btn-primary inline-flex items-center justify-center w-full"
            >
              Try Again
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

        {/* Support Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help?{' '}
            <Link href="/contact" className="text-[#267fc3] hover:text-[#1a5a8a] font-semibold transition-colors">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-yellow-50/20 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <svg className="animate-spin w-12 h-12 text-[#267fc3] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
