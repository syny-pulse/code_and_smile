import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { z } from 'zod';

const assignmentSchema = z.object({
    courseId: z.string(), // acting as Title now
    lessonId: z.string().uuid().optional().nullable(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    type: z.enum(['QUIZ', 'CODING', 'ESSAY']),
    submissionFormats: z.array(z.string()),
    maxScore: z.number().min(1).default(100),
    dueDate: z.string().optional().nullable()
});

// GET - List assignments for tutor's courses
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { coursesOfInterest: true }
        });
        const courseTitles = user?.coursesOfInterest || [];

        // Map titles to objects for frontend compatibility
        const courses = courseTitles.map(title => ({ id: title, title: title.replace(/_/g, ' ') }));

        const assignments = await prisma.assignment.findMany({
            where: { courseTitle: { in: courseTitles } },
            include: {
                lesson: { select: { title: true } },
                _count: { select: { submissions: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Add course object to assignments for frontend compatibility
        const formattedAssignments = assignments.map(a => ({
            ...a,
            course: { title: a.courseTitle }
        }));

        // Get lessons for assignment creation form (matching course titles)
        const lessons = await prisma.lesson.findMany({
            where: { courseTitle: { in: courseTitles } },
            select: { id: true, title: true, courseTitle: true }
        });

        // Format lessons for frontend
        const formattedLessons = lessons.map(l => ({
            ...l,
            courseId: l.courseTitle // Use title as ID for frontend correlation
        }));

        return NextResponse.json({ assignments: formattedAssignments, courses, lessons: formattedLessons }, { status: 200 });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new assignment
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = assignmentSchema.parse({
            ...body,
            // If frontend sends UUID-like courseId, we might need to handle it. 
            // But assume frontend now sends/selects from the "courses" list we sent above.
        });

        // Verify tutor access to this course title
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { coursesOfInterest: true }
        });

        // For now, simple check if it's in their list
        // Note: validatedData.courseId here acts as the Title string
        const hasAccess = user?.coursesOfInterest.includes(validatedData.courseId);

        if (!hasAccess) {
            return NextResponse.json({ message: 'Course not found or unauthorized' }, { status: 403 });
        }

        const assignment = await prisma.assignment.create({
            data: {
                courseTitle: validatedData.courseId, // Save as title
                lessonId: validatedData.lessonId || null,
                title: validatedData.title,
                description: validatedData.description,
                type: validatedData.type,
                submissionFormats: validatedData.submissionFormats,
                maxScore: validatedData.maxScore,
                dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null
            }
        });

        return NextResponse.json({ assignment }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
        }
        console.error('Error creating assignment:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
