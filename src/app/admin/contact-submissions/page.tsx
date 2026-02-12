
import prisma from '@/lib/db/prisma';


export const dynamic = 'force-dynamic';

export default async function ContactSubmissionsPage() {
    const submissions = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Submissions</h1>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Date</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4 hidden md:table-cell">Email</th>
                                <th className="px-6 py-4 hidden lg:table-cell">Subject</th>
                                <th className="px-6 py-4 hidden xl:table-cell">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No submissions found.
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'NEW'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-[#267fc3]">
                                            <a href={`mailto:${item.email}`}>{item.email}</a>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            {item.subject}
                                        </td>
                                        <td className="px-6 py-4 hidden xl:table-cell max-w-xs truncate" title={item.message}>
                                            {item.message}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
