import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { z } from 'zod';

const updateSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    modules: z.array(z.object({
        id: z.string().optional(),
        title: z.string().min(1),
        resources: z.array(z.object({
            name: z.string(),
            url: z.string().url()
        })),
        order: z.number().optional()
    })).optional()
});

// Helper to verify access
async function verifyAccess(lessonId: string, userId: string) {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { id: true, courseTitle: true } // Select courseTitle
    });

    if (!lesson) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { coursesOfInterest: true }
    });

    // Check if lesson's courseTitle is in user's interests
    const hasAccess = user?.coursesOfInterest.includes(lesson.courseTitle);

    if (!hasAccess) return null;
    return lesson;
}

// GET single lesson
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Check access first
        const accessParams = await verifyAccess(params.id, session.user.id);
        if (!accessParams) {
            return NextResponse.json({ message: 'Lesson not found or unauthorized' }, { status: 404 });
        }

        const lesson = await prisma.lesson.findUnique({
            where: { id: params.id },
            include: {
                modules: { orderBy: { order: 'asc' } }
            }
        });

        return NextResponse.json({ lesson }, { status: 200 });
    } catch (error) {
        console.error('Error fetching lesson:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update lesson and modules
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const accessParams = await verifyAccess(params.id, session.user.id);
        if (!accessParams) {
            return NextResponse.json({ message: 'Lesson not found or unauthorized' }, { status: 404 });
        }

        const body = await request.json();
        const validatedData = updateSchema.parse(body);

        // Update lesson
        const updatedLesson = await prisma.lesson.update({
            where: { id: params.id },
            data: {
                title: validatedData.title,
                description: validatedData.description
            }
        });

        // Update modules if provided
        if (validatedData.modules) {
            // Delete existing modules
            await prisma.module.deleteMany({ where: { lessonId: params.id } });

            // Create new modules
            if (validatedData.modules.length > 0) {
                await prisma.module.createMany({
                    data: validatedData.modules.map((m, idx) => ({
                        lessonId: params.id,
                        title: m.title,
                        resources: m.resources,
                        order: m.order ?? idx
                    }))
                });
            }
        }

        const result = await prisma.lesson.findUnique({
            where: { id: params.id },
            include: { modules: { orderBy: { order: 'asc' } } }
        });

        return NextResponse.json({ lesson: result }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
        }
        console.error('Error updating lesson:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE lesson
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const accessParams = await verifyAccess(params.id, session.user.id);
        if (!accessParams) {
            return NextResponse.json({ message: 'Lesson not found or unauthorized' }, { status: 404 });
        }

        await prisma.lesson.delete({ where: { id: params.id } });

        return NextResponse.json({ message: 'Lesson deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
