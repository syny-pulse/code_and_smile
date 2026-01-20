'use client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      where: { tutorId: user.id },
      include: {
        enrollments: true,
        assignments: {
          select: {
            id: true,
          },
        },
      },
    });

    // Map courses to include counts
    const coursesWithCounts = courses.map(course => ({
      id: course.id,
      title: course.title,
      enrollmentsCount: course.enrollments.length,
      submissionsCount: course.assignments.length,
      description: course.description,
    }));

    return NextResponse.json(coursesWithCounts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    console.log('Received POST data:', data);

    // Validate required fields
    const { title, description } = data;
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        tutorId: user.id,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
