
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
        }

        if (new Date() > resetToken.expires) {
            return NextResponse.json({ message: 'Token expired' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and verify email
        await prisma.user.update({
            where: { email: resetToken.email },
            data: {
                password: hashedPassword,
                isEmailVerified: true,
                emailVerifiedAt: new Date(),
                isActive: true, // Ensure active
            },
        });

        // Delete token
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id },
        });

        return NextResponse.json({ message: 'Password set successfully' }, { status: 200 });

    } catch (error) {
        console.error('Error setting password:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
