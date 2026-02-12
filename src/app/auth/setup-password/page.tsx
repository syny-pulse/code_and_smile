
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SetupPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!token) {
        return <div className="p-10 text-center text-red-500">Invalid or missing token.</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');

        try {
            // We need an API endpoint for this.
            // Let's create /api/auth/setup-password
            const res = await fetch('/api/auth/setup-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            if (res.ok) {
                alert('Password set successfully! Redirecting to login...');
                router.push('/auth/signin');
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to set password');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Set Your Password</h1>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">New Password</label>
                        <input
                            type="password"
                            className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#267fc3]"
                            required
                            minLength={6}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-[#267fc3]"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#267fc3] text-white rounded-lg font-semibold hover:bg-[#1a5a8a] disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Setting Password...' : 'Set Password & Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
