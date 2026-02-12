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

        const { lessonId, completed } = await request.json();

        if (!lessonId) {
            return NextResponse.json({ message: 'Missing lessonId' }, { status: 400 });
        }

        // Get current progress
        let progress = await prisma.progress.findUnique({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId: lessonId
                }
            }
        });

        if (!progress) {
            // If no progress exists, create it
            progress = await prisma.progress.create({
                data: {
                    userId: session.user.id,
                    lessonId: lessonId,
                    completed: completed,
                    completedModules: [], // Initialize empty
                    lastAccessAt: new Date()
                }
            });
        } else {
            // Update existing progress
            progress = await prisma.progress.update({
                where: { id: progress.id },
                data: {
                    completed: completed,
                    lastAccessAt: new Date()
                }
            });
        }

        return NextResponse.json({
            message: 'Lesson progress updated',
            completed: progress.completed
        });

    } catch (error) {
        console.error('Error updating lesson progress:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
