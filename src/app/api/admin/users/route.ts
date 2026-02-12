
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { sendWelcomeEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

const userSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['ADMIN', 'TUTOR', 'LEARNER']),
    // Course is optional for Admin, but maybe required for Tutor/Learner based on business logic
    // For now making it optional to match schema, but we can enforce it if needed.
    // The schema has courses as a relation (Course[]) or Applicant has CourseOfInterest.
    // But User model doesn't have a direct "courseOfInterest" field, it has enrollments or created courses.
    // Wait, the prompt said "selects the course". If it's a Learner, we probably want to create an Enrollment?
    // Or if it's a Tutor, maybe we assign them to a course?
    // Let's assume for now we just store it if we can, or maybe we need to create an enrollment immediately.
    // Checking Schema again... User has `enrollments`.
    // So if Learner, we create an enrollment.
    // If Tutor, we might just tag them? Tutors create courses usually.
    // START SIMPLE: Just create user. If Learner and course provided, enroll them.
    coursesOfInterest: z.array(z.string()).optional(),
});

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                avatar: true,
                username: true,
                isEmailVerified: true,
                lastLoggedIn: true,
                coursesOfInterest: true,
            }
        });
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = userSchema.parse(body);

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { username: validatedData.email.split('@')[0] } // Basic username generation check
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email or username already exists' },
                { status: 409 }
            );
        }

        // Generate random password (they will reset it anyway)
        const tempPassword = randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create User
        const user = await prisma.user.create({
            data: {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                email: validatedData.email,
                username: validatedData.email.split('@')[0], // Simple username
                password: hashedPassword,
                role: validatedData.role,
                isActive: false, // Inactive until password is set via welcome email
                coursesOfInterest: validatedData.coursesOfInterest || [],
            },
        });

        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.passwordResetToken.create({
            data: {
                email: user.email,
                token,
                expires,
            },
        });

        // Send Email
        await sendWelcomeEmail(user.email, user.firstName, token);

        return NextResponse.json(
            { message: 'User created and invitation sent', userId: user.id },
            { status: 201 }
        );

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error', errors: error.errors }, { status: 400 });
        }
        console.error('Error creating user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { userId, isActive, firstName, lastName, email, role, coursesOfInterest } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const updateData: any = {};
        if (typeof isActive === 'boolean') updateData.isActive = isActive;
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (coursesOfInterest) updateData.coursesOfInterest = coursesOfInterest;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Resend welcome email
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Delete any existing password reset tokens for this user
        await prisma.passwordResetToken.deleteMany({
            where: { email: user.email },
        });

        // Generate new token
        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await prisma.passwordResetToken.create({
            data: {
                email: user.email,
                token,
                expires,
            },
        });

        // Resend welcome email
        await sendWelcomeEmail(user.email, user.firstName, token);

        return NextResponse.json({ message: 'Welcome email resent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error resending welcome email:', error);
        return NextResponse.json({ message: 'Failed to resend welcome email' }, { status: 500 });
    }
}

