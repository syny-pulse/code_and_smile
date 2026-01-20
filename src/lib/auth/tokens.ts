import { randomBytes } from 'crypto';
import prisma from '@/lib/db/prisma';

const PASSWORD_RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
const EMAIL_VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export async function generatePasswordResetToken(email: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY);

  // Delete any existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  // Create new token
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return null;
  }

  if (resetToken.expires < new Date()) {
    // Token expired, delete it
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
    return null;
  }

  return resetToken.email;
}

export async function deletePasswordResetToken(token: string): Promise<void> {
  await prisma.passwordResetToken.delete({
    where: { token },
  }).catch(() => {
    // Ignore if token doesn't exist
  });
}

export async function generateEmailVerificationToken(email: string): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY);

  // Delete any existing tokens for this email
  await prisma.emailVerificationToken.deleteMany({
    where: { email },
  });

  // Create new token
  await prisma.emailVerificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return token;
}

export async function verifyEmailVerificationToken(token: string): Promise<string | null> {
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return null;
  }

  if (verificationToken.expires < new Date()) {
    // Token expired, delete it
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });
    return null;
  }

  return verificationToken.email;
}

export async function deleteEmailVerificationToken(token: string): Promise<void> {
  await prisma.emailVerificationToken.delete({
    where: { token },
  }).catch(() => {
    // Ignore if token doesn't exist
  });
}
