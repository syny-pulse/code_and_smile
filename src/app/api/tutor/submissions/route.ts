import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

// GET - List all submissions for tutor's assignments
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Get tutor's interests
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { coursesOfInterest: true }
        });
        const courseTitles = user?.coursesOfInterest || [];

        const submissions = await prisma.submission.findMany({
            where: {
                assignment: { courseTitle: { in: courseTitles } }
            },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true } },
                assignment: {
                    select: {
                        title: true,
                        maxScore: true,
                        courseTitle: true // We need this to simulate course relation
                    }
                }
            },
            orderBy: { submittedAt: 'desc' }
        });

        // Add course object to assignment for frontend compatibility
        const formattedSubmissions = submissions.map(sub => ({
            ...sub,
            assignment: {
                ...sub.assignment,
                course: { title: sub.assignment.courseTitle }
            }
        }));

        return NextResponse.json({ submissions: formattedSubmissions }, { status: 200 });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update submission (score and feedback)
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { submissionId, score, feedback } = body;

        if (!submissionId) {
            return NextResponse.json({ message: 'Submission ID required' }, { status: 400 });
        }

        // Verify tutor access
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { coursesOfInterest: true }
        });

        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: { assignment: true }
        });

        if (!submission) {
            return NextResponse.json({ message: 'Submission not found' }, { status: 404 });
        }

        // Authorization check: Is the course in tutor's interests?
        const hasAccess = user?.coursesOfInterest.includes(submission.assignment.courseTitle);

        if (!hasAccess) {
            return NextResponse.json({ message: 'Unauthorized access to this submission' }, { status: 403 });
        }

        const updated = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                score: score !== undefined ? score : undefined,
                feedback: feedback !== undefined ? feedback : undefined,
                gradedAt: new Date()
            }
        });

        return NextResponse.json({ submission: updated }, { status: 200 });
    } catch (error) {
        console.error('Error updating submission:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
