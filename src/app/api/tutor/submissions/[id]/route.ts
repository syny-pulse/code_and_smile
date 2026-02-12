import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const submissionId = params.id;

        // Get tutor's interests/courses to verify access
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { coursesOfInterest: true }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true
                    }
                },
                assignment: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        maxScore: true,
                        courseTitle: true,
                        type: true,
                        submissionFormats: true
                    }
                }
            }
        });

        if (!submission) {
            return NextResponse.json({ message: 'Submission not found' }, { status: 404 });
        }

        // Verify tutor access
        const hasAccess = user.coursesOfInterest.includes(submission.assignment.courseTitle);
        if (!hasAccess) {
            return NextResponse.json({ message: 'Unauthorized access to this submission' }, { status: 403 });
        }

        return NextResponse.json({ submission }, { status: 200 });

    } catch (error) {
        console.error('Error fetching submission:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
