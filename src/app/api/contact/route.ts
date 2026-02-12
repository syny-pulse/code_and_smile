
import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma'; // Assuming prisma is exported from here
import { sendContactFormAcknowledgement, sendContactFormAdminAlert } from '@/lib/email';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = contactSchema.parse(body);

        const submission = await prisma.contactSubmission.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                subject: validatedData.subject,
                message: validatedData.message,
            },
        });

        // Send acknowledgement email to user
        await sendContactFormAcknowledgement(validatedData.email, validatedData.name);

        // Send alert email to admin
        await sendContactFormAdminAlert({
            name: validatedData.name,
            email: validatedData.email,
            subject: validatedData.subject,
            message: validatedData.message,
        });

        return NextResponse.json(
            { message: 'Message sent successfully', id: submission.id },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: 'Validation error', errors: error.errors },
                { status: 400 }
            );
        }

        console.error('Error saving contact submission:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
