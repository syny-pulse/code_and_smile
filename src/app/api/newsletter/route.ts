
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { sendNewsletterWelcomeEmail } from '@/lib/email';
import { z } from 'zod';

const newsletterSchema = z.object({
    email: z.string().email('Invalid email address'),
    firstName: z.string().optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = newsletterSchema.parse(body);

        // Check if already subscribed
        const existingInterest = await prisma.newsletterSubscription.findUnique({
            where: { email: validatedData.email },
        });

        if (existingInterest) {
            if (!existingInterest.isActive) {
                // Reactivate if previously unsubscribed
                await prisma.newsletterSubscription.update({
                    where: { email: validatedData.email },
                    data: {
                        isActive: true,
                        firstName: validatedData.firstName // Update name if provided
                    },
                });
                return NextResponse.json({ message: 'Welcome back!' }, { status: 200 });
            }
            return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
        }

        const subscription = await prisma.newsletterSubscription.create({
            data: {
                email: validatedData.email,
                firstName: validatedData.firstName,
            },
        });

        // Send welcome email
        if (subscription.isActive) {
            await sendNewsletterWelcomeEmail(subscription.email, subscription.firstName || undefined);
        }

        return NextResponse.json(
            { message: 'Subscribed successfully', id: subscription.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: 'Validation error', errors: error.errors },
                { status: 400 }
            );
        }

        console.error('Error saving newsletter subscription:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
