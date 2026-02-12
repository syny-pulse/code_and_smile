import prisma from '@/lib/db/prisma';

export default async function AdminApplicationsPage() {
    const applications = await prisma.applicant.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Applications
                </h1>
                <div className="text-sm text-gray-500">
                    Showing {applications.length} applications
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-medium">
                            <tr>
                                <th className="px-6 py-4">Applicant</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Contact</th>
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4 hidden md:table-cell text-right">Applied Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {app.firstName} {app.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 dark:text-white">{app.email}</span>
                                            <span className="text-xs text-gray-500">{app.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                            {app.courseOfInterest.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell text-right">
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No applications found
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
