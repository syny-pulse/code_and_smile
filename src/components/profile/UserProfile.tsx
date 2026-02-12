'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        firstName: session?.user?.name?.split(' ')[0] || '',
        lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
        bio: '', // Placeholder if we add bio later
    });

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileForm)
            });

            if (res.ok) {
                const data = await res.json();
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name: `${profileForm.firstName} ${profileForm.lastName}`
                    }
                });
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                setIsEditing(false);
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password updated successfully' });
                setIsChangingPassword(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-10 animate-fade-in-up">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                        My Profile
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Manage your personal information and security settings.
                    </p>
                </div>

                {message && (
                    <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 animate-pulse ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                        <div className={`h-2 w-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-bold text-sm tracking-wide uppercase">{message.text}</span>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border border-gray-200 dark:border-gray-700/50 mb-10 shadow-2xl group transition-all duration-300">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-3xl bg-[#267fc3]/10 flex items-center justify-center text-[#267fc3] text-4xl font-extrabold shadow-inner border-2 border-[#267fc3]/20 group-hover:scale-105 transition-transform duration-500">
                                {session?.user?.name?.[0] || 'U'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
                        </div>
                        <div className="flex-1 w-full text-center md:text-left">
                            {isEditing ? (
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">First Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.firstName}
                                                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#267fc3] focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                value={profileForm.lastName}
                                                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#267fc3] focus:border-transparent transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-8 py-3 bg-[#267fc3] text-white font-bold rounded-xl hover:bg-[#1e6ca8] transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-8 py-3 bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-900 transition-all border border-gray-200 dark:border-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                                            {session?.user?.name || 'User'}
                                        </h2>
                                        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                                            {session?.user?.email}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                                        <span className="px-4 py-2 rounded-xl text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">
                                            {session?.user?.role}
                                        </span>
                                        <button
                                            onClick={() => {
                                                setProfileForm({
                                                    firstName: session?.user?.name?.split(' ')[0] || '',
                                                    lastName: session?.user?.name?.split(' ').slice(1).join(' ') || '',
                                                    bio: ''
                                                });
                                                setIsEditing(true);
                                            }}
                                            className="px-6 py-2 text-sm font-bold text-[#267fc3] hover:bg-[#267fc3]/10 border border-[#267fc3]/20 rounded-xl transition-all"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border border-gray-200 dark:border-gray-700/50 shadow-2xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center border border-gray-100 dark:border-gray-700/50 shadow-sm">
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Security</h3>
                        </div>
                        {!isChangingPassword && (
                            <button
                                onClick={() => setIsChangingPassword(true)}
                                className="px-6 py-2 text-sm font-bold text-[#267fc3] hover:bg-[#267fc3]/10 border border-[#267fc3]/20 rounded-xl transition-all"
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {isChangingPassword && (
                        <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-6 animate-fade-in-down">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#267fc3] focus:border-transparent transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#267fc3] focus:border-transparent transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#267fc3] focus:border-transparent transition-all outline-none"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-3 bg-[#267fc3] text-white font-bold rounded-xl hover:bg-[#1e6ca8] transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                >
                                    Update Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    }}
                                    className="px-8 py-3 bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-900 transition-all border border-gray-200 dark:border-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
