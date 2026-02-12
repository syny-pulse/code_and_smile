'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AddUserModal from '@/components/admin/AddUserModal';
import EditUserModal from '@/components/admin/EditUserModal';

type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
    role: string;
    isEmailVerified: boolean;
    isActive: boolean;
    createdAt: string;
    lastLoggedIn: string | null;
    username: string;
    coursesOfInterest?: string[];
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users', { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        setActionLoading(userId);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isActive: !currentStatus })
            });
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const resendWelcomeEmail = async (userId: string) => {
        setActionLoading(userId);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            if (res.ok) {
                alert('Welcome email resent successfully!');
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to resend email');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to resend email');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Users
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                        {users.length} users
                    </span>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-[#267fc3] text-white rounded-lg hover:bg-[#1a5a8a] flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add User
                    </button>
                </div>
            </div>

            <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Login</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {user.avatar ? (
                                                    <Image
                                                        src={user.avatar}
                                                        alt={user.username}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-500">
                                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                                user.role === 'TUTOR' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${user.isActive
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(user.lastLoggedIn)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {/* Resend Email - only for inactive users */}
                                            {!user.isActive && (
                                                <button
                                                    onClick={() => resendWelcomeEmail(user.id)}
                                                    disabled={actionLoading === user.id}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 dark:hover:bg-blue-900/20"
                                                    title="Resend Welcome Email"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            )}

                                            {/* Activate/Deactivate */}
                                            <button
                                                onClick={() => toggleStatus(user.id, user.isActive)}
                                                disabled={actionLoading === user.id}
                                                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${user.isActive
                                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                    : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                    }`}
                                                title={user.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {user.isActive ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </button>

                                            {/* Edit */}
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-700"
                                                title="Edit User"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
