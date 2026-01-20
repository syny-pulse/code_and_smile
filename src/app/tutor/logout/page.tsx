'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Add logout logic here (e.g., clear auth tokens)
    // For now, just redirect to home page after logout
    router.push('/');
  }, [router]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Logging out...</h1>
      <p>You are being logged out. Please wait...</p>
    </div>
  );
}
