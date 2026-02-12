import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { compare, hash } from 'bcryptjs';

// GET - Fetch current user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                role: true,
                // Add other fields if needed
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update profile details
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { firstName, lastName, avatar } = body;

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                firstName: firstName ?? undefined,
                lastName: lastName ?? undefined,
                avatar: avatar ?? undefined,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                role: true
            }
        });

        return NextResponse.json({ user: updatedUser, message: 'Profile updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update password
export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Current and new password are required' }, { status: 400 });
        }

        // Get user to check password
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Verify current password
        const isValid = await compare(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 12);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
