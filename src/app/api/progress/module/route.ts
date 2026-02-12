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

        const { lessonId, moduleId, completed } = await request.json();

        if (!lessonId || !moduleId) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
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

        // Create if not exists
        if (!progress) {
            progress = await prisma.progress.create({
                data: {
                    userId: session.user.id,
                    lessonId: lessonId,
                    completedModules: completed ? [moduleId] : [],
                    completed: false, // Update logic below
                    lastAccessAt: new Date()
                }
            });
        } else {
            // Update existing
            let newCompletedModules = progress.completedModules || [];

            if (completed) {
                if (!newCompletedModules.includes(moduleId)) {
                    newCompletedModules.push(moduleId);
                }
            } else {
                newCompletedModules = newCompletedModules.filter(id => id !== moduleId);
            }

            progress = await prisma.progress.update({
                where: { id: progress.id },
                data: {
                    completedModules: newCompletedModules,
                    lastAccessAt: new Date()
                }
            });
        }

        // Check if all modules are completed
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: { modules: true }
        });

        const totalModules = lesson?.modules.length || 0;
        const completedCount = progress.completedModules.length;

        // Mark lesson as complete if all modules are done
        // Also handle case where there are no modules? Maybe assume completed if visited?
        const isLessonComplete = totalModules > 0 && completedCount >= totalModules;

        if (progress.completed !== isLessonComplete) {
            await prisma.progress.update({
                where: { id: progress.id },
                data: { completed: isLessonComplete }
            });
        }

        return NextResponse.json({
            message: 'Progress updated',
            completedModules: progress.completedModules,
            lessonCompleted: isLessonComplete
        });

    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
