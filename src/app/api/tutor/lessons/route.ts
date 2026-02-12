import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { z } from 'zod';

const lessonSchema = z.object({
    courseTitle: z.string().min(1, 'Course title is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    modules: z.array(z.object({
        title: z.string().min(1),
        resources: z.array(z.object({
            name: z.string(),
            url: z.string().url()
        })),
        order: z.number().optional()
    })).optional()
});

// GET - Return user's coursesOfInterest as the available courses
// AND fetch lessons matching those titles
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            console.log('[API] GET /api/tutor/lessons - Unauthorized');
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        console.log(`[API] Fetching lessons for user: ${session.user.id}`);

        // Fetch user to get coursesOfInterest
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { coursesOfInterest: true }
        });

        console.log('[API] User found:', user ? 'Yes' : 'No');
        const rawInterests = user?.coursesOfInterest || [];
        console.log('[API] Raw Interests:', rawInterests);

        // Map interests directly to course objects
        const courses = rawInterests.map(interest => ({
            id: interest, // ID is now the string itself
            title: interest.replace(/_/g, ' ')
        }));

        console.log(`[API] Returning ${courses.length} courses based on interests`);

        // Fetch lessons where courseTitle matches any of the interests
        const lessons = await prisma.lesson.findMany({
            where: {
                courseTitle: { in: rawInterests }
            },
            include: {
                modules: { orderBy: { order: 'asc' } },
                _count: { select: { assignments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Add "course" object to lesson for frontend compatibility
        const formattedLessons = lessons.map(lesson => ({
            ...lesson,
            course: { title: lesson.courseTitle }
        }));

        return NextResponse.json({ lessons: formattedLessons, courses }, { status: 200 });
    } catch (error) {
        console.error('[API] Error fetching lessons:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new lesson with modules
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        // Map courseId to courseTitle for validation if needed, or just expect courseTitle from frontend
        // If frontend sends courseId, we treat it as courseTitle
        const dataToValidate = {
            ...body,
            courseTitle: body.courseId || body.courseTitle
        };

        const validatedData = lessonSchema.parse(dataToValidate);

        console.log('[API] Creating lesson for courseTitle:', validatedData.courseTitle);

        // No Course lookup needed. Just save any string.

        // Get next order
        const lastLesson = await prisma.lesson.findFirst({
            where: { courseTitle: validatedData.courseTitle },
            orderBy: { order: 'desc' }
        });
        const nextOrder = (lastLesson?.order ?? -1) + 1;

        // Create lesson with modules
        const lesson = await prisma.lesson.create({
            data: {
                courseTitle: validatedData.courseTitle,
                title: validatedData.title,
                description: validatedData.description,
                order: nextOrder,
                modules: validatedData.modules ? {
                    create: validatedData.modules.map((m, idx) => ({
                        title: m.title,
                        resources: m.resources,
                        order: m.order ?? idx
                    }))
                } : undefined
            },
            include: { modules: true }
        });

        return NextResponse.json({ lesson }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
        }
        console.error('Error creating lesson:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
