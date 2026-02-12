import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

// GET - List learners enrolled in tutor's courses
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get tutor's interests
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { coursesOfInterest: true }
        });
        const tunerCourses = user?.coursesOfInterest || [];

        // 2. Find students who have these courses in their interests
        // Prisma doesn't strictly support "array overlaps" easily in all DBs with `hasSome`, but Postgres does.
        const students = await prisma.user.findMany({
            where: {
                role: 'LEARNER',
                coursesOfInterest: { hasSome: tunerCourses }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                lastLoggedIn: true,
                coursesOfInterest: true
            }
        });

        // 3. Get total lessons count per course (only for courses tutor cares about)
        const lessons = await prisma.lesson.groupBy({
            by: ['courseTitle'],
            where: { courseTitle: { in: tunerCourses } },
            _count: { id: true }
        });

        const courseLessonCounts = new Map<string, number>();
        lessons.forEach(l => courseLessonCounts.set(l.courseTitle, l._count.id));

        // 4. Get progress for these students
        // We fetch all completed progress for these students to calculate %
        const studentIds = students.map(s => s.id);
        const progressRecords = await prisma.progress.findMany({
            where: {
                userId: { in: studentIds },
                completed: true,
                lesson: { courseTitle: { in: tunerCourses } } // Only count progress for relevant courses
            },
            include: { lesson: { select: { courseTitle: true } } }
        });

        // 5. Construct Response
        const learners = students.map(student => {
            // Filter student's courses to only those the tutor teaches (is interested in)
            const relevantCourses = student.coursesOfInterest.filter(c => tunerCourses.includes(c));

            const coursesData = relevantCourses.map(courseTitle => {
                const total = courseLessonCounts.get(courseTitle) || 0;
                const completed = progressRecords.filter(p => p.userId === student.id && p.lesson.courseTitle === courseTitle).length;
                const percent = total > 0 ? (completed / total) * 100 : 0;

                return {
                    id: courseTitle,
                    title: courseTitle.replace(/_/g, ' '),
                    enrolledAt: student.createdAt, // Approximate enrollment date as user creation date, or just creation date
                    progress: percent
                };
            });

            return {
                user: {
                    id: student.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    email: student.email,
                    createdAt: student.createdAt,
                    lastLoggedIn: student.lastLoggedIn
                },
                courses: coursesData
            };
        });

        const courses = tunerCourses.map(title => ({ id: title, title: title.replace(/_/g, ' ') }));

        return NextResponse.json({ learners, courses }, { status: 200 });
    } catch (error) {
        console.error('Error fetching learners:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
