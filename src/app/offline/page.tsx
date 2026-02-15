'use client';

import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-reload when back online
  useEffect(() => {
    if (isOnline) {
      window.location.href = '/';
    }
  }, [isOnline]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#267fc3] via-[#1a5a8a] to-[#267fc3] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Offline Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M8.464 15.536a5 5 0 010-7.072M15.536 8.464a5 5 0 010 7.072M12 12h.01" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">You&apos;re Offline</h1>
        <p className="text-white/70 text-lg mb-8">
          It looks like you&apos;ve lost your internet connection. Please check your connection and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="bg-[#ffc82e] text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-[#e6b329] transition-all duration-300 inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>

        <p className="text-white/40 text-sm mt-8">CAS Academy</p>
      </div>
    </div>
  );
}
