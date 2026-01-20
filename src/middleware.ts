import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = [
  '/learner',
  '/tutor',
  '/admin',
];

// Role-based access control mapping
const roleAccessMap: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/tutor': ['ADMIN', 'TUTOR'],
  '/learner': ['ADMIN', 'TUTOR', 'LEARNER', 'APPLICANT'],
};

// Get the appropriate dashboard for a role
function getDashboardForRole(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'TUTOR':
      return '/tutor/dashboard';
    default:
      return '/learner/dashboard';
  }
}

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

    // Check role-based access
    const userRole = token.role as string;

    // Find which protected path this request matches
    for (const [path, allowedRoles] of Object.entries(roleAccessMap)) {
      if (pathname.startsWith(path)) {
        if (!allowedRoles.includes(userRole)) {
          // User doesn't have permission - redirect to their appropriate dashboard
          const redirectUrl = new URL(getDashboardForRole(userRole), req.url);
          return NextResponse.redirect(redirectUrl);
        }
        break;
      }
    }
  }

  return NextResponse.next();
}

// Specify the paths where middleware should run
export const config = {
  matcher: ['/learner/:path*', '/tutor/:path*', '/admin/:path*'],
};
