import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's interests (Tutor)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { coursesOfInterest: true }
    });
    const courseTitles = dbUser?.coursesOfInterest || [];

    // Get counts
    // Count learners who have these courses in their interests
    const interestedUsers = await prisma.user.findMany({
      where: {
        role: 'LEARNER',
        coursesOfInterest: { hasSome: courseTitles }
      },
      select: { coursesOfInterest: true }
    });

    // Count per course
    const enrollmentCounts = new Map<string, number>();
    courseTitles.forEach(title => {
      const count = interestedUsers.filter(u => u.coursesOfInterest.includes(title)).length;
      enrollmentCounts.set(title, count);
    });

    const assignmentCounts = await prisma.assignment.groupBy({
      by: ['courseTitle'],
      where: { courseTitle: { in: courseTitles } },
      _count: { id: true }
    });

    // Map to course objects
    const coursesWithCounts = courseTitles.map(title => {
      const enrollCount = enrollmentCounts.get(title) || 0;
      const assignCount = assignmentCounts.find(c => c.courseTitle === title)?._count.id || 0;

      return {
        id: title,
        title: title.replace(/_/g, ' '),
        enrollmentsCount: enrollCount,
        submissionsCount: assignCount, // Maintaining field name from original code
        description: '', // Description is no longer centralized
      };
    });

    return NextResponse.json(coursesWithCounts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Course creation is now handled automatically via Lesson creation.' }, { status: 405 });
}
