import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create directory if not exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'submissions', session.user.id);
        await mkdir(uploadDir, { recursive: true });

        // Sanitize filename and add timestamp to prevent collisions
        const timestamp = Date.now();
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${safeFilename}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        const publicUrl = `/uploads/submissions/${session.user.id}/${filename}`;

        return NextResponse.json({
            message: 'File uploaded successfully',
            url: publicUrl,
            filename: filename
        });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
