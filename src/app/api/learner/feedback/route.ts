import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

// GET - List submissions with feedback for the current learner
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const submissions = await prisma.submission.findMany({
            where: {
                userId: session.user.id,
                // We can choose to show all or only graded. 
                // Showing all allows them to see "Pending" status which is useful.
            },
            include: {
                assignment: {
                    select: {
                        title: true,
                        courseTitle: true,
                        maxScore: true,
                        type: true
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });

        return NextResponse.json({ submissions }, { status: 200 });
    } catch (error) {
        console.error('Error fetching learner feedback:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
