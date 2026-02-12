import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { assignmentId, answers } = body;

        if (!assignmentId || !answers) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
        }

        // Check if submission already exists? Or allow multiple?
        // Schema says unique([userId, assignmentId]). So only one allowing updates?
        // "upsert" is better.

        const submission = await prisma.submission.upsert({
            where: {
                userId_assignmentId: {
                    userId: session.user.id,
                    assignmentId: assignmentId
                }
            },
            update: {
                answers: answers,
                submittedAt: new Date()
            },
            create: {
                userId: session.user.id,
                assignmentId: assignmentId,
                answers: answers,
                submittedAt: new Date()
            }
        });

        return NextResponse.json({ message: 'Assignment submitted successfully', submission });

    } catch (error) {
        console.error('Error submitting assignment:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
