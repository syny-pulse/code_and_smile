import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/db/prisma';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Return success with role (don't return sensitive data)
        return NextResponse.json({
            success: true,
            role: user.role,
        });
    } catch (error) {
        console.error('Verify credentials error:', error);
        return NextResponse.json(
            { success: false, error: 'An error occurred during verification' },
            { status: 500 }
        );
    }
}
