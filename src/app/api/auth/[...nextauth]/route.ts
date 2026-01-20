import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

// Prevent static generation - this route must be dynamic
export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
