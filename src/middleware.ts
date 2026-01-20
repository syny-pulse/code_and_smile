import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = [
  '/learner',
  '/tutor',
  // add other protected routes here
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the request is for a protected path
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // Redirect to sign-in page if not authenticated
      const signInUrl = new URL('/auth/signin', req.url);
      signInUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// Specify the paths where middleware should run
export const config = {
  matcher: ['/learner/:path*', '/tutor/:path*'],
};
