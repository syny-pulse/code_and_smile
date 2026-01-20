import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcrypt';

import prisma from '@/lib/db/prisma';

// Simple in-memory cache for failed login attempts
const failedLoginAttempts: Record<string, { count: number; lastAttempt: number }> = {};
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

function isLocked(email: string) {
  const attempt = failedLoginAttempts[email];
  if (!attempt) return false;
  if (attempt.count >= MAX_ATTEMPTS) {
    const now = Date.now();
    if (now - attempt.lastAttempt < LOCK_TIME) {
      return true;
    } else {
      // Reset after lock time
      delete failedLoginAttempts[email];
      return false;
    }
  }
  return false;
}

function recordFailedAttempt(email: string) {
  const now = Date.now();
  if (!failedLoginAttempts[email]) {
    failedLoginAttempts[email] = { count: 1, lastAttempt: now };
  } else {
    failedLoginAttempts[email].count += 1;
    failedLoginAttempts[email].lastAttempt = now;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (isLocked(credentials.email)) {
          console.warn(`Account locked due to too many failed login attempts: ${credentials.email}`);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          recordFailedAttempt(credentials.email);
          console.warn(`Failed login attempt for non-existent user: ${credentials.email}`);
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          recordFailedAttempt(credentials.email);
          console.warn(`Failed login attempt due to invalid password: ${credentials.email}`);
          return null;
        }

        // Reset failed attempts on successful login
        if (failedLoginAttempts[credentials.email]) {
          delete failedLoginAttempts[credentials.email];
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'ADMIN' | 'TUTOR' | 'LEARNER';
        session.user.username = token.username as string;
      }
      return session;
    },
  },
};
